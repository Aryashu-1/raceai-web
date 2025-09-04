"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function useJARVISConversation() {
  const [currentState, setCurrentState] = useState<"idle" | "speaking" | "thinking" | "excited">("idle")
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const speak = (message: string) => {
    setCurrentState("speaking")
    setCurrentMessage(message)
    setIsTyping(true)
  }

  const idle = () => {
    setCurrentState("idle")
    setCurrentMessage("")
    setIsTyping(false)
  }

  const think = () => {
    setCurrentState("thinking")
  }

  const excited = () => {
    setCurrentState("excited")
  }

  const celebrate = (message: string) => {
    setCurrentState("excited")
    setCurrentMessage(message)
    setIsTyping(true)
  }

  return {
    currentState,
    currentMessage,
    isTyping,
    speak,
    idle,
    think,
    excited,
    celebrate,
  }
}

interface JARVISAssistantProps {
  size?: "small" | "medium" | "large"
  state?: "idle" | "speaking" | "thinking" | "excited"
  message?: string
  showMessage?: boolean
  onMessageComplete?: () => void
  className?: string
}

export function JarvisAssistant({
  size = "medium",
  state = "idle",
  message = "",
  showMessage = true,
  onMessageComplete,
  className,
}: JARVISAssistantProps) {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const { currentState, currentMessage, isTyping } = useJARVISConversation()

  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80,
  }
  const orbSize = sizeMap[size]

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full relative overflow-hidden transition-all duration-300",
            "bg-gradient-to-br from-[#246CD8] to-[#0052CC]",
            currentState === "idle" && "shadow-[0_0_20px_rgba(36,108,216,0.3)]",
            currentState === "speaking" && "shadow-[0_0_30px_rgba(36,108,216,0.4)] scale-105",
            currentState === "thinking" && "shadow-[0_0_25px_rgba(36,108,216,0.35)]",
            currentState === "excited" && "shadow-[0_0_40px_rgba(36,108,216,0.5)] scale-110",
          )}
          style={{ width: orbSize, height: orbSize }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />

          {currentState === "speaking" && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#C3DDFF]/20 to-transparent animate-pulse" />
          )}
        </div>
      </div>

      {currentMessage && showMessage && showSpeechBubble && (
        <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50 max-w-xs">
            <p className="text-foreground text-xs leading-relaxed">{currentMessage}</p>
          </div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-2 bg-card/95 border-l border-t border-border/50 transform rotate-45" />
          </div>
        </div>
      )}
    </div>
  )
}

export { useJARVISConversation as useJarvisConversation }
export { JarvisAssistant as JARVISAssistant }
export default JarvisAssistant
