"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Cpu, HardDrive, MessageSquare, Plus, Users, Zap, CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
}

interface AgentResult {
    summary: string;
    suggested_tasks: string[];
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [agentTopic, setAgentTopic] = useState("");
    const [isRunningAgent, setIsRunningAgent] = useState(false);
    const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
    const [isCreatingTask, setIsCreatingTask] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get("/api/tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const runAgent = async () => {
        if (!agentTopic.trim()) return;
        setIsRunningAgent(true);
        setAgentResult(null);
        try {
            const response = await api.post("/api/agents/run", {
                agent_id: "research",
                input: agentTopic,
                context: {}
            });
            setAgentResult(response.data.result);
        } catch (error) {
            console.error("Failed to run agent:", error);
        } finally {
            setIsRunningAgent(false);
        }
    };

    const createTask = async (title: string) => {
        setIsCreatingTask(true);
        try {
            await api.post("/api/tasks", { title, priority: "medium" });
            await fetchTasks();
            // Optional: Remove from suggested list or show success
        } catch (error) {
            console.error("Failed to create task:", error);
        } finally {
            setIsCreatingTask(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">Welcome back to EchoOS. Here's your system overview.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Chat
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Memories</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Running optimally</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45.2k</div>
                        <p className="text-xs text-muted-foreground">+180 today</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</div>
                        <p className="text-xs text-muted-foreground">Action items</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Agent Runner & Results */}
                <Card className="col-span-4 glass-card">
                    <CardHeader>
                        <CardTitle>Research Agent</CardTitle>
                        <CardDescription>
                            Deploy an autonomous agent to research topics and generate tasks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter a research topic (e.g., 'AI Agents orchestration')"
                                value={agentTopic}
                                onChange={(e) => setAgentTopic(e.target.value)}
                            />
                            <Button onClick={runAgent} disabled={isRunningAgent || !agentTopic}>
                                {isRunningAgent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                                <span className="ml-2">Run</span>
                            </Button>
                        </div>

                        {agentResult && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                                    <h4 className="font-semibold mb-2">Summary</h4>
                                    <p className="text-muted-foreground">{agentResult.summary}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2 text-sm">Suggested Tasks</h4>
                                    <div className="space-y-2">
                                        {agentResult.suggested_tasks.map((task, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 rounded border bg-background/50">
                                                <span className="text-sm">{task}</span>
                                                <Button size="sm" variant="ghost" onClick={() => createTask(task)} disabled={isCreatingTask}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Task Manager */}
                <Card className="col-span-3 glass-card">
                    <CardHeader>
                        <CardTitle>Task Manager</CardTitle>
                        <CardDescription>
                            Your daily plan and action items.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No tasks yet. Run an agent to generate some!
                                </div>
                            ) : (
                                tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2 w-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            <span className={`text-sm ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted-foreground capitalize">{task.priority}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
