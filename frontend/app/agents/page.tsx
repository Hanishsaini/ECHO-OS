"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Code, Search, Sparkles } from "lucide-react";

export default function AgentsPage() {
    const agents = [
        {
            id: "research",
            name: "Research Agent",
            description: "Capable of searching the web, summarizing articles, and gathering information on any topic.",
            icon: Search,
            status: "active",
            capabilities: ["Web Search", "Summarization", "Fact Checking"]
        },
        {
            id: "coding",
            name: "Coding Assistant",
            description: "Helps with code generation, debugging, and refactoring. (Coming Soon)",
            icon: Code,
            status: "coming_soon",
            capabilities: ["Python", "TypeScript", "React"]
        },
        {
            id: "writer",
            name: "Creative Writer",
            description: "Drafts blog posts, stories, and marketing copy with your unique voice.",
            icon: Sparkles,
            status: "planned",
            capabilities: ["Copywriting", "Storytelling"]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
                <p className="text-muted-foreground">Manage and interact with your autonomous AI agents.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => {
                    const Icon = agent.icon;
                    return (
                        <Card key={agent.id} className="glass-card flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                                        {agent.status === "active" ? "Active" : agent.status === "coming_soon" ? "Coming Soon" : "Planned"}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4">{agent.name}</CardTitle>
                                <CardDescription>{agent.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-4">
                                <div className="flex flex-wrap gap-2">
                                    {agent.capabilities.map((cap) => (
                                        <span key={cap} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                                            {cap}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-auto pt-4">
                                    <Button className="w-full" disabled={agent.status !== "active"}>
                                        {agent.status === "active" ? "Launch Agent" : "Notify Me"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
