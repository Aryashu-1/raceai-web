"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function MorphingLogo({ className }: { className?: string }) {
  const [phase, setPhase] = useState<"strip" | "square" | "flower" | "logo">("strip")

  useEffect(() => {
    // Animation loop
    const sequence = async () => {
        setPhase("strip")
        await new Promise(r => setTimeout(r, 1000))
        setPhase("square")
        await new Promise(r => setTimeout(r, 1000))
        setPhase("flower")
        await new Promise(r => setTimeout(r, 1000))
        setPhase("logo")
    }
    sequence()
  }, [])

  return (
    <div className={cn("relative w-24 h-24 flex items-center justify-center", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Strip Phase */}
        <div 
            className={cn(
                "absolute bg-primary transition-all duration-700 ease-in-out",
                phase === "strip" ? "w-1 h-16 opacity-100" : "w-0 h-0 opacity-0"
            )}
        />
        {/* Square Phase */}
        <div 
            className={cn(
                "absolute border-2 border-primary transition-all duration-700 ease-in-out",
                phase === "square" ? "w-12 h-12 rotate-0 opacity-100" : "w-0 h-0 rotate-180 opacity-0"
            )}
        />
        {/* Flower Phase */}
        <div 
            className={cn(
                "absolute transition-all duration-700 ease-in-out",
                phase === "flower" ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
        >
             <FlowerIcon className="w-16 h-16 text-primary" />
        </div>
         {/* Final Logo Phase */}
         <div 
            className={cn(
                "absolute transition-all duration-1000 ease-out",
                phase === "logo" ? "opacity-100 scale-100" : "opacity-0 scale-90 translate-y-4"
            )}
        >
             <span className="font-bold text-3xl tracking-tighter">RACE AI</span>
        </div>
      </div>
    </div>
  )
}

function FlowerIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M12 2C9 7 4 9 2 12C4 15 9 17 12 22C15 17 20 15 22 12C20 9 15 7 12 2Z" />
        </svg>
    )
}
