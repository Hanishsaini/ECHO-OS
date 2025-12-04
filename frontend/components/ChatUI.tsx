"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import VoiceRecorder from "./VoiceRecorder";
import MoodIndicator from "./MoodIndicator";
import { Send, Mic, StopCircle, Bot, User, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface Message {
    role: "user" | "assistant";
    content: string;
    mood?: string;
    suggested_action?: string;
}

export default function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showRecorder, setShowRecorder] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: messageText };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        if (showRecorder) setShowRecorder(false);

        // Create placeholder for assistant message
        const assistantMessageId = Date.now().toString();
        setMessages((prev) => [...prev, {
            role: "assistant",
            content: "",
            id: assistantMessageId
        } as any]); // using any to bypass strict type check for id if not in interface

        try {
            // Use fetch for streaming
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Add auth header if needed, e.g. from session
                    // "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ input: messageText }),
            });

            if (!response.ok) throw new Error("Network response was not ok");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let currentMood = "";
            let currentAction = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || ""; // Keep incomplete chunk

                for (const line of lines) {
                    if (line.startsWith("event: metadata")) {
                        const dataLine = line.split("\n").find(l => l.startsWith("data: "));
                        if (dataLine) {
                            const data = JSON.parse(dataLine.slice(6));
                            currentMood = data.mood;
                            currentAction = data.suggested_action;

                            // Update message with metadata
                            setMessages((prev) => prev.map(msg =>
                                (msg as any).id === assistantMessageId
                                    ? { ...msg, mood: currentMood, suggested_action: currentAction }
                                    : msg
                            ));
                        }
                    } else if (line.startsWith("data: ")) {
                        const dataStr = line.slice(6);
                        if (dataStr === "[DONE]") break;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.content) {
                                setMessages((prev) => prev.map(msg =>
                                    (msg as any).id === assistantMessageId
                                        ? { ...msg, content: msg.content + data.content }
                                        : msg
                                ));
                            }
                        } catch (e) {
                            console.error("Error parsing stream data", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages((prev) => prev.map(msg =>
                (msg as any).id === assistantMessageId
                    ? { ...msg, content: msg.content + "\n[Error: Failed to complete response]" }
                    : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full relative">
            <Card className="flex-1 overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl flex flex-col">
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 py-20 opacity-50">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 animate-float">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-lg">EchoOS AI</p>
                                    <p className="text-sm">Ready to assist you</p>
                                </div>
                            </div>
                        )}
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.role === "assistant" && (
                                        <Avatar className="h-8 w-8 border border-primary/20">
                                            <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="flex flex-col gap-2 max-w-[80%]">
                                        <div
                                            className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted/50 backdrop-blur-md border border-border/50 text-foreground rounded-bl-none"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        {msg.mood && msg.mood !== "neutral" && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <MoodIndicator mood={msg.mood} />
                                                {msg.suggested_action && (
                                                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                                                        {msg.suggested_action}
                                                        <ArrowRight className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === "user" && (
                                        <Avatar className="h-8 w-8 border border-border">
                                            <AvatarFallback className="bg-muted"><User className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start gap-3"
                            >
                                <Avatar className="h-8 w-8 border border-primary/20">
                                    <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted/50 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-border/40 bg-background/40 backdrop-blur-md">
                    {showRecorder && (
                        <div className="mb-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                            <VoiceRecorder onSendMessage={(text) => sendMessage(text)} isProcessing={isLoading} />
                        </div>
                    )}

                    <div className="relative flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowRecorder(!showRecorder)}
                            className={`rounded-xl transition-all ${showRecorder ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
                            title="Toggle Voice Recorder"
                        >
                            {showRecorder ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>

                        <div className="relative flex-1">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type your message..."
                                className="w-full pl-4 pr-12 py-6 rounded-xl border-border/50 bg-background/50 focus-visible:ring-primary/20 transition-all shadow-inner"
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                onClick={() => sendMessage()}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg transition-transform active:scale-95"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
