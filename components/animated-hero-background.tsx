"use client"

import React, { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Activity, MessageSquare, Microscope, Atom, Dna } from "lucide-react"

interface FloatingIcon {
  id: number
  Icon: React.ElementType
  x: number
  y: number
  rotation: number
  floatOffset: number
  delay: number
}

export default function AnimatedHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener("resize", updateSize)

    const isDark = theme === "dark"

    // Curved paths - Bezier curves
    const paths = [
      // Top flowing curve
      {
        start: { x: -50, y: 200 },
        cp1: { x: 300, y: 100 },
        cp2: { x: 600, y: 300 },
        end: { x: window.innerWidth + 50, y: 250 },
        color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)",
        width: 1.5,
      },
      // Middle curve
      {
        start: { x: -50, y: 400 },
        cp1: { x: 400, y: 300 },
        cp2: { x: 800, y: 500 },
        end: { x: window.innerWidth + 50, y: 450 },
        color: isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.4)",
        width: 1.5,
      },
      // Bottom flowing curve
      {
        start: { x: -50, y: window.innerHeight - 150 },
        cp1: { x: 500, y: window.innerHeight - 250 },
        cp2: { x: 900, y: window.innerHeight - 100 },
        end: { x: window.innerWidth + 50, y: window.innerHeight - 200 },
        color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.35)",
        width: 1.5,
      },
    ]

    // Blue accent lines - geometric patterns
    const accentLines = [
      // Top left triangle
      { x1: 0, y1: 0, x2: 200, y2: 150 },
      { x1: 200, y1: 150, x2: 150, y2: 250 },
      { x1: 150, y1: 250, x2: 0, y2: 200 },

      // Top right triangle
      { x1: window.innerWidth, y1: 0, x2: window.innerWidth - 250, y2: 100 },
      { x1: window.innerWidth - 250, y1: 100, x2: window.innerWidth - 150, y2: 200 },

      // Bottom right geometric
      { x1: window.innerWidth, y1: window.innerHeight, x2: window.innerWidth - 200, y2: window.innerHeight - 150 },
      { x1: window.innerWidth - 200, y1: window.innerHeight - 150, x2: window.innerWidth - 300, y2: window.innerHeight - 100 },
    ]

    // Animated particles moving along paths
    const particles: Array<{
      x: number
      y: number
      progress: number
      pathIndex: number
      speed: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 8; i++) {
      particles.push({
        x: 0,
        y: 0,
        progress: Math.random(),
        pathIndex: Math.floor(Math.random() * paths.length),
        speed: 0.0003 + Math.random() * 0.0005,
        opacity: 0.3 + Math.random() * 0.4,
      })
    }

    let animationFrameId: number
    let pulsePhase = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw curved paths with pulse effect
      pulsePhase += 0.01
      paths.forEach((path, index) => {
        ctx.beginPath()
        ctx.moveTo(path.start.x, path.start.y)
        ctx.bezierCurveTo(
          path.cp1.x,
          path.cp1.y,
          path.cp2.x,
          path.cp2.y,
          path.end.x,
          path.end.y
        )

        // Pulse opacity
        const pulse = 0.3 + Math.sin(pulsePhase + index * 0.5) * 0.3
        ctx.strokeStyle = path.color.replace(/[\d.]+\)$/, `${pulse})`)
        ctx.lineWidth = path.width
        ctx.stroke()
      })

      // Draw blue accent lines
      const accentColor = isDark ? "rgba(0, 82, 204, 0.7)" : "rgba(0, 82, 204, 0.6)"
      ctx.strokeStyle = accentColor
      ctx.lineWidth = 2

      accentLines.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.stroke()
      })

      // Update and draw particles
      particles.forEach((particle) => {
        particle.progress += particle.speed
        if (particle.progress > 1) {
          particle.progress = 0
          particle.pathIndex = Math.floor(Math.random() * paths.length)
        }

        const path = paths[particle.pathIndex]
        const t = particle.progress

        // Calculate position on bezier curve
        const x =
          Math.pow(1 - t, 3) * path.start.x +
          3 * Math.pow(1 - t, 2) * t * path.cp1.x +
          3 * (1 - t) * Math.pow(t, 2) * path.cp2.x +
          Math.pow(t, 3) * path.end.x

        const y =
          Math.pow(1 - t, 3) * path.start.y +
          3 * Math.pow(1 - t, 2) * t * path.cp1.y +
          3 * (1 - t) * Math.pow(t, 2) * path.cp2.y +
          Math.pow(t, 3) * path.end.y

        particle.x = x
        particle.y = y

        // Draw particle
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = isDark
          ? `rgba(76, 154, 255, ${particle.opacity})`
          : `rgba(0, 82, 204, ${particle.opacity})`
        ctx.fill()

        // Draw glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
        gradient.addColorStop(0, isDark
          ? `rgba(76, 154, 255, ${particle.opacity * 0.5})`
          : `rgba(0, 82, 204, ${particle.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateSize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1929] via-[#111827] to-[#1E293B] dark:from-[#0A1929] dark:via-[#111827] dark:to-[#1E293B]" />

      {/* Canvas for paths and particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Floating icons with SVG styling */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Research network icon - top left */}
        <div
          className="absolute floating-icon"
          style={{
            top: "15%",
            left: "10%",
            animation: "float 3s ease-in-out infinite",
            animationDelay: "0s",
          }}
        >
          <Activity
            size={50}
            className="text-white/70 stroke-[1.5]"
            strokeWidth={1.5}
            fill="none"
          />
        </div>

        {/* Chat icon - upper right */}
        <div
          className="absolute floating-icon"
          style={{
            top: "20%",
            right: "15%",
            animation: "float 3.5s ease-in-out infinite",
            animationDelay: "0.5s",
          }}
        >
          <MessageSquare
            size={45}
            className="text-white/75 stroke-[1.5]"
            strokeWidth={1.5}
            fill="none"
          />
        </div>

        {/* Microscope icon - bottom left */}
        <div
          className="absolute floating-icon"
          style={{
            bottom: "25%",
            left: "8%",
            animation: "float 3.2s ease-in-out infinite",
            animationDelay: "1s",
          }}
        >
          <Microscope
            size={48}
            className="text-white/65 stroke-[1.5]"
            strokeWidth={1.5}
            fill="none"
          />
        </div>

        {/* Atom icon - bottom center-right */}
        <div
          className="absolute floating-icon"
          style={{
            bottom: "20%",
            right: "40%",
            animation: "float 2.8s ease-in-out infinite",
            animationDelay: "0.3s",
          }}
        >
          <Atom
            size={52}
            className="text-white/70 stroke-[1.5]"
            strokeWidth={1.5}
            fill="none"
          />
        </div>

        {/* DNA icon - bottom right */}
        <div
          className="absolute floating-icon"
          style={{
            bottom: "15%",
            right: "12%",
            animation: "float 3.3s ease-in-out infinite",
            animationDelay: "0.7s",
          }}
        >
          <Dna
            size={46}
            className="text-white/68 stroke-[1.5]"
            strokeWidth={1.5}
            fill="none"
          />
        </div>
      </div>

      {/* Blur overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 backdrop-blur-[0.5px]" />

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(3deg);
          }
        }
      `}</style>
    </>
  )
}
