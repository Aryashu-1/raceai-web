"use client"

import { useEffect, useRef, useState } from "react"

interface FloatingOrb {
  id: number
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  opacity: number
}

export default function AnimatedGlassmorphicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const orbsRef = useRef<FloatingOrb[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize floating orbs
    const initOrbs = () => {
      orbsRef.current = []
      const orbCount = Math.min(8, Math.floor(window.innerWidth / 200))

      for (let i = 0; i < orbCount; i++) {
        orbsRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 200 + 100,
          color: [
            "rgba(0, 82, 204, 0.04)", // Atlassian primary blue
            "rgba(7, 71, 166, 0.03)", // Atlassian dark blue
            "rgba(76, 154, 255, 0.02)", // Atlassian light blue
          ][Math.floor(Math.random() * 3)],
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.3 + 0.1,
        })
      }
    }
    initOrbs()

    // Mouse tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      )
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.03)")
      gradient.addColorStop(0.5, "rgba(147, 51, 234, 0.02)")
      gradient.addColorStop(1, "rgba(15, 23, 42, 0.05)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and animate orbs
      orbsRef.current.forEach((orb) => {
        // Update position
        orb.x += orb.speedX
        orb.y += orb.speedY

        // Bounce off edges
        if (orb.x <= 0 || orb.x >= canvas.width) orb.speedX *= -1
        if (orb.y <= 0 || orb.y >= canvas.height) orb.speedY *= -1

        // Mouse interaction (parallax effect)
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - orb.x, 2) +
          Math.pow(mouseRef.current.y - orb.y, 2)
        )
        const maxDistance = 200
        const influence = Math.max(0, 1 - mouseDistance / maxDistance)

        if (influence > 0) {
          const angle = Math.atan2(
            mouseRef.current.y - orb.y,
            mouseRef.current.x - orb.x
          )
          orb.x -= Math.cos(angle) * influence * 2
          orb.y -= Math.sin(angle) * influence * 2
        }

        // Create radial gradient for orb
        const orbGradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size
        )
        orbGradient.addColorStop(0, orb.color)
        orbGradient.addColorStop(1, "transparent")

        // Draw orb
        ctx.save()
        ctx.globalAlpha = orb.opacity
        ctx.fillStyle = orbGradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      {/* Canvas for animated background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />

      {/* Additional CSS-based animated elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Professional floating gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-[#0052CC]/4 to-[#0747A6]/3 rounded-full blur-3xl animate-pulse animation-delay-0"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-[#4C9AFF]/3 to-[#0052CC]/2 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-[#6554C0]/3 to-[#0747A6]/2 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

        {/* Subtle floating particles */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#0052CC]/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animation-delay-0 {
          animation-delay: 0s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  )
}