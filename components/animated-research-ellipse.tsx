"use client"

import { BookOpen, Brain, Cloud, Database, Microscope, Atom, Dna, FlaskConical, Lightbulb, Zap } from "lucide-react"

const researchIcons = [
  { Icon: BookOpen, color: "text-blue-400", delay: "0s" },
  { Icon: Brain, color: "text-purple-400", delay: "0.5s" },
  { Icon: Cloud, color: "text-cyan-400", delay: "1s" },
  { Icon: Database, color: "text-green-400", delay: "1.5s" },
  { Icon: Microscope, color: "text-orange-400", delay: "2s" },
  { Icon: Atom, color: "text-pink-400", delay: "2.5s" },
  { Icon: Dna, color: "text-red-400", delay: "3s" },
  { Icon: FlaskConical, color: "text-yellow-400", delay: "3.5s" },
  { Icon: Lightbulb, color: "text-amber-400", delay: "4s" },
  { Icon: Zap, color: "text-violet-400", delay: "4.5s" },
]

export default function AnimatedResearchEllipse() {
  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Central glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Elliptical orbit path */}
      <div
        className="absolute inset-0 border border-blue-200/30 rounded-full animate-spin-slow"
        style={{ animationDuration: "20s" }}
      />

      {/* Orbiting icons */}
      {researchIcons.map(({ Icon, color, delay }, index) => {
        const angle = index * 36 // 360 degrees / 10 icons
        return (
          <div
            key={index}
            className="absolute w-12 h-12 flex items-center justify-center"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)`,
              animationDelay: delay,
            }}
          >
            <div className={`animate-orbit-icon ${color} drop-shadow-lg`}>
              <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                <Icon size={20} className={color} />
              </div>
            </div>
          </div>
        )
      })}

      {/* Additional floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-blue-400/60 rounded-full animate-float-particle`}
            style={{
              top: `${20 + i * 12}%`,
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
