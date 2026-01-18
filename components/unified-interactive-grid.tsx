"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  originX: number
  originY: number
}

export default function UnifiedInteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const mouse = useRef({ x: 0, y: 0 })
  const points = useRef<Point[]>([]) // Flat array isn't ideal for grid connections, using 2D or indexed mapping is better
  
  // We'll store points in a grid structure for easier line drawing
  // But for the physics loop, a flat list is fine if we can map back.
  // Let's use a flat list but strictly ordered: cols * rows.
  // Access: index = i * rows + j

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    const gap = 50 
    const speed = 0.5 // Movement speed

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPoints()
    }

    // Grid Dimensions
    let cols = 0
    let rows = 0

    const initPoints = () => {
      points.current = []
      // Add significant buffer to ensure wrapping happens off-screen
      cols = Math.ceil(canvas.width / gap) + 4
      rows = Math.ceil(canvas.height / gap) + 4

      // Starting offsets to center or start off-screen
      const startX = -gap * 2
      const startY = -gap * 2

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + i * gap
          const y = startY + j * gap
          points.current.push({
            x,
            y,
            vx: 0,
            vy: 0,
            originX: x,
            originY: y
          })
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const isDark = theme === "dark"
      const primaryColor = isDark ? "59, 130, 246" : "0, 82, 204"
      const baseAlpha = isDark ? 0.15 : 0.1
      const dotColor = isDark ? "rgba(59, 130, 246, 0.5)" : "rgba(0, 82, 204, 0.4)"

      const totalWidth = cols * gap
      const totalHeight = rows * gap

      // Uppdate Physics
      points.current.forEach(p => {
        // 1. Move Origin (Top-Left to Bottom-Right)
        p.originX += speed
        p.originY += speed

        // 2. Wrap Logic (Teleport if too far)
        // We wrap relative to the viewport + buffer
        const wrapThresholdX = canvas.width + gap
        const wrapThresholdY = canvas.height + gap
        
        // If origin moves too far right/down, shift it back left/up
        // Shift by exact grid dimensions to maintain relative positions
        if (p.originX > wrapThresholdX) {
           p.originX -= totalWidth
           p.x -= totalWidth // Teleport physical particle too
        }
        if (p.originY > wrapThresholdY) {
           p.originY -= totalHeight
           p.y -= totalHeight
        }

        // 3. Mouse Interaction (Rubber Band)
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 200

        if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist
            const angle = Math.atan2(dy, dx)
            const push = -force * 2 // Strength
            
            p.vx += Math.cos(angle) * push
            p.vy += Math.sin(angle) * push
        }

        // 4. Spring to Origin
        const spring = 0.05
        const friction = 0.90
        
        p.vx += (p.originX - p.x) * spring
        p.vy += (p.originY - p.y) * spring
        
        p.vx *= friction
        p.vy *= friction

        p.x += p.vx
        p.y += p.vy
      })

      // Draw Lines & Dots
      ctx.strokeStyle = `rgba(${primaryColor}, ${baseAlpha})`
      ctx.lineWidth = 1

      // We iterate by grid indices to draw valid connections
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const index = i * rows + j
            const p = points.current[index]

            if (!p) continue

            // Draw Dot
            ctx.fillStyle = dotColor
            ctx.beginPath()
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2) 
            ctx.fill()

            // Connect Right (i+1)
            if (i < cols - 1) {
                const rightIndex = (i + 1) * rows + j
                const rightP = points.current[rightIndex]
                // Distance check prevents drawing wrap-around lines
                if (rightP && Math.abs(rightP.x - p.x) < gap * 2 && Math.abs(rightP.y - p.y) < gap * 2) {
                    ctx.beginPath()
                    ctx.moveTo(p.x, p.y)
                    ctx.lineTo(rightP.x, rightP.y)
                    ctx.stroke()
                }
            }

            // Connect Down (j+1)
            if (j < rows - 1) {
                const downIndex = i * rows + (j + 1)
                const downP = points.current[downIndex]
                if (downP && Math.abs(downP.x - p.x) < gap * 2 && Math.abs(downP.y - p.y) < gap * 2) {
                    ctx.beginPath()
                    ctx.moveTo(p.x, p.y)
                    ctx.lineTo(downP.x, downP.y)
                    ctx.stroke()
                }
            }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
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
        cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
