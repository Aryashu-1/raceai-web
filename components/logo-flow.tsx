"use client"

import { useId } from "react"

interface LogoFlowProps {
    size?: number
    className?: string
    showText?: boolean
    animated?: boolean
}

export default function LogoFlow({ size = 32, className = "", showText = true, animated = false }: LogoFlowProps) {
    const gradientId = useId().replace(/:/g, "") + "-flow-gradient"

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
                    <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
                        {/* Dynamic Flow Palette */}
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="50%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                </defs>

                {/* Flow 'R' - Single Continuous Stroke */}
                <path
                    d="M12 28 V12 C12 12 12 10 14 10 H22 C27 10 27 18 22 18 H18 L26 28"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Decoration Dot (Node) */}
                <circle cx="27" cy="11" r="2" fill="#0ea5e9" opacity="0.8" />

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
