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
    { href: "/dashboard/image", label: "Generate Content", desc: "Create influencer-style photos", icon: "⚡" },
    { href: "/dashboard/gallery", label: "View Gallery", desc: "Browse generated content", icon: "🖼️" },
    { href: "/dashboard/billing", label: "Manage Plan", desc: "Upgrade for more images", icon: "💳" },
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
        <div className="p-6 lg:p-10 max-w-6xl mx-auto font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-[28px] tracking-tight font-medium text-[var(--text-primary)]">
                    Welcome back, {displayName} 👋
                </h1>
                <p className="text-[var(--text-secondary)] mt-1 text-sm">Here&apos;s your content generation overview</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                    <Card>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Monthly Usage</p>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl tracking-tight font-medium text-[var(--text-primary)]">{stats.imagesUsed}</span>
                            <span className="text-[var(--text-secondary)] text-sm mb-1">/ {stats.imagesLimit}</span>
                        </div>
                        <div className="mt-5 h-1 bg-[#262626] rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${usagePercent > 90 ? "bg-red-500" : usagePercent > 70 ? "bg-amber-500" : "bg-white"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${usagePercent}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    <Card>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Current Plan</p>
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-4xl tracking-tight font-medium text-[var(--text-primary)] capitalize">{stats.plan}</span>
                            {stats.plan === "free" && (
                                <Link href="/dashboard/billing" className="text-xs bg-[#262626] text-white px-3 py-1 rounded-full font-medium hover:bg-[#333] transition-colors">
                                    Upgrade →
                                </Link>
                            )}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-3">{stats.imagesLimit} images/month included</p>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                    <Card>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-medium">Total Generations</p>
                        <div className="mt-4">
                            <span className="text-4xl tracking-tight font-medium text-[var(--text-primary)]">{stats.totalGenerations}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-3">All-time content generated</p>
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                {quickActions.map((action, i) => (
                    <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                    >
                        <Link href={action.href}>
                            <Card className="hover:border-[#444] transition-colors cursor-pointer group">
                                <div className={`w-10 h-10 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                                    <span className="text-xl">{action.icon}</span>
                                </div>
                                <h3 className="font-medium text-sm text-[var(--text-primary)]">{action.label}</h3>
                                <p className="text-[13px] text-[var(--text-secondary)] mt-1">{action.desc}</p>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Generations */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-10"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[15px] font-medium text-[var(--text-primary)]">Recent Generations</h2>
                    {recentGens.length > 0 && (
                        <Link href="/dashboard/gallery" className="text-[13px] text-[var(--text-secondary)] hover:text-white transition-colors">
                            View all →
                        </Link>
                    )}
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] overflow-hidden">
                    {recentGens.length > 0 ? (
                        <div className="divide-y divide-[var(--border)]">
                            {recentGens.map((gen) => (
                                <div key={gen.id} className="flex items-center justify-between p-4 hover:bg-[#111] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#262626] flex items-center justify-center text-lg">
                                            {typeEmoji[gen.influencer_type] || "🎨"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm text-[var(--text-primary)] capitalize">
                                                {gen.influencer_type.replace("_", " ")} content
                                            </p>
                                            <p className="text-[13px] text-[var(--text-secondary)] capitalize mt-0.5">
                                                {gen.platform.replace("_", " ")} • {gen.num_images} images
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${gen.status === "completed"
                                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                : gen.status === "failed"
                                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            }`}>
                                            {gen.status}
                                        </span>
                                        <p className="text-[12px] text-[var(--text-secondary)] mt-2">
                                            {new Date(gen.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-3xl mb-4">✨</div>
                            <p className="text-[var(--text-primary)] text-sm font-medium">No generations yet</p>
                            <p className="text-[13px] text-[var(--text-secondary)] mt-1">Create your first influencer content</p>
                            <Link href="/dashboard/image" className="inline-block mt-5">
                                <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                    Generate Content →
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
