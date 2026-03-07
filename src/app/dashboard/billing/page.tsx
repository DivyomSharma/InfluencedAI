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
        <div className="p-6 lg:p-8 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-text-primary">Billing & Plans</h1>
                <p className="text-text-secondary mt-1">Manage your subscription and usage</p>
            </motion.div>

            {/* Current Usage */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-6"
            >
                <Card padding="md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-text-primary capitalize">
                                    {currentPlan} Plan
                                </h2>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${currentPlan === "pro"
                                    ? "bg-[#A78BFA]/20 text-[#A78BFA]"
                                    : currentPlan === "starter"
                                        ? "bg-primary/20 text-primary"
                                        : "bg-panel text-text-muted"
                                    }`}>
                                    Active
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary mt-1">
                                {imagesUsed} of {imagesLimit} images used this month
                            </p>
                        </div>
                        <div className="w-full md:w-64">
                            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                                <span>{imagesUsed} used</span>
                                <span>{imagesLimit - imagesUsed} remaining</span>
                            </div>
                            <div className="h-3 bg-panel rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full rounded-full ${usagePercent > 90 ? "bg-danger" : usagePercent > 70 ? "bg-warning" : "bg-primary"
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usagePercent}%` }}
                                    transition={{ duration: 1, delay: 0.3 }}
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
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                        >
                            <div className={`
                                relative bg-panel border rounded-2xl p-6 h-full flex flex-col
                                ${isPopular(plan) ? "border-primary ring-1 ring-primary/20" : "border-border"}
                                ${isCurrent ? "ring-2 ring-primary" : ""}
                            `}>
                                {isPopular(plan) && !isCurrent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7F8CFF] to-[#A78BFA] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}
                                {isCurrent && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-success text-background text-[10px] font-bold px-3 py-1 rounded-full">
                                        CURRENT PLAN
                                    </div>
                                )}

                                <h3 className="text-lg font-bold text-text-primary">{plan.name}</h3>
                                <div className="mt-3 flex items-baseline gap-1">
                                    {plan.price === 0 ? (
                                        <span className="text-3xl font-bold text-text-primary">Free</span>
                                    ) : (
                                        <>
                                            <span className="text-3xl font-bold text-text-primary">₹{plan.price}</span>
                                            <span className="text-text-muted text-sm">/mo</span>
                                        </>
                                    )}
                                </div>

                                <p className="text-primary text-sm font-medium mt-1">
                                    {plan.monthlyImages} images / month
                                </p>

                                <ul className="mt-5 space-y-2.5 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                                            <svg className="w-4 h-4 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6">
                                    {isCurrent ? (
                                        <Button variant="secondary" className="w-full" disabled>
                                            Current Plan
                                        </Button>
                                    ) : plan.price === 0 ? (
                                        <Button variant="secondary" className="w-full" disabled>
                                            Free Tier
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={isPopular(plan) ? "primary" : "secondary"}
                                            className="w-full"
                                        >
                                            {currentPlan === "free" ? "Upgrade" : "Switch"} to {plan.name}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-8"
            >
                <Card padding="md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-panel flex items-center justify-center">
                            <svg className="w-5 h-5 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-text-primary">Payment Method</h3>
                            <p className="text-sm text-text-muted">Stripe integration coming soon</p>
                        </div>
                    </div>
                    <p className="text-sm text-text-secondary">
                        Payment processing via Stripe will be available shortly. Currently, all users are on the free plan with {PLAN_LIMITS.free} images per month.
                    </p>
                </Card>
            </motion.div>
        </div>
    );
}
