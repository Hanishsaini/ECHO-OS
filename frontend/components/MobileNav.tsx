"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm h-full shadow-2xl animate-in slide-in-from-left duration-300">
                        <Sidebar className="h-full w-full border-r" />
                    </div>
                    <div
                        className="absolute inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}
