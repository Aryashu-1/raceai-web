"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

export default function JarvisThinking() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 p-2">
      <div className="relative">
        {/* Pulsing Shadow/Glow */}
        <motion.div
           animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           className="absolute inset-0 bg-blue-500/30 rounded-full blur-md"
        />
        <div className="relative z-10 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
             <Sparkles size={10} className="text-white animate-spin-slow" />
        </div>
      </div>
      
      {/* Typewriter Text */}
      <span className="text-blue-500 dark:text-blue-400 font-medium text-sm tracking-wide">
        JARVIS is thinking{dots}
      </span>
    </div>
  )
}
