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
    <div className="flex items-center gap-2 p-2">
      {/* Typewriter Text */}
      <span className="text-blue-500 dark:text-blue-400 font-medium text-sm tracking-wide">
        JARVIS is thinking{dots}
      </span>
    </div>
  )
}
