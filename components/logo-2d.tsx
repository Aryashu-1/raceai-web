"use client"

import { useRouter } from "next/navigation"

interface Logo2DProps {
  size?: "sm" | "md" | "lg"
  onClick?: () => void
  className?: string
}

export default function Logo2D({ size = "md", onClick, className = "" }: Logo2DProps) {
  const router = useRouter()

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      router.push("/jarvis")
    }
  }

  return (
    <div
      className={`${sizeClasses[size]} cursor-pointer transition-transform duration-300 hover:scale-110 ${className}`}
      onClick={handleClick}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer geometric frame */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          stroke="#0052CC"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />

        {/* Inner rotating square */}
        <rect
          x="25"
          y="25"
          width="50"
          height="50"
          stroke="#035ed8"
          strokeWidth="2"
          fill="none"
          transform="rotate(45 50 50)"
          className="animate-spin"
          style={{ animationDuration: "8s" }}
        />

        {/* Central circle */}
        <circle
          cx="50"
          cy="50"
          r="15"
          stroke="#26C6DA"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Corner dots */}
        <circle cx="20" cy="20" r="2" fill="#0052CC" className="animate-ping" />
        <circle cx="80" cy="20" r="2" fill="#035ed8" className="animate-ping" style={{ animationDelay: "0.2s" }} />
        <circle cx="20" cy="80" r="2" fill="#26C6DA" className="animate-ping" style={{ animationDelay: "0.4s" }} />
        <circle cx="80" cy="80" r="2" fill="#0052CC" className="animate-ping" style={{ animationDelay: "0.6s" }} />
      </svg>
    </div>
  )
}
