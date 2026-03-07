// InfluencedAI — AI Provider Abstraction Layer

export interface GenerationRequest {
    prompt: string;
    numImages: number;
    productImageUrl?: string;
    width?: number;
    height?: number;
}

export interface GenerationResult {
    images: string[];
    provider: string;
    model: string;
    duration: number;
}

interface AIProvider {
    name: string;
    generate(request: GenerationRequest): Promise<GenerationResult>;
}

// ============================================
// MOCK PROVIDER (Development)
// ============================================
class MockProvider implements AIProvider {
    name = "mock";

    async generate(request: GenerationRequest): Promise<GenerationResult> {
        // Simulate generation delay (1-3 seconds)
        await new Promise((resolve) =>
            setTimeout(resolve, 1500 + Math.random() * 1500)
        );

        // Generate placeholder image URLs using picsum.photos
        const images = Array.from({ length: request.numImages }, (_, i) => {
            const seed = Date.now() + i;
            return `https://picsum.photos/seed/${seed}/512/512`;
        });

        return {
            images,
            provider: "mock",
            model: "placeholder-v1",
            duration: 2000,
        };
    }
}

// ============================================
// REPLICATE PROVIDER (Production)
// ============================================
import Replicate from "replicate";

class ReplicateProvider implements AIProvider {
    name = "replicate";

    async generate(request: GenerationRequest): Promise<GenerationResult> {
        const apiKey = process.env.REPLICATE_API_TOKEN;
        if (!apiKey) throw new Error("REPLICATE_API_TOKEN not configured");

        const replicate = new Replicate({
            auth: apiKey,
        });

        // Use black-forest-labs/flux-schnell as a fast, high-quality default
        const model = "black-forest-labs/flux-schnell";

        try {
            const start = Date.now();
            const output = await replicate.run(model, {
                input: {
                    prompt: request.prompt,
                    num_outputs: request.numImages,
                    aspect_ratio: "1:1", // Default to square, can be made dynamic later
                    output_format: "webp",
                    output_quality: 90,
                },
            });

            const duration = Date.now() - start;

            // Replicate returns an array of URLs for flux-schnell
            const images = Array.isArray(output) ? output : [output];

            return {
                images: images as string[],
                provider: "replicate",
                model: model,
                duration,
            };
        } catch (error) {
            console.error("Replicate API Error:", error);
            throw new Error(
                error instanceof Error ? error.message : "Failed to generate with Replicate"
            );
        }
    }
}

// ============================================
// STABILITY AI PROVIDER (Production-ready stub)
// ============================================
class StabilityProvider implements AIProvider {
    name = "stability";

    async generate(request: GenerationRequest): Promise<GenerationResult> {
        const apiKey = process.env.STABILITY_API_KEY;
        if (!apiKey) throw new Error("STABILITY_API_KEY not configured");

        // TODO: Implement Stability AI API call
        throw new Error(
            "Stability provider not yet implemented. Add your API key and implement the API call."
        );
    }
}

// ============================================
// PROVIDER FACTORY
// ============================================
const providers: Record<string, AIProvider> = {
    mock: new MockProvider(),
    replicate: new ReplicateProvider(),
    stability: new StabilityProvider(),
};

export function getProvider(name?: string): AIProvider {
    const providerName = name || process.env.AI_PROVIDER || "mock";
    const provider = providers[providerName];
    if (!provider) {
        throw new Error(`Unknown AI provider: ${providerName}`);
    }
    return provider;
}

export async function generateImages(
    request: GenerationRequest
): Promise<GenerationResult> {
    const provider = getProvider();
    return provider.generate(request);
}
