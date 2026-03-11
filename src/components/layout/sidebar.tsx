"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/dashboard/image", label: "Generate", icon: GenerateIcon },
    { href: "/dashboard/gallery", label: "Gallery", icon: GalleryIcon },
    { href: "/dashboard/billing", label: "Billing", icon: BillingIcon },
];

interface SidebarProps {
    imagesUsed: number;
    imagesLimit: number;
    plan: string;
    onSignOut: () => void;
}

export function Sidebar({ imagesUsed, imagesLimit, plan, onSignOut }: SidebarProps) {
    const pathname = usePathname();
    const usagePercent = Math.min((imagesUsed / imagesLimit) * 100, 100);

    return (
        <aside className="w-64 h-screen bg-[#0A0A0A] border-r border-[#262626] flex flex-col shrink-0 font-sans">
            {/* Logo */}
            <div className="p-6 border-b border-[var(--border)]">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--background)] flex items-center justify-center">
                        <span className="font-bold text-xs">AI</span>
                    </div>
                    <span className="font-medium text-sm text-[var(--text-primary)] tracking-tight">InfluencedAI</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 2 }}
                                className={`
                                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                                    transition-colors duration-200
                                    ${isActive
                                        ? "bg-[#171717] text-white font-medium"
                                        : "text-[#A1A1AA] hover:text-white hover:bg-[#111111]"
                                    }
                                `}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A1A1AA]'}`} />
                                <span>{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions & Usage */}
            <div className="p-4 border-t border-[var(--border)]">
                <div className="bg-[#111111] border border-[#262626] rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-[#A1A1AA] font-medium uppercase tracking-wider">
                            {plan} plan
                        </span>
                        <span className="text-xs text-[#FAFAFA] font-medium">
                            {imagesUsed}/{imagesLimit}
                        </span>
                    </div>
                    <div className="h-1 bg-[#262626] rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${usagePercent > 90
                                    ? "bg-red-500"
                                    : usagePercent > 70
                                        ? "bg-amber-500"
                                        : "bg-white"
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercent}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>
                </div>

                <button
                    onClick={onSignOut}
                    className="w-full py-2 px-3 text-sm text-[#A1A1AA] hover:text-white hover:bg-[#111111] rounded-lg transition-colors flex items-center gap-3"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

// ============================================
// Minimal 1.5 Stroke Icons
// ============================================
function HomeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function GenerateIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
    );
}

function GalleryIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function BillingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    );
}
