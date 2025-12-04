"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

interface TwinProfileProps {
    username?: string;
    avatarUrl?: string;
}

export default function TwinProfileCard({
    username = "Echo Twin",
    avatarUrl,
}: TwinProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [energy, setEnergy] = useState(50);
    const [formality, setFormality] = useState(50);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/api/twin/profile");
                setEnergy(response.data.energy);
                setFormality(response.data.formality);
            } catch (error) {
                console.error("Failed to fetch twin profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put("/api/twin/profile", { energy, formality });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update twin profile:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="w-full max-w-sm h-64 rounded-xl border bg-card animate-pulse" />;
    }

    return (
        <div className="w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="relative h-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
                <div className="absolute top-4 right-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        disabled={isSaving}
                        className="h-8"
                    >
                        {isSaving ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : isEditing ? (
                            "Save"
                        ) : (
                            "Edit"
                        )}
                    </Button>
                </div>
            </div>

            <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                    <div className="h-24 w-24 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={`${username}'s avatar`}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-muted-foreground">
                                {username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <h3 className="font-semibold text-xl tracking-tight">{username}</h3>
                    <p className="text-sm text-muted-foreground">Digital Twin Persona</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Energy Level</Label>
                            <span className="text-xs text-muted-foreground">{energy}%</span>
                        </div>
                        <Slider
                            value={[energy]}
                            onValueChange={(vals) => isEditing && setEnergy(vals[0])}
                            max={100}
                            step={1}
                            disabled={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Formality</Label>
                            <span className="text-xs text-muted-foreground">{formality}%</span>
                        </div>
                        <Slider
                            value={[formality]}
                            onValueChange={(vals) => isEditing && setFormality(vals[0])}
                            max={100}
                            step={1}
                            disabled={!isEditing}
                            className={!isEditing ? "opacity-70" : ""}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
