"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface AnimatedTechBackgroundProps {
  variant?: "falling" | "floating" | "waves" | "grid"
}

export default function AnimatedTechBackground({ variant = "falling" }: AnimatedTechBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const isDark = theme === "dark"
    // Use primary blue from theme
    const primaryColor = isDark ? "59, 130, 246" : "0, 82, 204" // Primary blue (#0052CC)
    const secondaryColor = isDark ? "76, 154, 255" : "71, 71, 166" // Accent blue (#4C9AFF / #0747A6)

    if (variant === "falling") {
      // Falling lights animation (for chat/jarvis page)
      class Particle {
        x: number
        y: number
        speed: number
        size: number
        opacity: number
        fadeSpeed: number
        direction: 1 | -1

        constructor() {
          this.direction = Math.random() > 0.5 ? 1 : -1
          this.x = this.direction === 1 ? 0 : canvas.width
          this.y = Math.random() * canvas.height
          this.speed = 0.3 + Math.random() * 0.5 // Slower speed
          this.size = 1 + Math.random() * 1.5
          this.opacity = 0
          this.fadeSpeed = 0.005 + Math.random() * 0.01 // Slower fade
        }

        update() {
          this.x += this.speed * 2 * this.direction
          this.y += this.speed

          if (this.opacity < 0.6 && this.y < canvas.height / 3) {
            this.opacity += this.fadeSpeed
          } else {
            this.opacity -= this.fadeSpeed * 0.5
          }

          if (
            this.opacity <= 0 ||
            this.y > canvas.height ||
            (this.direction === 1 && this.x > canvas.width) ||
            (this.direction === -1 && this.x < 0)
          ) {
            this.direction = Math.random() > 0.5 ? 1 : -1
            this.x = this.direction === 1 ? 0 : canvas.width
            this.y = Math.random() * canvas.height
            this.opacity = 0
            this.speed = 0.3 + Math.random() * 0.5
            this.size = 1 + Math.random() * 1.5
          }
        }

        draw() {
          if (!ctx) return
          ctx.fillStyle = `rgba(${primaryColor}, ${this.opacity})`
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = `rgba(${primaryColor}, ${this.opacity * 0.3})`
          ctx.lineWidth = this.size * 0.5
          ctx.beginPath()
          ctx.moveTo(this.x, this.y)
          ctx.lineTo(this.x - this.speed * 10 * this.direction, this.y - this.speed * 5)
          ctx.stroke()
        }
      }

      const particles: Particle[] = []
      const particleCount = 30 // Reduced count
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }

      let animationId: number
      const animate = () => {
        ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle) => {
          particle.update()
          particle.draw()
        })

        animationId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationId)
      }
    } else if (variant === "floating") {
      // Floating orbs animation (for knowledge page)
      class Orb {
        x: number
        y: number
        radius: number
        vx: number
        vy: number
        opacity: number

        constructor() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.radius = 20 + Math.random() * 40
          this.vx = (Math.random() - 0.5) * 0.3
          this.vy = (Math.random() - 0.5) * 0.3
          this.opacity = 0.1 + Math.random() * 0.2
        }

        update() {
          this.x += this.vx
          this.y += this.vy

          if (this.x < 0 || this.x > canvas.width) this.vx *= -1
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1
        }

        draw() {
          if (!ctx) return
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
          gradient.addColorStop(0, `rgba(${primaryColor}, ${this.opacity})`)
          gradient.addColorStop(1, `rgba(${secondaryColor}, 0)`)
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const orbs: Orb[] = []
      for (let i = 0; i < 8; i++) {
        orbs.push(new Orb())
      }

      let animationId: number
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        orbs.forEach((orb) => {
          orb.update()
          orb.draw()
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationId)
      }
    } else if (variant === "waves") {
      // Wave animation (for dashboard)
      let time = 0
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        time += 0.01

        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2)

          for (let x = 0; x < canvas.width; x += 5) {
            const y =
              canvas.height / 2 +
              Math.sin(x * 0.01 + time + i * 2) * 30 +
              Math.sin(x * 0.005 + time * 0.5) * 20
            ctx.lineTo(x, y)
          }

          ctx.strokeStyle = `rgba(${primaryColor}, ${0.1 - i * 0.03})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        animationId = requestAnimationFrame(animate)
      }
      let animationId = requestAnimationFrame(animate)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationId)
      }
    } else if (variant === "grid") {
      // Enhanced grid animation with dots and light lines from both ends
      const gridSize = 60
      let offset = 0
      let time = 0

      // Light lines coming from sides
      const lightLines: Array<{x: number, y: number, speed: number, side: 'left' | 'right', opacity: number}> = []

      // Create initial light lines
      for (let i = 0; i < 5; i++) {
        lightLines.push({
          x: 0,
          y: Math.random() * canvas.height,
          speed: 1 + Math.random() * 2,
          side: 'left',
          opacity: 0.3 + Math.random() * 0.4
        })
        lightLines.push({
          x: canvas.width,
          y: Math.random() * canvas.height,
          speed: 1 + Math.random() * 2,
          side: 'right',
          opacity: 0.3 + Math.random() * 0.4
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        offset += 0.3
        time += 0.01

        // Draw moving grid lines
        ctx.strokeStyle = `rgba(${primaryColor}, 0.12)`
        ctx.lineWidth = 1

        for (let x = (offset % gridSize) - gridSize; x < canvas.width; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }

        for (let y = (offset % gridSize) - gridSize; y < canvas.height; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        // Draw and update light lines from both ends
        lightLines.forEach((line) => {
          if (line.side === 'left') {
            line.x += line.speed
            if (line.x > canvas.width) {
              line.x = 0
              line.y = Math.random() * canvas.height
              line.opacity = 0.3 + Math.random() * 0.4
            }
          } else {
            line.x -= line.speed
            if (line.x < 0) {
              line.x = canvas.width
              line.y = Math.random() * canvas.height
              line.opacity = 0.3 + Math.random() * 0.4
            }
          }

          // Draw glowing line
          const gradient = ctx.createLinearGradient(
            line.side === 'left' ? line.x - 50 : line.x + 50,
            line.y,
            line.side === 'left' ? line.x + 50 : line.x - 50,
            line.y
          )
          gradient.addColorStop(0, `rgba(${primaryColor}, 0)`)
          gradient.addColorStop(0.5, `rgba(${primaryColor}, ${line.opacity})`)
          gradient.addColorStop(1, `rgba(${secondaryColor}, 0)`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(line.side === 'left' ? line.x - 50 : line.x + 50, line.y)
          ctx.lineTo(line.side === 'left' ? line.x + 50 : line.x - 50, line.y)
          ctx.stroke()

          // Draw glow point
          const glowGradient = ctx.createRadialGradient(line.x, line.y, 0, line.x, line.y, 8)
          glowGradient.addColorStop(0, `rgba(${secondaryColor}, ${line.opacity})`)
          glowGradient.addColorStop(1, `rgba(${primaryColor}, 0)`)
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(line.x, line.y, 8, 0, Math.PI * 2)
          ctx.fill()
        })

        // Draw animated dots at intersections
        for (let x = (offset % gridSize) - gridSize; x < canvas.width; x += gridSize) {
          for (let y = (offset % gridSize) - gridSize; y < canvas.height; y += gridSize) {
            const distanceFromCenter = Math.sqrt(
              Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2)
            )
            const wave = Math.sin(time * 2 + distanceFromCenter / 100) * 0.5 + 0.5
            const opacity = 0.2 + wave * 0.3

            ctx.fillStyle = `rgba(${secondaryColor}, ${opacity})`
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }

        animationId = requestAnimationFrame(animate)
      }
      let animationId = requestAnimationFrame(animate)

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        cancelAnimationFrame(animationId)
      }
    }
  }, [variant, theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
