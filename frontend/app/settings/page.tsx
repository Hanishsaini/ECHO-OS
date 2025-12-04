import TwinProfileCard from "@/components/TwinProfileCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and AI twin configuration.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                    <TwinProfileCard />

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize how EchoOS looks on your device.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Dark Mode</Label>
                                    <p className="text-xs text-muted-foreground">Enable dark mode for the interface</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Reduced Motion</Label>
                                    <p className="text-xs text-muted-foreground">Disable complex animations</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>API Configuration</CardTitle>
                            <CardDescription>
                                Manage your API keys and connection settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="openai-key">OpenAI API Key</Label>
                                <Input id="openai-key" type="password" value="sk-........................" readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pinecone-key">Pinecone API Key</Label>
                                <Input id="pinecone-key" type="password" value="........................" readOnly />
                            </div>
                            <Button variant="outline" className="w-full">Update Keys</Button>
                        </CardContent>
                    </Card>

                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle>Data & Privacy</CardTitle>
                            <CardDescription>
                                Control how your data is stored and used.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Allow Training</Label>
                                    <p className="text-xs text-muted-foreground">Allow your twin to learn from interactions</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Cloud Sync</Label>
                                    <p className="text-xs text-muted-foreground">Sync memories across devices</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Button variant="destructive" className="w-full mt-4">Clear All Memories</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
