"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const quickActions = [
    { href: "/dashboard/image", label: "Generate Image", icon: "🎨", credits: "3-5 cr" },
    { href: "/dashboard/video", label: "Create Video", icon: "🎬", credits: "40-70 cr" },
    { href: "/dashboard/voice", label: "Synthesize Voice", icon: "🎙️", credits: "5-30 cr" },
    { href: "/dashboard/script", label: "Write Script", icon: "📝", credits: "2-3 cr" },
];

const recentActivity = [
    { type: "Image", name: "Cyberpunk cityscape", time: "2 hours ago", credits: -5 },
    { type: "Script", name: "Product demo script", time: "Yesterday", credits: -3 },
    { type: "Voice", name: "Narration sample", time: "2 days ago", credits: -8 },
];

export default function DashboardPage() {
    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
                <p className="text-text-secondary mt-1">Welcome back. What will you create today?</p>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {quickActions.map((action, i) => (
                    <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <Link href={action.href}>
                            <Card variant="interactive" padding="md">
                                <div className="text-3xl mb-3">{action.icon}</div>
                                <h3 className="font-semibold text-text-primary">{action.label}</h3>
                                <p className="text-sm text-text-secondary mt-1">{action.credits}</p>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="mt-8"
            >
                <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
                <Card padding="none">
                    <div className="divide-y divide-border">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-panel flex items-center justify-center text-sm">
                                        {item.type === "Image" && "🎨"}
                                        {item.type === "Script" && "📝"}
                                        {item.type === "Voice" && "🎙️"}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-primary">{item.name}</p>
                                        <p className="text-sm text-text-muted">{item.type} • {item.time}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-text-secondary">{item.credits} cr</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
