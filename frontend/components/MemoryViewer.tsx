"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface Memory {
    id: string;
    tag: string;
    emotion: string;
    excerpt: string;
    createdAt?: string;
}

export default function MemoryViewer() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const response = await api.get("/api/memory/all");
                const data = Array.isArray(response.data) ? response.data : response.data.memories || [];
                setMemories(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch memories:", err);
                setError("Failed to load memories. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemories();
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <p className="text-destructive font-medium mb-2">Error Loading Memories</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
            </div>
        );
    }

    const [newMemory, setNewMemory] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveMemory = async () => {
        if (!newMemory.trim()) return;
        setIsSaving(true);
        try {
            await api.post("/api/memory/save", { text: newMemory, tags: ["manual"] });
            setNewMemory("");
            // Refresh memories
            const response = await api.get("/api/memory/all");
            const data = Array.isArray(response.data) ? response.data : response.data.memories || [];
            setMemories(data);
        } catch (err) {
            console.error("Failed to save memory:", err);
        } finally {
            setIsSaving(false);
        }
    };

    if (memories.length === 0 && !isLoading && !error) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 space-y-6">
                <div className="w-full max-w-md space-y-4">
                    <textarea
                        className="w-full p-3 rounded-xl border bg-background resize-none focus:ring-2 ring-primary/20 outline-none"
                        placeholder="Write a new memory..."
                        rows={3}
                        value={newMemory}
                        onChange={(e) => setNewMemory(e.target.value)}
                    />
                    <button
                        onClick={handleSaveMemory}
                        disabled={isSaving || !newMemory.trim()}
                        className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Memory"}
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Memories Yet</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                        Start chatting with your AI twin or add a memory manually.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="w-full max-w-md mx-auto space-y-4">
                <textarea
                    className="w-full p-3 rounded-xl border bg-background resize-none focus:ring-2 ring-primary/20 outline-none"
                    placeholder="Write a new memory..."
                    rows={3}
                    value={newMemory}
                    onChange={(e) => setNewMemory(e.target.value)}
                />
                <button
                    onClick={handleSaveMemory}
                    disabled={isSaving || !newMemory.trim()}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Memory"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memories.map((memory) => (
                    <div
                        key={memory.id}
                        className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:scale-[1.02]"
                    >
                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                                    {memory.tag}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                                    {memory.emotion}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                                {memory.excerpt}
                            </p>
                            {memory.createdAt && (
                                <p className="text-xs text-muted-foreground/60">
                                    {new Date(memory.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </div>
    );
}
