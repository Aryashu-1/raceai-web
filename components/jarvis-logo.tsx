"use client"
import { cn } from "@/lib/utils"

interface JARVISLogoProps {
  size?: "sm" | "md" | "lg"
  state?: "idle" | "speaking" | "thinking" | "excited"
  className?: string
}

export default function JARVISLogo({ size = "md", state = "idle", className }: JARVISLogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-30 h-30",
  }

  const stateAnimations = {
    idle: "",
    speaking: "animate-bounce",
    thinking: "animate-spin",
    excited: "animate-pulse",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {/* Main JARVIS orb */}
      <div
        className={cn(
          "relative rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/25",
          "border border-blue-300/30 backdrop-blur-sm",
          sizeClasses[size],
          stateAnimations[state],
        )}
      >
        {/* Central AI symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 relative">
            <div className="absolute inset-0 bg-white/80 rounded-full animate-pulse" />
            <div className="absolute inset-1 bg-blue-600 rounded-full" />
            <div className="absolute inset-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
