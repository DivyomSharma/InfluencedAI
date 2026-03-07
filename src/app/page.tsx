"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INFLUENCER_TYPES, PLATFORMS, SUBSCRIPTION_PLANS } from "@/lib/constants";

type PlanInfo = (typeof SUBSCRIPTION_PLANS)[number];
function isPopular(plan: PlanInfo): boolean {
  return "popular" in plan && !!(plan as { popular?: boolean }).popular;
}

const demoImages = [
  { label: "Fashion Influencer", gradient: "from-pink-500/20 to-purple-500/20" },
  { label: "Tech Reviewer", gradient: "from-blue-500/20 to-cyan-500/20" },
  { label: "Fitness Content", gradient: "from-green-500/20 to-emerald-500/20" },
  { label: "Lifestyle Post", gradient: "from-orange-500/20 to-amber-500/20" },
  { label: "Beauty UGC", gradient: "from-rose-500/20 to-pink-500/20" },
  { label: "Streetwear Ad", gradient: "from-violet-500/20 to-indigo-500/20" },
];

const steps = [
  { num: "01", title: "Upload Product", desc: "Drop your product image or mockup", icon: "📤" },
  { num: "02", title: "Select Style", desc: "Choose influencer type & platform", icon: "🎨" },
  { num: "03", title: "Generate", desc: "AI creates influencer-style content", icon: "⚡" },
  { num: "04", title: "Download", desc: "Get ready-to-post content instantly", icon: "📥" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7F8CFF] to-[#A78BFA] flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-semibold text-text-primary text-lg">InfluencedAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#7F8CFF]/10 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#A78BFA]/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-primary font-medium">AI-Powered Influencer Marketing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-text-primary leading-[1.1] tracking-tight"
          >
            Generate Influencer
            <br />
            <span className="text-gradient">Content with AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Upload your product, choose an influencer style, and get
            authentic-looking social media content in seconds.
            No real influencers needed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 py-3.5 shadow-lg shadow-primary/25">
                Start Generating Free →
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg" className="text-base px-8 py-3.5">
                See How It Works
              </Button>
            </a>
          </motion.div>

          {/* Demo Gallery Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto"
          >
            {demoImages.map((img, i) => (
              <motion.div
                key={img.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                className={`aspect-square rounded-xl bg-gradient-to-br ${img.gradient} border border-border/50 flex items-center justify-center group hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-center px-2">
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📸</div>
                  <p className="text-[10px] text-text-muted font-medium">{img.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary">How It Works</h2>
            <p className="text-text-secondary mt-4 text-lg max-w-2xl mx-auto">
              Four simple steps to create professional influencer marketing content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center group"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <span className="text-xs text-primary font-mono font-bold">{step.num}</span>
                <h3 className="text-lg font-semibold text-text-primary mt-1">{step.title}</h3>
                <p className="text-sm text-text-secondary mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — Influencer Types & Platforms */}
      <section id="features" className="py-24 px-6 bg-surface/50 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary">Every Influencer Style</h2>
            <p className="text-text-secondary mt-4 text-lg">
              Choose from multiple influencer personas and platforms
            </p>
          </motion.div>

          {/* Influencer Types */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {INFLUENCER_TYPES.map((type, i) => (
              <motion.div
                key={type.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-panel border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-all group cursor-default"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{type.icon}</div>
                <h3 className="text-sm font-semibold text-text-primary">{type.label}</h3>
              </motion.div>
            ))}
          </div>

          {/* Platforms */}
          <motion.div {...fadeUp} className="text-center mb-8">
            <h3 className="text-2xl font-bold text-text-primary">For Every Platform</h3>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {PLATFORMS.map((platform, i) => (
              <motion.div
                key={platform.value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-panel border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-all cursor-default"
              >
                <span className="text-2xl">{platform.icon}</span>
                <p className="text-sm font-medium text-text-primary mt-2">{platform.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary">Simple, Transparent Pricing</h2>
            <p className="text-text-secondary mt-4 text-lg">
              Start free. Upgrade when you need more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`
                                    relative bg-panel border rounded-2xl p-8
                                    ${isPopular(plan) ? "border-primary ring-1 ring-primary/20" : "border-border"}
                                `}
              >
                {isPopular(plan) && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7F8CFF] to-[#A78BFA] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-text-primary">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-bold text-text-primary">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-text-primary">₹{plan.price}</span>
                      <span className="text-text-muted">/month</span>
                    </>
                  )}
                </div>
                <p className="text-primary text-sm font-medium mt-2">
                  {plan.monthlyImages} images / month
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-text-secondary">
                      <svg className="w-4 h-4 text-success shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block mt-8">
                  <Button
                    variant={isPopular(plan) ? "primary" : "secondary"}
                    className="w-full"
                    size="lg"
                  >
                    {plan.price === 0 ? "Get Started Free" : "Start Free Trial"}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-border">
        <motion.div
          {...fadeUp}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-primary/10 via-[#A78BFA]/10 to-primary/5 border border-primary/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-text-primary">
              Ready to Replace Traditional
              <br />
              <span className="text-gradient">Influencer Marketing?</span>
            </h2>
            <p className="text-text-secondary mt-4 text-lg max-w-xl mx-auto">
              Join thousands of brands creating authentic influencer content
              instantly with AI. No contracts, no negotiations.
            </p>
            <Link href="/signup" className="inline-block mt-8">
              <Button size="lg" className="text-base px-10 py-4 shadow-lg shadow-primary/25">
                Start Creating for Free →
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7F8CFF] to-[#A78BFA] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">AI</span>
            </div>
            <span className="text-sm text-text-secondary">© 2026 InfluencedAI. All rights reserved.</span>
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
