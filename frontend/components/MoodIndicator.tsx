"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MoodIndicatorProps {
    mood: string;
    className?: string;
}

export default function MoodIndicator({ mood, className }: MoodIndicatorProps) {
    const [color, setColor] = useState("bg-gray-500");
    const [label, setLabel] = useState("Neutral");

    useEffect(() => {
        switch (mood.toLowerCase()) {
            case "happy":
            case "excited":
            case "joyful":
                setColor("bg-green-500");
                setLabel("Happy");
                break;
            case "sad":
            case "depressed":
            case "down":
                setColor("bg-blue-500");
                setLabel("Sad");
                break;
            case "angry":
            case "frustrated":
            case "annoyed":
                setColor("bg-red-500");
                setLabel("Frustrated");
                break;
            case "stressed":
            case "anxious":
            case "worried":
                setColor("bg-orange-500");
                setLabel("Stressed");
                break;
            case "calm":
            case "relaxed":
            case "peaceful":
                setColor("bg-teal-500");
                setLabel("Calm");
                break;
            default:
                setColor("bg-gray-500");
                setLabel("Neutral");
        }
    }, [mood]);

    return (
        <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border shadow-sm", className)}>
            <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", color)} />
            <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
    );
}
