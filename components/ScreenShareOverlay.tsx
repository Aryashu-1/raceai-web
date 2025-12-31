"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, Play, Pause, MonitorX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScreenShareOverlayProps {
    stream: MediaStream;
    onStop: () => void;
    onAttach: (file: File) => void;
}

export default function ScreenShareOverlay({ stream, onStop, onAttach }: ScreenShareOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }

        // Listen for stream end (user clicks "Stop Sharing" in browser UI)
        stream.getVideoTracks()[0].onended = () => {
            onStop();
        };
    }, [stream, onStop]);

    const handleCapture = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `screenshot_${Date.now()}.png`, { type: "image/png" });
                onAttach(file);
            }
        }, "image/png");
    };

    if (!stream) return null;

    return (
        <div
            className={`fixed z-[9990] transition-all duration-300 ease-in-out shadow-2xl border border-white/10 overflow-hidden bg-black/80 backdrop-blur-md
        ${isMinimized
                    ? "bottom-4 right-4 w-12 h-12 rounded-full cursor-pointer hover:scale-110"
                    : "bottom-4 right-4 w-80 rounded-2xl"
                }`}
        >
            {isMinimized ? (
                <div
                    className="w-full h-full flex items-center justify-center text-primary"
                    onClick={() => setIsMinimized(false)}
                    title="Expand Screen Share"
                >
                    <Camera size={20} />
                </div>
            ) : (
                <div className="flex flex-col">
                    {/* Header */}
                    <div className="p-3 flex items-center justify-between border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-xs font-medium text-white">Live Screen</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-white/10 rounded-md text-white/70">
                                <MonitorX size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Video Preview */}
                    <div className="relative aspect-video bg-black group">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                size="sm"
                                onClick={handleCapture}
                                variant="secondary"
                                className="gap-2"
                            >
                                <Camera size={16} /> Snap
                            </Button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-3 flex gap-2">
                        <Button
                            variant="default"
                            size="sm"
                            className="w-full gap-2 relative overflow-hidden"
                            onClick={handleCapture}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                            <Camera size={16} /> Capture Frame
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="shrink-0"
                            onClick={() => {
                                stream.getTracks().forEach(track => track.stop());
                                onStop();
                            }}
                            title="Stop Sharing"
                        >
                            <X size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
