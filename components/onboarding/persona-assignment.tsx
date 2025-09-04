"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AriaAssistant } from "@/components/aria-assistant"
import { ArrowRight, AlertCircle } from "lucide-react"

interface Researcher {
  id: string
  name: string
  field: string
  institution: string
  citations: string
  image: string
  description: string
  tags: string[]
}

interface PersonaAssignmentProps {
  userData: {
    firstName: string
    lastName: string
    role: string
    interests: string[]
    profilePicture?: string
    selectedAvatar?: any
  }
  favoriteResearcher: Researcher | null
  onComplete: (persona: { name: string; tagline: string; color: string }) => void
}

const generatePersona = (userData: any, researcher: Researcher | null) => {
  const personas = [
    {
      name: "The Curious Explorer",
      tagline: "Always asking the next question",
      color: "from-blue-400 to-blue-600",
      match: ["student", "undergraduate"],
    },
    {
      name: "The Deep Thinker",
      tagline: "Diving beneath the surface",
      color: "from-blue-500 to-blue-700",
      match: ["graduate", "phd"],
    },
    {
      name: "The Innovation Catalyst",
      tagline: "Turning ideas into impact",
      color: "from-blue-600 to-blue-800",
      match: ["researcher", "professor"],
    },
    {
      name: "The Knowledge Weaver",
      tagline: "Connecting dots across disciplines",
      color: "from-blue-300 to-blue-500",
      match: ["interdisciplinary", "collaboration"],
    },
    {
      name: "The Methodical Pioneer",
      tagline: "Building tomorrow's foundations",
      color: "from-blue-500 to-blue-700",
      match: ["systematic", "rigorous"],
    },
    {
      name: "The Visionary Architect",
      tagline: "Designing the future of knowledge",
      color: "from-blue-700 to-blue-900",
      match: ["leadership", "vision"],
    },
  ]

  // Simple matching logic based on role and researcher field
  const userRole = userData?.role?.toLowerCase() || ""
  const researcherField = researcher?.field?.toLowerCase() || ""

  if (userRole.includes("student") || userRole.includes("undergraduate")) {
    return personas[0]
  } else if (userRole.includes("graduate") || userRole.includes("phd")) {
    return personas[1]
  } else if (userRole.includes("professor") || userRole.includes("researcher")) {
    return personas[2]
  } else {
    // Random selection from remaining personas
    return personas[Math.floor(Math.random() * personas.length)]
  }
}

export default function PersonaAssignment({ userData, favoriteResearcher, onComplete }: PersonaAssignmentProps) {
  const [persona, setPersona] = useState<any>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Validate required props
    if (!userData) {
      setError("User data is missing")
      setIsLoading(false)
      return
    }

    if (!userData.firstName || !userData.lastName) {
      setError("User name information is incomplete")
      setIsLoading(false)
      return
    }

    // Generate persona after validation passes
    const timer = setTimeout(() => {
      try {
        const generatedPersona = generatePersona(userData, favoriteResearcher)
        setPersona(generatedPersona)
        setIsRevealing(true)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to generate research persona")
        setIsLoading(false)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [userData, favoriteResearcher])

  const handleComplete = () => {
    if (persona && !error) {
      onComplete(persona)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Something went wrong</h2>
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-xs text-muted-foreground">Please go back and complete all required steps.</p>
          </div>
          <Button onClick={() => window.history.back()} variant="outline" className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/30 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-32 w-48 h-48 bg-gradient-to-r from-blue-600/20 to-blue-500/5 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-blue-300/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating tech elements */}
        <div className="absolute top-20 left-20 animate-float">
          <div className="w-2 h-2 bg-blue-500/40 rounded-full"></div>
        </div>
        <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-3 h-3 bg-blue-400/30 rounded-full"></div>
        </div>
        <div className="absolute bottom-32 left-1/3 animate-float" style={{ animationDelay: "3s" }}>
          <div className="w-2 h-2 bg-blue-600/35 rounded-full"></div>
        </div>
      </div>

      <div className="w-full max-w-2xl text-center relative z-10 space-y-6">
        {isLoading || !isRevealing ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Crafting Your Research Persona</h2>
              <p className="text-muted-foreground">
                {favoriteResearcher?.name
                  ? `Based on your interests and admiration for ${favoriteResearcher.name}`
                  : userData.interests && userData.interests.length > 0
                    ? "Based on your research interests and profile"
                    : "Based on your profile and research goals"}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -m-6 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/30 via-blue-400/40 to-blue-500/30 rounded-full blur-2xl animate-pulse opacity-80"></div>
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300/20 via-blue-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse opacity-60"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/15 via-blue-500/25 to-blue-600/15 rounded-full blur-xl animate-pulse opacity-90"
                  style={{ animationDelay: "2s" }}
                ></div>
              </div>
              <div className="relative z-10">
                <AriaAssistant
                  state="thinking"
                  message={`Let me analyze your profile${userData.interests && userData.interests.length > 0 ? " and research interests" : ""}${favoriteResearcher?.name ? ` along with your admiration for ${favoriteResearcher.name}` : ""}...`}
                  size="lg"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-1000">
            <div className="flex justify-center">
              <Card className="w-80 h-80 overflow-hidden border-2 border-blue-500/20 backdrop-blur-sm bg-card/80 shadow-lg shadow-blue-500/10 rounded-2xl">
                <div className="h-full flex flex-col">
                  <div className="flex-shrink-0 p-6 text-center">
                    {userData.profilePicture && (
                      <img
                        src={userData.profilePicture || "/placeholder.svg"}
                        alt={`${userData.firstName}'s profile`}
                        className="w-16 h-16 rounded-full border-3 border-blue-500/30 object-cover mx-auto mb-3 shadow-lg"
                      />
                    )}
                    <h1 className="text-xl font-bold text-foreground">{userData.firstName}</h1>
                    <p className="text-muted-foreground text-sm">Research Profile</p>
                  </div>

                  <div
                    className={`flex-1 bg-gradient-to-br ${persona?.color} relative flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative text-center text-white px-4">
                      <h2 className="text-lg font-bold mb-2">{persona?.name}</h2>
                      <p className="text-white/90 text-sm italic">"{persona?.tagline}"</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 p-4 space-y-2 text-xs">
                    <p className="text-muted-foreground">
                      <strong>Focus:</strong>{" "}
                      {userData.interests && userData.interests.length > 0
                        ? userData.interests.slice(0, 2).join(", ")
                        : "General Research"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Role:</strong> {userData.role || "Researcher"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your persona helps ARIA provide personalized research suggestions, relevant papers, and tailored
                insights that match your research style
                {userData.interests && userData.interests.length > 0 ? " and interests" : ""}.
              </p>

              <Button
                onClick={handleComplete}
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:scale-105 transition-all duration-200"
                disabled={!persona}
              >
                Enter Your Research Hub
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 -m-8">
                <div className="w-full h-full bg-gradient-to-r from-blue-500/25 via-blue-400/35 to-blue-500/25 rounded-full blur-2xl animate-pulse opacity-70"></div>
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-300/20 via-blue-200/30 to-blue-300/20 rounded-full blur-3xl animate-pulse opacity-50"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/15 via-blue-500/25 to-blue-600/15 rounded-full blur-xl animate-pulse opacity-90"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-blue-300/20 to-blue-400/10 rounded-full blur-4xl animate-pulse opacity-30"
                  style={{ animationDelay: "3s" }}
                ></div>
              </div>
              <div className="relative z-10">
                <AriaAssistant
                  state="excited"
                  message={`Welcome to RACE AI, ${userData.firstName}! Your personalized research environment is ready.`}
                  size="md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
