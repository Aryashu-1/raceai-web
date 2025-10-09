"use client"

interface ModernLogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export default function ModernLogo({ size = 32, className = "", showText = true }: ModernLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Modern abstract logo inspired by AI/Research */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>

        {/* Modern geometric design */}
        <circle cx="24" cy="24" r="20" fill="url(#logoGradient)" opacity="0.1" />
        <circle cx="24" cy="24" r="14" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />

        {/* AI-inspired nodes */}
        <circle cx="24" cy="10" r="3" fill="url(#logoGradient)" />
        <circle cx="38" cy="24" r="3" fill="url(#logoGradient)" />
        <circle cx="24" cy="38" r="3" fill="url(#logoGradient)" />
        <circle cx="10" cy="24" r="3" fill="url(#logoGradient)" />

        {/* Connecting lines */}
        <path
          d="M24 10 L38 24 L24 38 L10 24 Z"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Center dot */}
        <circle cx="24" cy="24" r="4" fill="url(#logoGradient)" />
      </svg>

      {showText && (
        <span
          className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}
        >
          Race AI
        </span>
      )}
    </div>
  )
}