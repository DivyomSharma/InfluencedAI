// InfluencedAI — Database Helpers (Type-safe Supabase queries)

import type { SubscriptionPlan } from "./constants";

// ============================================
// Types matching Supabase schema
// ============================================
export interface Profile {
    id: string;
    display_name: string | null;
    subscription_plan: SubscriptionPlan;
    monthly_images_used: number;
    monthly_images_limit: number;
    monthly_reset_date: string | null;
    created_at: string;
}

export interface Generation {
    id: string;
    user_id: string;
    product_image_url: string | null;
    influencer_type: string;
    platform: string;
    content_style: string;
    num_images: number;
    generated_image_urls: string[];
    prompt_used: string;
    status: "pending" | "processing" | "completed" | "failed";
    error: string | null;
    created_at: string;
}

export interface CreditTransaction {
    id: string;
    user_id: string;
    amount: number;
    type: "purchase" | "debit" | "refund";
    description: string | null;
    generation_id: string | null;
    payment_id: string | null;
    created_at: string;
}

export interface Payment {
    id: string;
    user_id: string;
    stripe_payment_id: string | null;
    amount_inr: number;
    plan_purchased: SubscriptionPlan | null;
    status: "pending" | "completed" | "failed";
    created_at: string;
}

// Plan limits
export const PLAN_LIMITS: Record<SubscriptionPlan, number> = {
    free: 20,
    starter: 200,
    pro: 1000,
};

export function canGenerate(
    profile: Profile,
    requestedImages: number
): { allowed: boolean; reason?: string } {
    const limit = PLAN_LIMITS[profile.subscription_plan] || 20;
    const remaining = limit - profile.monthly_images_used;

    if (remaining < requestedImages) {
        return {
            allowed: false,
            reason: `You have ${remaining} images remaining this month. Upgrade your plan for more.`,
        };
    }

    return { allowed: true };
}
