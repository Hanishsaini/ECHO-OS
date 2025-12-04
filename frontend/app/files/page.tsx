"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Trash2, File, Image as ImageIcon } from "lucide-react";

export default function FilesPage() {
    const [files, setFiles] = useState([
        { id: "1", name: "project_specs.pdf", type: "pdf", size: "2.4 MB", date: "2023-10-24" },
        { id: "2", name: "meeting_notes.txt", type: "txt", size: "12 KB", date: "2023-10-23" },
        { id: "3", name: "architecture_diagram.png", type: "image", size: "1.8 MB", date: "2023-10-22" },
    ]);

    const handleUpload = () => {
        // Mock upload
        alert("File upload functionality coming soon!");
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Files</h2>
                    <p className="text-muted-foreground">Upload and manage documents for your AI to reference.</p>
                </div>
                <Button onClick={handleUpload}>
                    <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Your Documents</CardTitle>
                    <CardDescription>Files stored in your secure vault.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        {file.type === "image" ? <ImageIcon className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                                    </div>
                                    <div>
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {files.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <File className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No files uploaded yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
