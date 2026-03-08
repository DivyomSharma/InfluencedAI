// InfluencedAI — Auth Helper Functions

import { createClient } from "@/lib/supabase/client";

export async function signInWithEmail(email: string, password: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string
) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    return { data, error };
}

export async function signInWithOAuth(provider: "google" | "github") {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    return { data, error };
}

export async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

export async function getUserProfile() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return profile;
}
