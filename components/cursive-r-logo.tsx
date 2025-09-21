"use client"

interface CursiveRLogoProps {
  size?: number
  className?: string
}

export const CursiveRLogo = ({ size = 40, className = "" }: CursiveRLogoProps) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl blur-sm"></div>
    <div
      className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ width: size, height: size }}
    >
      <span
        className="font-serif italic font-bold tracking-tight"
        style={{
          fontSize: size * 0.5,
          fontFamily: 'Georgia, "Times New Roman", serif',
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        R
      </span>
    </div>
  </div>
)
