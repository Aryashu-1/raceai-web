"use client"

import { useEffect, useRef } from "react"

interface FloatingElement {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  type: "circle" | "triangle" | "square"
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elementsRef = useRef<FloatingElement[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createElements = () => {
      const elements: FloatingElement[] = []
      const count = Math.floor((window.innerWidth * window.innerHeight) / 15000)

      for (let i = 0; i < count; i++) {
        elements.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          type: ["circle", "triangle", "square"][Math.floor(Math.random() * 3)] as "circle" | "triangle" | "square",
        })
      }
      elementsRef.current = elements
    }

    const drawGrid = () => {
      const gridSize = 50
      ctx.strokeStyle = "rgba(36, 108, 216, 0.1)"
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawElement = (element: FloatingElement) => {
      ctx.save()
      ctx.globalAlpha = element.opacity
      ctx.fillStyle = "#246CD8"

      ctx.translate(element.x, element.y)

      switch (element.type) {
        case "circle":
          ctx.beginPath()
          ctx.arc(0, 0, element.size, 0, Math.PI * 2)
          ctx.fill()
          break
        case "triangle":
          ctx.beginPath()
          ctx.moveTo(0, -element.size)
          ctx.lineTo(-element.size, element.size)
          ctx.lineTo(element.size, element.size)
          ctx.closePath()
          ctx.fill()
          break
        case "square":
          ctx.fillRect(-element.size / 2, -element.size / 2, element.size, element.size)
          break
      }

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, "rgba(2, 24, 58, 0.95)")
      gradient.addColorStop(0.5, "rgba(36, 108, 216, 0.1)")
      gradient.addColorStop(1, "rgba(0, 82, 204, 0.05)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      drawGrid()

      // Update and draw floating elements
      elementsRef.current.forEach((element) => {
        element.x += element.vx
        element.y += element.vy

        // Wrap around edges
        if (element.x < 0) element.x = canvas.width
        if (element.x > canvas.width) element.x = 0
        if (element.y < 0) element.y = canvas.height
        if (element.y > canvas.height) element.y = 0

        drawElement(element)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createElements()
    animate()

    const handleResize = () => {
      resizeCanvas()
      createElements()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ background: "linear-gradient(135deg, #021A3A 0%, #246CD8 50%, #0052CC 100%)" }}
    />
  )
}
