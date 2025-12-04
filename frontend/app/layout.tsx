import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "EchoOS",
    description: "AI Workspace",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
                    {/* Desktop Sidebar */}
                    <Sidebar className="hidden md:flex" />

                    <div className="flex-1 flex flex-col min-w-0 relative">
                        {/* Background Gradients */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

                        {/* Topbar */}
                        <header className="h-16 border-b border-border/40 flex items-center justify-between px-4 md:px-6 bg-background/60 backdrop-blur-xl z-10 sticky top-0">
                            <div className="flex items-center gap-4">
                                <MobileNav />
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-secondary/50 backdrop-blur-sm">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">System Status</span>
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                                    <span className="text-xs font-semibold">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Topbar actions can go here */}
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 overflow-auto p-4 md:p-6 z-10 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-transparent">
                            <div className="max-w-7xl mx-auto w-full">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
