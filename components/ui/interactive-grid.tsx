"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Point {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
}

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouse = useRef({ x: 0, y: 0 })
  const points = useRef<Point[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPoints()
    }

    const initPoints = () => {
      points.current = []
      const gap = 50
      const cols = Math.ceil(canvas.width / gap)
      const rows = Math.ceil(canvas.height / gap)

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * gap
          const y = j * gap
          points.current.push({
            x,
            y,
            originX: x,
            originY: y,
            vx: 0,
            vy: 0,
          })
        }
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const isDark = theme === "dark"
      const color = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      ctx.strokeStyle = color
      ctx.lineWidth = 1

      // Physics loop
      points.current.forEach((point) => {
        // Distance from mouse
        const dx = mouse.current.x - point.x
        const dy = mouse.current.y - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 200

        // Force application (Rubber band)
        if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist
            const angle = Math.atan2(dy, dx)
            const push = -force * 2 // Push away
            
            // Add velocity
            point.vx += Math.cos(angle) * push
            point.vy += Math.sin(angle) * push
        }

        // Return to origin (Spring)
        const spring = 0.05
        const friction = 0.90
        
        point.vx += (point.originX - point.x) * spring
        point.vy += (point.originY - point.y) * spring
        
        point.vx *= friction
        point.vy *= friction

        point.x += point.vx
        point.y += point.vy
        
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", (e) => {
        mouse.current.x = e.clientX
        mouse.current.y = e.clientY
    })

    const frame = requestAnimationFrame(animate)

    return () => {
        window.removeEventListener("resize", resize)
        cancelAnimationFrame(frame)
    }
  }, [theme])

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
