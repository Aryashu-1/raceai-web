"use client"

import { useState, useEffect } from "react"
import { JarvisAssistant } from "./jarvis-assistant"

interface JarvisConversationProps {
  message: string
  state: "idle" | "speaking" | "thinking" | "excited"
  showTyping?: boolean
}

export default function JarvisConversation({ message, state, showTyping = false }: JarvisConversationProps) {
  const [displayedMessage, setDisplayedMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (showTyping && message) {
      setIsTyping(true)
      setDisplayedMessage("")

      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setDisplayedMessage(message.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    } else {
      setDisplayedMessage(message)
      setIsTyping(false)
    }
  }, [message, showTyping])

  return (
    <div className="flex flex-col items-center justify-center min-h-[25vh] space-y-6 max-w-4xl mx-auto relative px-4">
      {displayedMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[700px] h-[400px]">
            {/* Primary halo - intense blue glow behind speech bubble */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-400/40 via-blue-500/25 to-transparent rounded-full blur-3xl animate-pulse" />
            {/* Secondary halo - pulsing outer ring */}
            <div
              className="absolute inset-0 bg-gradient-radial from-blue-300/30 via-blue-400/20 to-transparent rounded-full blur-2xl animate-pulse scale-110"
              style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
            />
            {/* Tertiary halo - rotating light effect */}
            <div
              className="absolute inset-0 bg-gradient-conic from-blue-500/25 via-transparent via-transparent to-blue-500/25 rounded-full blur-xl animate-spin"
              style={{ animationDuration: "6s" }}
            />
            {/* Quaternary halo - subtle breathing effect */}
            <div
              className="absolute inset-0 bg-gradient-radial from-blue-600/15 via-blue-700/10 to-transparent rounded-full blur-xl animate-pulse scale-125"
              style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-center relative z-20">
        <JarvisAssistant state={state} size="lg" showParticles={true} />
      </div>

      {displayedMessage && (
        <div className="relative z-20 flex flex-col items-center">
          <div className="glass-card-enhanced rounded-2xl px-8 py-6 max-w-2xl text-center shadow-2xl border border-blue-400/40 backdrop-blur-xl bg-card/90 relative">
            {/* Additional glow effect specifically for the speech bubble */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-blue-500/10 rounded-2xl blur-sm"></div>
            <p className="text-base text-foreground leading-relaxed font-medium relative z-10">
              {displayedMessage}
              {isTyping && <span className="animate-pulse text-blue-400">|</span>}
            </p>
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-card/90 border-l border-t border-blue-400/40 transform rotate-45 backdrop-blur-xl shadow-lg"></div>
          </div>
        </div>
      )}
    </div>
  )
}
