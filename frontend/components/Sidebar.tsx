"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    MessageSquare,
    Brain,
    Bot,
    Files,
    Settings,
    LogOut
} from "lucide-react";

const sidebarItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/memories", label: "Memories", icon: Brain },
    { href: "/agents", label: "Agents", icon: Bot },
    { href: "/files", label: "Files", icon: Files },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("w-64 border-r border-border bg-card/30 backdrop-blur-xl p-4 flex flex-col z-20", className)}>
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-inner shadow-primary/10">
                    <span className="font-bold text-primary text-xl">E</span>
                </div>
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">EchoOS</span>
            </div>
            <nav className="space-y-1 flex-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 border border-white/10 shadow-lg group-hover:ring-2 ring-primary/20 transition-all" />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Admin User</span>
                        <span className="text-xs text-muted-foreground">Pro Plan</span>
                    </div>
                    <LogOut className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </aside>
    );
}
