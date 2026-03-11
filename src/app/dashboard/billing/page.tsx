"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import type { SubscriptionPlan } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/database";

type PlanInfo = (typeof SUBSCRIPTION_PLANS)[number];
function isPopular(plan: PlanInfo): boolean {
    return "popular" in plan && !!(plan as { popular?: boolean }).popular;
}

export default function BillingPage() {
    const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("free");
    const [imagesUsed, setImagesUsed] = useState(0);
    const [imagesLimit, setImagesLimit] = useState(20);

    useEffect(() => {
        async function loadBilling() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                const plan = (profile.subscription_plan || "free") as SubscriptionPlan;
                setCurrentPlan(plan);
                setImagesUsed(profile.monthly_images_used || 0);
                setImagesLimit(profile.monthly_images_limit || PLAN_LIMITS[plan] || 20);
            }
        }

        loadBilling();
    }, []);

    const usagePercent = Math.min((imagesUsed / imagesLimit) * 100, 100);

    return (
        <div className="p-6 lg:p-10 max-w-5xl font-sans">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-[28px] tracking-tight font-medium text-[var(--text-primary)]">Billing & Plans</h1>
                <p className="text-[var(--text-secondary)] mt-1 text-sm">Manage your subscription and usage</p>
            </motion.div>

            {/* Current Usage */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-8"
            >
                <Card>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-[17px] font-medium text-[var(--text-primary)] capitalize">
                                    {currentPlan} Plan
                                </h2>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide bg-gradient-to-r from-[#6366F1]/20 to-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20">
                                    Active
                                </span>
                            </div>
                            <p className="text-[13px] text-[var(--text-secondary)] mt-1">
                                {imagesUsed} of {imagesLimit} images used this month
                            </p>
                        </div>
                        <div className="w-full md:w-72">
                            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-2 font-medium">
                                <span>{imagesUsed} used</span>
                                <span>{imagesLimit - imagesUsed} remaining</span>
                            </div>
                            <div className="h-1.5 bg-[#262626] rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${usagePercent > 90 ? "bg-red-500" : usagePercent > 70 ? "bg-amber-400" : "bg-[#FAFAFA]"
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usagePercent}%` }}
                                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {SUBSCRIPTION_PLANS.map((plan, i) => {
                    const isCurrent = plan.id === currentPlan;
                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                        >
                            <div className={`
                                relative bg-[#111111] border rounded-[14px] p-8 h-full flex flex-col transition-all duration-300
                                hover:border-[#444]
                                ${isPopular(plan) ? "border-[#6366F1] shadow-[0_0_30px_rgba(99,102,241,0.05)]" : "border-[#262626]"}
                                ${isCurrent ? "ring-1 ring-[#FAFAFA]" : ""}
                            `}>
                                {isPopular(plan) && !isCurrent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                        MOST POPULAR
                                    </div>
                                )}
                                {isCurrent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FAFAFA] text-black text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                                        CURRENT PLAN
                                    </div>
                                )}

                                <h3 className="text-lg font-medium tracking-tight text-[var(--text-primary)]">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline gap-1">
                                    {plan.price === 0 ? (
                                        <span className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">Free</span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">₹{plan.price}</span>
                                            <span className="text-[var(--text-secondary)] text-[13px] font-medium">/month</span>
                                        </>
                                    )}
                                </div>

                                <p className="text-[13px] text-[#A1A1AA] font-normal mt-2 border-b border-[#262626] pb-6">
                                    Includes <strong className="text-white font-medium">{plan.monthlyImages} image generations</strong> per month.
                                </p>

                                <ul className="mt-6 space-y-3 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-[13px] text-[var(--text-secondary)]">
                                            <svg className="w-[18px] h-[18px] text-[#FAFAFA] shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <span className="leading-snug">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8">
                                    {isCurrent ? (
                                        <Button variant="secondary" className="w-full opacity-50 cursor-default" disabled>
                                            Current Plan
                                        </Button>
                                    ) : plan.price === 0 ? (
                                        <Button variant="secondary" className="w-full opacity-50 cursor-default" disabled>
                                            Free Tier
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={isPopular(plan) ? "primary" : "secondary"}
                                            className="w-full"
                                        >
                                            {currentPlan === "free" ? "Upgrade" : "Switch plan"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Billing Info */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-8"
            >
                <Card>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-[10px] bg-[#111111] border border-[#262626] flex items-center justify-center">
                            <svg className="w-4 h-4 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-medium text-[15px] text-[var(--text-primary)]">Payment Method</h3>
                            <p className="text-[13px] text-[var(--text-secondary)]">Stripe integration coming soon</p>
                        </div>
                    </div>
                    <p className="text-[13px] text-[#888] pl-14">
                        Payment processing via Stripe will be available shortly. Currently, all users are on the free plan with {PLAN_LIMITS.free} images per month.
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
