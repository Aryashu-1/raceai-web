"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ARIALogoProps {
  size?: "sm" | "md" | "lg";
  state?: "idle" | "speaking" | "thinking" | "excited";
  className?: string;
}

export default function ARIALogo({
  size = "md",
  state = "idle",
  className,
}: ARIALogoProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const stateAnimations = {
    idle: "animate-pulse",
    speaking: "animate-bounce",
    thinking: "animate-spin-slow",
    excited: "animate-ping",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 blur-md",
          sizeClasses[size],
          state === "speaking" && "animate-pulse",
          state === "thinking" && "animate-spin-slow"
        )}
        style={{ transform: "scale(1.5)" }}
      />

      {/* Main ARIA orb */}
      <div
        className={cn(
          "relative rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/25",
          "border border-blue-300/30 backdrop-blur-sm",
          sizeClasses[size],
          stateAnimations[state]
        )}
      >
        {/* Inner core */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-200 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: "3s",
            }}
          />
        ))}

        {/* Central AI symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-white/80 rounded-full animate-pulse" />
            <div className="absolute inset-1 bg-blue-600 rounded-full" />
            <div className="absolute inset-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>

      {/* Orbital rings for thinking state */}
      {state === "thinking" && (
        <>
          <div
            className="absolute inset-0 border border-blue-400/30 rounded-full animate-spin"
            style={{ transform: "scale(1.3)" }}
          />
          <div
            className="absolute inset-0 border border-blue-500/20 rounded-full animate-spin-reverse"
            style={{ transform: "scale(1.6)" }}
          />
        </>
      )}
    </div>
  );
}
