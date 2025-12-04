import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="space-y-6 max-w-3xl">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-xl">
                        <span>EchoOS v1.0 Beta</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">
                        Your AI-Powered <br />
                        Digital Workspace
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Seamlessly integrate AI agents, memory management, and intelligent workflows into your daily routine.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-12 px-8 text-base">
                                Enter Workspace <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="https://github.com/your-repo" target="_blank">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                                View on GitHub
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 opacity-20 pointer-events-none" />
            </main>
        </div>
    );
}
