// InfluencedAI — Prompt Template System

import type { InfluencerType, ContentStyle, Platform } from "./constants";

const INFLUENCER_PROMPTS: Record<InfluencerType, string> = {
    lifestyle:
        "realistic instagram lifestyle influencer holding the product, natural lighting, phone camera aesthetic, social media post style, casual vibe",
    fashion:
        "high fashion influencer showcasing the product, editorial style photo, trendy outfit, fashion magazine aesthetic, studio quality",
    fitness:
        "fitness influencer reviewing the product in a gym environment, selfie style photo, natural lighting, instagram aesthetic, athletic wear",
    beauty:
        "beauty influencer presenting the product, close-up beauty shot, soft lighting, beauty blog aesthetic, flawless skin",
    tech:
        "tech influencer holding and reviewing the product at a desk setup, youtube tech reviewer style, realistic lighting, modern workspace",
    streetwear:
        "streetwear influencer wearing/holding the product, urban environment, street photography style, hypebeast aesthetic, authentic vibes",
};

const CONTENT_STYLE_MODIFIERS: Record<ContentStyle, string> = {
    selfie:
        "selfie angle, front-facing camera perspective, social media selfie style, close-up portrait with product",
    lifestyle_photo:
        "full body lifestyle shot, natural environment, candid feel, editorial lifestyle photography",
    product_review:
        "product review style, holding product prominently, explaining features, youtube/instagram review format",
    ugc:
        "user generated content style photo, smartphone camera look, casual influencer vibe, authentic social media aesthetic, slightly imperfect framing",
    ad_creative:
        "professional product lifestyle advertisement featuring influencer holding the product, modern social media ad style, clean composition, brand-ready",
};

const PLATFORM_MODIFIERS: Record<Platform, string> = {
    instagram:
        "instagram post format, square crop friendly, instagram aesthetic, high engagement style",
    tiktok:
        "tiktok style vertical format, trendy aesthetic, gen-z appeal, vibrant colors, dynamic pose",
    youtube_shorts:
        "youtube thumbnail style, eye-catching, bright colors, expressive pose, vertical format",
    ad_creative:
        "professional advertising creative, brand-safe, polished, commercial photography style, ad campaign ready",
};

export function buildPrompt({
    influencerType,
    contentStyle,
    platform,
    productDescription,
}: {
    influencerType: InfluencerType;
    contentStyle: ContentStyle;
    platform: Platform;
    productDescription?: string;
}): string {
    const parts = [
        INFLUENCER_PROMPTS[influencerType],
        CONTENT_STYLE_MODIFIERS[contentStyle],
        PLATFORM_MODIFIERS[platform],
        "photorealistic, 8k quality, natural skin texture, realistic environment",
    ];

    if (productDescription) {
        parts.unshift(`Product: ${productDescription}.`);
    }

    return parts.join(", ");
}

export function getPromptPreview(
    influencerType: InfluencerType,
    contentStyle: ContentStyle,
    platform: Platform
): string {
    return buildPrompt({ influencerType, contentStyle, platform });
}
