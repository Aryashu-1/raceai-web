"use client"

import { useId } from "react"

interface ModernLogoProps {
  size?: number
  className?: string
  showText?: boolean
  animated?: boolean
}

export default function ModernLogo({ size = 32, className = "", showText = true, animated = false }: ModernLogoProps) {
  const gradientId = useId().replace(/:/g, "") + "-gradient"

  // Unified Path for the 'R' to prevent stroke overlap artifacts
  // Combines Head and Leg into one continuous path or properly separated visual elements.
  // M10 30 L20 20 creates the leg. 
  // M10 20 L20 10 L30 10 ... creates the head/loop.
  // We'll draw them as a single group of paths with proper line joins.
  
  const PathR = (
      <path
        d="M10 20 L20 10 L30 10 C35.5 10 35.5 18 30 18 L20 18 L30 30 M10 30 L20 20"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
  )

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* RaceAI Modern Logo - Dynamic 'R' Shape */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`text-primary`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {/* Dominant Blue (75%), Cyan punch at the end (25%) */}
            <stop offset="0%" stopColor="#1e3a8a"> {/* Blue 900 - Deep anchor */}
              {animated && <animate attributeName="stop-color" values="#1e3a8a;#1e40af;#1e3a8a" dur="3s" repeatCount="indefinite" />}
            </stop>
            <stop offset="50%" stopColor="#1d4ed8"> {/* Blue 700 */}
              {animated && <animate attributeName="stop-color" values="#1d4ed8;#2563eb;#1d4ed8" dur="3s" repeatCount="indefinite" />}
            </stop>
            <stop offset="75%" stopColor="#0284c7"> {/* Sky 600 - Bridge */}
              {animated && <animate attributeName="stop-color" values="#0284c7;#0ea5e9;#0284c7" dur="3s" repeatCount="indefinite" />}
            </stop>
            <stop offset="100%" stopColor="#0891b2"> {/* Cyan 600 - Visible on Light */}
              {animated && <animate attributeName="stop-color" values="#0891b2;#06b6d4;#0891b2" dur="3s" repeatCount="indefinite" />}
            </stop>
          </linearGradient>
        </defs>

        {/* Static State: Render Normal Logo */}
        {!animated && (
          <g>
            {PathR}
          </g>
        )}

        {/* Animated State: Render Two Splitting Copies of the Whole Logo */}
        {animated && (
          <g>
            {/* Ghost 1: Moves Top-Left */}
            <g className="animate-path-1 mix-blend-multiply dark:mix-blend-screen">
              {PathR}
            </g>

            {/* Ghost 2: Moves Bottom-Right */}
            <g className="animate-path-2 mix-blend-multiply dark:mix-blend-screen">
              {PathR}
            </g>
          </g>
        )}
      </svg>

      {showText && (
        <span
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          RaceAI
        </span>
      )}
    </div>
  )
}