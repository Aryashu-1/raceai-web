"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CustomCursor() {
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Motion values for raw mouse input
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth physics for the cursor itself
  const smoothOptions = { damping: 40, stiffness: 400, mass: 0.8 }
  const x = useSpring(mouseX, smoothOptions)
  const y = useSpring(mouseY, smoothOptions)

  useEffect(() => {
    const manageMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      mouseX.set(clientX)
      mouseY.set(clientY)
      
      if (!isVisible) setIsVisible(true)
    }

    const manageMouseDown = () => setIsClicking(true)
    const manageMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", manageMouseMove)
    window.addEventListener("mousedown", manageMouseDown)
    window.addEventListener("mouseup", manageMouseUp)

    return () => {
      window.removeEventListener("mousemove", manageMouseMove)
      window.removeEventListener("mousedown", manageMouseDown)
      window.removeEventListener("mouseup", manageMouseUp)
    }
  }, [mouseX, mouseY, isVisible])

  if (!isVisible) return null

  // Circular Ring Cursor (Minimalist)
  // Smaller size, no dot, theme aware colors via CSS classes or context if needed. 
  // Since we are in a client component, we can check system preference or just use standard tailwind dark/light classes if we pass them through.
  // Actually, mixing-blend-mode might be better for visibility, or just simple colors.
  // User asked for "same color as text title" in light mode.
  
  const size = 24 // Significantly smaller

  return (
    <motion.div
      style={{
        x,
        y,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999999, // Ensure it's above everything including Modals
        pointerEvents: "none",
      }}
      className="z-[9999999]"
    >
      <motion.div 
        className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
        style={{ width: size, height: size }}
        animate={{ scale: isClicking ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
         {/* Main Ring - Theme Aware */}
         {/* Light Mode: border-foreground (usually black/dark gray). Dark Mode: border-cyan-400 */}
         <div className="absolute inset-0 rounded-full border-[1.5px] border-foreground/80 dark:border-cyan-400 shadow-sm dark:shadow-[0_0_10px_rgba(34,211,238,0.4)]" 
              style={{ width: '100%', height: '100%' }} />
         
         {/* Rotating Indicator (Segment) */}
         <motion.div 
            className="absolute inset-0 rounded-full border-t-[1.5px] border-transparent border-t-blue-600 dark:border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
         />
      </motion.div>
    </motion.div>
  )
}
