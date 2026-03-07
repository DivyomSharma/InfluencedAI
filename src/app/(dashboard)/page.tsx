"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SubscriptionPlan } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/database";

interface DashboardStats {
    imagesUsed: number;
    imagesLimit: number;
    plan: SubscriptionPlan;
    totalGenerations: number;
}

interface RecentGen {
    id: string;
    influencer_type: string;
    platform: string;
    num_images: number;
    status: string;
    created_at: string;
}

const quickActions = [
    { href: "/dashboard/image", label: "Generate Content", desc: "Create influencer-style photos", icon: "⚡", color: "from-[#7F8CFF]/20 to-[#A78BFA]/20" },
    { href: "/dashboard/gallery", label: "View Gallery", desc: "Browse generated content", icon: "🖼️", color: "from-emerald-500/20 to-green-500/20" },
    { href: "/dashboard/billing", label: "Manage Plan", desc: "Upgrade for more images", icon: "💳", color: "from-amber-500/20 to-orange-500/20" },
];

const typeEmoji: Record<string, string> = {
    lifestyle: "🌿",
    fashion: "👗",
    fitness: "💪",
    beauty: "💄",
    tech: "📱",
    streetwear: "🧢",
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        imagesUsed: 0,
        imagesLimit: 20,
        plan: "free",
        totalGenerations: 0,
    });
    const [recentGens, setRecentGens] = useState<RecentGen[]>([]);
    const [displayName, setDisplayName] = useState("Creator");

    useEffect(() => {
        async function loadDashboard() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Load profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                const plan = (profile.subscription_plan || "free") as SubscriptionPlan;
                setStats({
                    imagesUsed: profile.monthly_images_used || 0,
                    imagesLimit: profile.monthly_images_limit || PLAN_LIMITS[plan] || 20,
                    plan,
                    totalGenerations: 0,
                });
                setDisplayName(profile.display_name || user.email?.split("@")[0] || "Creator");
            }

            // Load recent generations
            const { data: generations } = await supabase
                .from("generations")
                .select("id, influencer_type, platform, num_images, status, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(5);

            if (generations) {
                setRecentGens(generations);
                setStats((prev) => ({ ...prev, totalGenerations: generations.length }));
            }
        }

        loadDashboard();
    }, []);

    const usagePercent = Math.min((stats.imagesUsed / stats.imagesLimit) * 100, 100);

    return (
        <div className="p-6 lg:p-8 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-text-primary">
                    Welcome back, {displayName} 👋
                </h1>
                <p className="text-text-secondary mt-1">Here&apos;s your content generation overview</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                    <Card padding="md">
                        <p className="text-sm text-text-muted uppercase tracking-wider font-medium">Monthly Usage</p>
                        <div className="mt-3 flex items-end gap-2">
                            <span className="text-3xl font-bold text-text-primary">{stats.imagesUsed}</span>
                            <span className="text-text-muted mb-1">/ {stats.imagesLimit} images</span>
                        </div>
                        <div className="mt-3 h-2 bg-panel rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${usagePercent > 90 ? "bg-danger" : usagePercent > 70 ? "bg-warning" : "bg-primary"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercent}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    <Card padding="md">
                        <p className="text-sm text-text-muted uppercase tracking-wider font-medium">Current Plan</p>
                        <div className="mt-3 flex items-center gap-3">
                            <span className="text-3xl font-bold text-text-primary capitalize">{stats.plan}</span>
                            {stats.plan === "free" && (
                                <Link href="/dashboard/billing" className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium hover:bg-primary/20 transition-colors">
                                    Upgrade →
                                </Link>
                            )}
                        </div>
                        <p className="text-sm text-text-muted mt-2">{stats.imagesLimit} images/month included</p>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                    <Card padding="md">
                        <p className="text-sm text-text-muted uppercase tracking-wider font-medium">Total Generations</p>
                        <div className="mt-3">
                            <span className="text-3xl font-bold text-text-primary">{stats.totalGenerations}</span>
                        </div>
                        <p className="text-sm text-text-muted mt-2">All-time content generated</p>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {quickActions.map((action, i) => (
                    <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    >
                        <Link href={action.href}>
                            <Card variant="interactive" padding="md">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                                    <span className="text-2xl">{action.icon}</span>
                                </div>
                                <h3 className="font-semibold text-text-primary">{action.label}</h3>
                                <p className="text-sm text-text-secondary mt-1">{action.desc}</p>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Generations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-text-primary">Recent Generations</h2>
                    {recentGens.length > 0 && (
                        <Link href="/dashboard/gallery" className="text-sm text-primary hover:underline">
                            View all →
                        </Link>
                    )}
                </div>

                <Card padding="none">
                    {recentGens.length > 0 ? (
                        <div className="divide-y divide-border">
                            {recentGens.map((gen) => (
                                <div key={gen.id} className="flex items-center justify-between p-4 hover:bg-panel/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-panel flex items-center justify-center text-lg">
                                            {typeEmoji[gen.influencer_type] || "🎨"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary capitalize">
                                                {gen.influencer_type.replace("_", " ")} content
                                            </p>
                                            <p className="text-sm text-text-muted capitalize">
                                                {gen.platform.replace("_", " ")} • {gen.num_images} images
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${gen.status === "completed"
                                                ? "bg-success/10 text-success"
                                                : gen.status === "failed"
                                                    ? "bg-danger/10 text-danger"
                                                    : "bg-warning/10 text-warning"
                                            }`}>
                                            {gen.status}
                                        </span>
                                        <p className="text-xs text-text-muted mt-1">
                                            {new Date(gen.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-4xl mb-3">✨</div>
                            <p className="text-text-secondary font-medium">No generations yet</p>
                            <p className="text-sm text-text-muted mt-1">Create your first influencer content</p>
                            <Link href="/dashboard/image" className="inline-block mt-4">
                                <button className="px-5 py-2 bg-primary text-background rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                                    Generate Content →
                                </button>
                            </Link>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
