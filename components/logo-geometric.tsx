"use client"

import { useId } from "react"

interface LogoGeometricProps {
    size?: number
    className?: string
    showText?: boolean
    animated?: boolean
}

export default function LogoGeometric({ size = 32, className = "", showText = true, animated = false }: LogoGeometricProps) {
    const gradientId = useId().replace(/:/g, "") + "-geo-gradient"

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        {/* Uses the same refined palette */}
                        <stop offset="0%" stopColor="#1e40af" />
                        <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                </defs>

                {/* Geometric 'R' Construction */}
                {/* 1. Vertical backbone (Sturdy rectangle) */}
                <rect x="8" y="8" width="8" height="24" rx="1" fill={`url(#${gradientId})`} opacity="0.9" />

                {/* 2. Top Loop (Half Circle / Block) */}
                <path
                    d="M16 8 H24 C28.4 8 32 11.6 32 16 C32 20.4 28.4 24 24 24 H16 V8 Z"
                    fill={`url(#${gradientId})`}
                    opacity="0.8"
                />

                {/* 3. The Kick (Angled leg) */}
                <path
                    d="M22 24 L30 32 L26 32 L18 24 H22 Z"
                    fill={`url(#${gradientId})`}
                />
            </svg>

            {showText && (
                <span
                    className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent"
                    style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                >
                    RaceAI
                </span>
            )}
        </div>
    )
}
