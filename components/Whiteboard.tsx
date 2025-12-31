"use client";

import { useEffect, useRef, useState } from "react";
import { X, Check, Trash2, Eraser, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface WhiteboardProps {
    onClose: () => void;
    onAttach: (file: File) => void;
}

export default function Whiteboard({ onClose, onAttach }: WhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000"); // Default black
    const [tool, setTool] = useState<"pen" | "eraser">("pen");
    const [lineWidth, setLineWidth] = useState(3);
    const { toast } = useToast();

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set dimensions (could be dynamic based on window size)
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;

        // White background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Settings
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
    }, []);

    // Drawing handlers
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        setIsDrawing(true);
        const { x, y } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);

        ctx.lineWidth = tool === "eraser" ? 20 : lineWidth;
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx?.closePath();
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const handleAttach = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `whiteboard_${Date.now()}.png`, { type: "image/png" });
                onAttach(file);
                toast({ title: "Whiteboard Attached", description: "Drawing added to project/chat." });
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden w-[95vw] h-[90vh] border border-border">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                        <h3 className="font-semibold text-lg">Whiteboard</h3>

                        {/* Toolbar */}
                        <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
                            <Button
                                size="sm"
                                variant={tool === "pen" ? "default" : "ghost"}
                                onClick={() => setTool("pen")}
                                className="h-8 w-8 p-0"
                            >
                                <Pen size={16} />
                            </Button>
                            <Button
                                size="sm"
                                variant={tool === "eraser" ? "default" : "ghost"}
                                onClick={() => setTool("eraser")}
                                className="h-8 w-8 p-0"
                            >
                                <Eraser size={16} />
                            </Button>
                            <div className="w-px h-6 bg-border mx-1" />
                            <div className="flex gap-1">
                                {["#000000", "#ef4444", "#3b82f6", "#22c55e"].map((c) => (
                                    <button
                                        key={c}
                                        className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-primary scale-110" : "border-transparent"}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => { setColor(c); setTool("pen"); }}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={handleClear}>
                            <Trash2 size={16} className="mr-2" /> Clear
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleAttach} className="gap-2">
                            <Check size={16} /> Attach
                        </Button>
                        <Button size="icon" variant="ghost" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-hidden relative cursor-crosshair bg-muted/10">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full touch-none"
                    />
                </div>
            </div>
        </div>
    );
}
