"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AppShellProps {
    children: ReactNode;
}

const creditPacks = [
    { id: "starter", name: "Starter", credits: 100, price: 499 },
    { id: "creator", name: "Creator", credits: 250, price: 999, popular: true },
    { id: "studio", name: "Studio", credits: 800, price: 2499 },
];

export function AppShell({ children }: AppShellProps) {
    const [credits, setCredits] = useState(150); // Mock initial credits
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedPack, setSelectedPack] = useState("creator");

    return (
        <div className="flex h-screen bg-background">
            <Sidebar credits={credits} onBuyCredits={() => setShowBuyModal(true)} />

            <main className="flex-1 overflow-auto">
                {children}
            </main>

            {/* Buy Credits Modal */}
            <Modal
                isOpen={showBuyModal}
                onClose={() => setShowBuyModal(false)}
                title="Buy Credits"
                size="md"
            >
                <div className="space-y-4">
                    {creditPacks.map((pack) => (
                        <button
                            key={pack.id}
                            onClick={() => setSelectedPack(pack.id)}
                            className={`
                w-full p-4 rounded-lg border text-left transition-all
                ${selectedPack === pack.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border bg-surface hover:border-primary/30"
                                }
              `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-text-primary">{pack.name}</span>
                                        {pack.popular && (
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                                BEST VALUE
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-text-secondary mt-1">
                                        {pack.credits} credits
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-text-primary">₹{pack.price}</div>
                                    <div className="text-xs text-text-muted">
                                        ₹{(pack.price / pack.credits).toFixed(1)}/credit
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}

                    <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-text-secondary">Selected</span>
                            <span className="font-semibold text-text-primary">
                                {creditPacks.find(p => p.id === selectedPack)?.name} Pack
                            </span>
                        </div>
                        <Button className="w-full" size="lg">
                            Pay ₹{creditPacks.find(p => p.id === selectedPack)?.price} with Stripe
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
