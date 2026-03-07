"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { PLAN_LIMITS } from "@/lib/database";
import type { SubscriptionPlan } from "@/lib/constants";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [imagesUsed, setImagesUsed] = useState(0);
    const [imagesLimit, setImagesLimit] = useState(20);
    const [plan, setPlan] = useState<string>("free");
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    setPlan(profile.subscription_plan || "free");
                    setImagesUsed(profile.monthly_images_used || 0);
                    setImagesLimit(
                        profile.monthly_images_limit ||
                        PLAN_LIMITS[(profile.subscription_plan as SubscriptionPlan) || "free"] ||
                        20
                    );
                }
            }
            setIsLoaded(true);
        }

        loadProfile();
    }, []);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar
                imagesUsed={imagesUsed}
                imagesLimit={imagesLimit}
                plan={plan}
                onSignOut={handleSignOut}
            />
            <main className="flex-1 overflow-auto">
                {isLoaded ? children : (
                    <div className="h-full flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </main>
        </div>
    );
}
