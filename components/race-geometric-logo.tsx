"use client"

interface RaceGeometricLogoProps {
  size?: number
  variant?: "primary" | "secondary" | "white"
  showText?: boolean
  className?: string
}

export default function RaceGeometricLogo({
  size = 40,
  variant = "primary",
  showText = true,
  className = "",
}: RaceGeometricLogoProps) {
  const colors = {
    primary: {
      cube: "#1E40AF",
      accent: "#2563EB",
      text: "#1E40AF",
    },
    secondary: {
      cube: "#2563EB",
      accent: "#3B82F6",
      text: "#2563EB",
    },
    white: {
      cube: "#FFFFFF",
      accent: "#F1F5F9",
      text: "#FFFFFF",
    },
  }

  const currentColors = colors[variant]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm">
          {/* Main cube structure */}
          <g fill="none" stroke={currentColors.cube} strokeWidth="2.5">
            {/* Front face */}
            <path d="M20 30 L50 15 L80 30 L80 60 L50 75 L20 60 Z" />

            {/* Top face */}
            <path d="M20 30 L35 20 L65 20 L80 30 L50 15 Z" />

            {/* Right face */}
            <path d="M80 30 L80 60 L65 70 L65 40 Z" />

            {/* Internal structure lines */}
            <path d="M35 20 L35 50 L20 60" strokeWidth="1.5" opacity="0.7" />
            <path d="M65 20 L65 50 L80 60" strokeWidth="1.5" opacity="0.7" />
            <path d="M50 15 L50 45 L35 50" strokeWidth="1.5" opacity="0.7" />
            <path d="M50 45 L65 50" strokeWidth="1.5" opacity="0.7" />
          </g>

          {/* Accent elements */}
          <g fill={currentColors.accent} opacity="0.6">
            <circle cx="35" cy="35" r="2" />
            <circle cx="65" cy="35" r="2" />
            <circle cx="50" cy="50" r="2.5" />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className="font-bold tracking-wide"
            style={{
              color: currentColors.text,
              fontSize: size * 0.6,
              fontFamily: "Satoshi, system-ui, sans-serif",
            }}
          >
            RACE
          </span>
          {size > 32 && (
            <span
              className="text-xs opacity-75 tracking-wider"
              style={{
                color: currentColors.text,
                fontFamily: "Satoshi, system-ui, sans-serif",
              }}
            >
              Research AI
            </span>
          )}
        </div>
      )}
    </div>
  )
}
