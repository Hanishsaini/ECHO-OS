"use client";

import { useState, useEffect, useRef } from "react";

// Add type definitions for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

interface VoiceRecorderProps {
    onSendMessage: (message: string) => void;
    isProcessing?: boolean;
}

export default function VoiceRecorder({ onSendMessage, isProcessing = false }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechRecognitionConstructor = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechRecognitionConstructor) {
                const recognition = new SpeechRecognitionConstructor();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                    let finalTranscript = "";
                    let interimTranscript = "";

                    for (let i = 0; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    setTranscript(finalTranscript + interimTranscript);
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsRecording(false);
                };

                recognition.onend = () => {
                    setIsRecording(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const startRecording = () => {
        if (recognitionRef.current && !isRecording) {
            setTranscript("");
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);

            // We'll send the transcript in a moment to ensure we have the latest
            // But since stop() is async in terms of results, we might want to wait?
            // Actually, usually the last result comes in before onend.
            // But to be safe, we can just send what we have.
            // A better UX might be to let the user review and click send, 
            // but for now we'll auto-send on stop to match previous behavior.
            if (transcript.trim()) {
                onSendMessage(transcript);
            }
        }
    };

    if (!recognitionRef.current) {
        return null; // Or return a fallback UI if desired, but for now hiding it if not supported is cleaner
    }

    return (
        <div className="flex flex-col items-center gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto">
            <div className="w-full min-h-[100px] p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
                {transcript || <span className="text-muted-foreground italic">Listening...</span>}
            </div>

            <div className="flex items-center gap-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
                        <span>Start Recording</span>
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors animate-pulse"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        <span>Stop Recording</span>
                    </button>
                )}
            </div>
        </div>
    );
}
