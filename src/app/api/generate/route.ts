import { NextResponse } from "next/server";
import { generateImages } from "@/lib/ai-providers";
import { buildPrompt } from "@/lib/prompts";
import type { InfluencerType, Platform, ContentStyle } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, canGenerate } from "@/lib/database";
import type { Profile } from "@/lib/database";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Fetch profile & check credits
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (profileError || !profileData) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const profile = profileData as unknown as Profile;

        const body = await request.json();
        const {
            productImageUrl,
            influencerType,
            platform,
            contentStyle,
            numImages = 4,
        } = body as {
            productImageUrl?: string;
            influencerType: InfluencerType;
            platform: Platform;
            contentStyle: ContentStyle;
            numImages: number;
        };

        const { allowed, reason } = canGenerate(profile, numImages);
        if (!allowed) {
            return NextResponse.json({ error: reason }, { status: 403 });
        }

        // 3. Simple Queue: Check for active generations
        const { count, error: activeError } = await supabase
            .from("generations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .in("status", ["pending", "processing"]);

        if (count && count > 0) {
            return NextResponse.json(
                { error: "You already have a generation in progress. Please wait for it to complete." },
                { status: 429 }
            );
        }

        // Build the prompt from templates
        const prompt = buildPrompt({
            influencerType,
            contentStyle,
            platform,
        });

        // 4. Create Generation Record (Processing)
        const { data: generationRecord, error: insertError } = await supabase
            .from("generations")
            .insert({
                user_id: user.id,
                product_image_url: productImageUrl,
                influencer_type: influencerType,
                platform: platform,
                content_style: contentStyle,
                num_images: numImages,
                prompt_used: prompt,
                status: "processing", // initial status
            })
            .select()
            .single();

        if (insertError) {
            console.error("Failed to create generation record:", insertError);
            return NextResponse.json({ error: "Failed to initialize generation" }, { status: 500 });
        }

        try {
            // Generate images using the configured provider
            const result = await generateImages({
                prompt,
                numImages,
                productImageUrl,
                width: 1024, // High quality standard
                height: 1024,
            });

            // Update Generation Record to Completed
            await supabase
                .from("generations")
                .update({
                    generated_image_urls: result.images,
                    status: "completed",
                })
                .eq("id", generationRecord.id);

            // Deduct credits (we deduct the number of images generated)
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    monthly_images_used: profile.monthly_images_used + numImages,
                })
                .eq("id", user.id);

            if (updateError) {
                console.error("Failed to deduct credits:", updateError);
            }

            return NextResponse.json({
                images: result.images,
                prompt,
                provider: result.provider,
                model: result.model,
                generationId: generationRecord.id,
            });
        } catch (generationError) {
            // Mark generation as failed
            await supabase
                .from("generations")
                .update({
                    status: "failed",
                    error: generationError instanceof Error ? generationError.message : "Unknown error",
                })
                .eq("id", generationRecord.id);

            throw generationError;
        }
    } catch (error) {
        console.error("Generation error:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to generate images",
            },
            { status: 500 }
        );
    }
}
