"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden font-sans">
      {/* Minimal Sticky Navbar */}
      <header className="sticky top-0 w-full z-50 glass-nav">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <span className="text-[var(--background)] font-bold text-xs">AI</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-sm tracking-tight text-white">InfluencedAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</a>
            <a href="/docs" className="hover:text-[var(--text-primary)] transition-colors">Docs</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6">
        {/* Resend-Style Hero Section (Left/Right) */}
        <section className="pt-[120px] pb-[120px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Copy & CTAs */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-xl"
            >
              <motion.h1
                variants={fadeUp}
                className="text-[64px] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--text-primary)] mb-6 font-heading"
              >
                AI Influencer content <br />
                for modern brands.
              </motion.h1>
              
              <motion.p
                variants={fadeUp}
                className="text-lg text-[var(--text-secondary)] leading-[1.7] mb-10 max-w-lg"
              >
                Upload your product and generate studio-quality influencer photography in seconds. 
                Build your creative pipeline with an API designed for modern marketing teams. 
              </motion.p>
              
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
                <Link href="/signup">
                  <Button size="md" className="px-6 py-3 rounded-[10px]">
                    Start Building
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="secondary" size="md" className="px-6 py-3 rounded-[10px]">
                    Documentation
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: UI Mockup with glow */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-[4/3] lg:aspect-square flex items-center justify-center"
            >
              {/* Subtle backdrop glow */}
              <div className="absolute inset-0 glow-backdrop rounded-[24px] pointer-events-none opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/10 to-transparent blur-3xl pointer-events-none" />
              
              {/* Product UI Mockup Box */}
              <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden glass-nav">
                {/* Mockup Header */}
                <div className="h-10 border-b border-[var(--border)] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#333]" />
                  <div className="w-3 h-3 rounded-full bg-[#333]" />
                  <div className="w-3 h-3 rounded-full bg-[#333]" />
                </div>
                {/* Mockup Body */}
                <div className="p-6">
                  <div className="w-full h-48 bg-[var(--panel)] rounded-xl border border-[var(--border)] mb-4 flex items-center justify-center">
                    <span className="text-[var(--text-muted)] text-sm font-medium">Product Upload Zone</span>
                  </div>
                  <div className="space-y-3">
                    <div className="w-3/4 h-4 rounded bg-[var(--panel)]" />
                    <div className="w-1/2 h-4 rounded bg-[var(--panel)]" />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <div className="w-24 h-8 rounded-lg bg-[var(--primary)] text-[var(--background)] flex items-center justify-center text-xs font-semibold">
                      Generate
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="py-[120px] border-t border-[var(--border)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-[36px] font-medium tracking-tight font-heading mb-4">
              Designed for developers
            </h2>
            <p className="text-[16px] text-[var(--text-secondary)]">
              Build and scale your visual content infrastructure effortlessly.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Instant Generation",
                desc: "Get hyper-realistic influencer shots from a single product image in under 10 seconds.",
              },
              {
                title: "API First",
                desc: "Integrate directly into your CMS or e-commerce backend with our simple REST API.",
              },
              {
                title: "Style Consistency",
                desc: "Maintain your brand's aesthetic across hundreds of generations using style seeds.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-[var(--panel)] border border-[var(--border)] rounded-[14px] p-8 transition-transform"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-[22px] font-medium text-[var(--text-primary)] mb-3">{feature.title}</h3>
                <p className="text-[16px] text-[var(--text-secondary)] leading-[1.7]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Developer Minimal Footer */}
      <footer className="border-t border-[var(--border)] bg-[#0A0A0A] py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-6 h-6 rounded-md bg-[var(--primary)] flex items-center justify-center">
                <span className="text-[var(--background)] font-bold text-[10px]">AI</span>
              </div>
              <span className="font-medium text-white text-sm tracking-tight">InfluencedAI</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white/50 text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white/50 text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
