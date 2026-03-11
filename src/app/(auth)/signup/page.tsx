"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithOAuth } from "@/lib/auth";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setIsLoading(false);
            return;
        }

        const { data, error: authError } = await signUpWithEmail(email, password, name);

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
        } else if (data.user && !data.session) {
            // Email confirmation required
            setSuccess(true);
            setIsLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    const handleOAuth = async (provider: "google" | "github") => {
        setError(null);
        const { error: oauthError } = await signInWithOAuth(provider);
        if (oauthError) {
            setError(oauthError.message);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="bg-surface border border-border rounded-2xl p-8">
                        <div className="text-5xl mb-4">📧</div>
                        <h2 className="text-2xl font-bold text-text-primary">Check your email</h2>
                        <p className="text-text-secondary mt-3">
                            We&apos;ve sent a confirmation link to <span className="text-primary font-medium">{email}</span>.
                            Click the link to activate your account.
                        </p>
                        <Link href="/login" className="inline-block mt-6">
                            <Button variant="secondary">Back to Login</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                        <span className="text-[var(--background)] font-bold text-xs">AI</span>
                    </div>
                </Link>

                {/* Form Card */}
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-8">
                    <h1 className="text-[22px] font-medium text-[var(--text-primary)] text-center mb-1">
                        Create your account
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm text-center mb-8">
                        Start building with InfluencedAI
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            label="Full Name"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            hint="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <p className="text-center text-xs text-text-muted mt-4">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-surface text-text-muted">or</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button variant="secondary" className="w-full" onClick={() => handleOAuth("google")}>
                            Continue with Google
                        </Button>
                        <Button variant="secondary" className="w-full" onClick={() => handleOAuth("github")}>
                            Continue with GitHub
                        </Button>
                    </div>

                    <p className="text-center text-sm text-text-secondary mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
