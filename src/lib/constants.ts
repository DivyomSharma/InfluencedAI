// InfluencedAI — Application Constants

export const INFLUENCER_TYPES = [
    { value: "lifestyle", label: "Lifestyle Influencer", icon: "🌿" },
    { value: "fashion", label: "Fashion Influencer", icon: "👗" },
    { value: "fitness", label: "Fitness Influencer", icon: "💪" },
    { value: "beauty", label: "Beauty Influencer", icon: "💄" },
    { value: "tech", label: "Tech Reviewer", icon: "📱" },
    { value: "streetwear", label: "Streetwear Influencer", icon: "🧢" },
] as const;

export const PLATFORMS = [
    { value: "instagram", label: "Instagram", icon: "📸" },
    { value: "tiktok", label: "TikTok", icon: "🎵" },
    { value: "youtube_shorts", label: "YouTube Shorts", icon: "▶️" },
    { value: "ad_creative", label: "Advertising Creative", icon: "📢" },
] as const;

export const CONTENT_STYLES = [
    { value: "selfie", label: "Influencer Selfie", icon: "🤳" },
    { value: "lifestyle_photo", label: "Lifestyle Photo", icon: "🏠" },
    { value: "product_review", label: "Product Review Style", icon: "⭐" },
    { value: "ugc", label: "UGC Content", icon: "📱" },
    { value: "ad_creative", label: "Ad Creative", icon: "🎯" },
] as const;

export const IMAGE_COUNT_OPTIONS = [
    { value: 4, label: "4 images", credits: 1 },
    { value: 8, label: "8 images", credits: 2 },
    { value: 12, label: "12 images", credits: 3 },
] as const;

export const SUBSCRIPTION_PLANS = [
    {
        id: "free",
        name: "Free",
        price: 0,
        monthlyImages: 20,
        features: [
            "20 images per month",
            "Basic influencer types",
            "Standard quality",
            "Community support",
        ],
    },
    {
        id: "starter",
        name: "Starter",
        price: 1999,
        monthlyImages: 200,
        popular: true,
        features: [
            "200 images per month",
            "All influencer types",
            "HD quality",
            "Priority generation",
            "Email support",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 4999,
        monthlyImages: 1000,
        features: [
            "1,000 images per month",
            "All influencer types",
            "Ultra HD quality",
            "Fastest generation",
            "API access",
            "Priority support",
        ],
    },
] as const;

export type InfluencerType = (typeof INFLUENCER_TYPES)[number]["value"];
export type Platform = (typeof PLATFORMS)[number]["value"];
export type ContentStyle = (typeof CONTENT_STYLES)[number]["value"];
export type SubscriptionPlan = "free" | "starter" | "pro";
