"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Image Generation", credits: "3-5 cr", icon: "🎨" },
  { title: "Video Creation", credits: "40-70 cr", icon: "🎬" },
  { title: "Voice Synthesis", credits: "5-30 cr", icon: "🎙️" },
  { title: "Script Writing", credits: "2-3 cr", icon: "📝" },
];

const pricingPacks = [
  { name: "Starter", credits: 100, price: 499 },
  { name: "Creator", credits: 250, price: 999, popular: true },
  { name: "Studio", credits: 800, price: 2499 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-text-primary">influenced.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-text-primary leading-tight"
          >
            Create Without Limits.
            <br />
            <span className="text-gradient">Pay Only When You Use.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-text-secondary max-w-2xl mx-auto"
          >
            Premium AI generation for images, videos, voice, and scripts.
            No subscriptions. No idle costs. Just pure creative power.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Start Creating →
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-surface border border-border rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                <p className="text-sm text-text-secondary mt-2">{feature.credits}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Simple Credit Packs
          </h2>
          <p className="text-text-secondary text-center mb-12">
            Buy credits. Use them when you need. No expiry.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPacks.map((pack, i) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`
                  bg-panel border rounded-xl p-6 relative
                  ${pack.popular ? "border-primary" : "border-border"}
                `}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background text-xs font-semibold px-3 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}
                <h3 className="text-xl font-semibold text-text-primary">{pack.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-text-primary">₹{pack.price}</span>
                </div>
                <p className="text-text-secondary mt-2">{pack.credits} credits</p>
                <Button
                  variant={pack.popular ? "primary" : "secondary"}
                  className="w-full mt-6"
                >
                  Buy Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-background font-bold text-xs">AI</span>
            </div>
            <span className="text-sm text-text-secondary">© 2026 influenced.ai</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
