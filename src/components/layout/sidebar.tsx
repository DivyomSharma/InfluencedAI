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
        <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col shrink-0">
            {/* Logo */}
            <div className="p-5 border-b border-border">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7F8CFF] to-[#A78BFA] flex items-center justify-center">
                        <span className="text-white font-bold text-xs">AI</span>
                    </div>
                    <span className="font-semibold text-text-primary">InfluencedAI</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 mt-2">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 3 }}
                                className={`
                                    flex items-center gap-3 px-4 py-2.5 rounded-lg
                                    transition-colors duration-150
                                    ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-text-secondary hover:text-text-primary hover:bg-panel"
                                    }
                                `}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium text-sm">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Usage & Plan */}
            <div className="p-3 border-t border-border">
                <div className="bg-panel rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                            {plan} plan
                        </span>
                        <span className="text-xs text-text-secondary">
                            {imagesUsed}/{imagesLimit}
                        </span>
                    </div>
                    <div className="h-1.5 bg-background rounded-full overflow-hidden mt-2">
                        <motion.div
                            className={`h-full rounded-full ${usagePercent > 90
                                    ? "bg-danger"
                                    : usagePercent > 70
                                        ? "bg-warning"
                                        : "bg-primary"
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePercent}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                    </div>
                    <p className="text-[11px] text-text-muted mt-2">
                        {Math.max(0, imagesLimit - imagesUsed)} images remaining this month
                    </p>
                </div>

                {/* Sign Out */}
                <button
                    onClick={onSignOut}
                    className="w-full mt-3 py-2 text-sm text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
// Icon Components
// ============================================
function HomeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function GenerateIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}

function GalleryIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function BillingIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    );
}
