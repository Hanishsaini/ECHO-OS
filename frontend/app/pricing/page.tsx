"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Zap } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const response = await api.post("/api/payments/create-checkout-session", { plan_id: "price_mock_pro" });
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                console.error("No checkout URL returned");
            }
        } catch (error) {
            console.error("Failed to create checkout session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-20 px-4">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose the plan that's right for you. Unlock the full potential of your AI twin.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="glass-card relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>Essential features for personal use</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Chat</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 50 Memories</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Standard Voice Mode</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline">Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="glass-card border-primary/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            Pro <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        </CardTitle>
                        <CardDescription>Advanced features for power users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold">$19<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Chat & Memories</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced Voice & Mood Analysis</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Autonomous Agents</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg transition-all hover:scale-[1.02]" onClick={handleSubscribe} disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
