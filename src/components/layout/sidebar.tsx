"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/dashboard/image", label: "Image", icon: ImageIcon },
    { href: "/dashboard/video", label: "Video", icon: VideoIcon },
    { href: "/dashboard/voice", label: "Voice", icon: VoiceIcon },
    { href: "/dashboard/script", label: "Script", icon: ScriptIcon },
];

interface SidebarProps {
    credits: number;
    onBuyCredits: () => void;
}

export function Sidebar({ credits, onBuyCredits }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-surface border-r border-border flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-background font-bold text-sm">AI</span>
                    </div>
                    <span className="font-semibold text-text-primary">influenced.ai</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
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
                                <span className="font-medium">{item.label}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Credits */}
            <div className="p-4 border-t border-border">
                <div className="bg-panel rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-text-secondary">Credits</span>
                        <span className="text-lg font-semibold text-text-primary">{credits}</span>
                    </div>
                    <button
                        onClick={onBuyCredits}
                        className="w-full py-2 bg-primary text-background rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
                    >
                        + Buy Credits
                    </button>
                </div>
            </div>
        </aside>
    );
}

// Icons
function HomeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function ImageIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function VideoIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    );
}

function VoiceIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
    );
}

function ScriptIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}
