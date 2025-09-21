"use client"

import { useState } from "react"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ARIAAssistant, { useARIAConversation } from "@/components/aria-assistant"
import { cn } from "@/lib/utils"

interface OnboardingStep3Props {
  userData: { email: string; password: string; role: string; level: string }
  onComplete: () => void
  className?: string
}

const getPersonalizedContent = (role: string, level: string) => {
  const isPhD = level === "phd"
  const isUndergrad = level === "undergrad"

  if (isPhD) {
    return {
      welcome:
        "Welcome to your research command center! I've customized everything for PhD-level work. Here's your personalized toolkit:",
      tools: [
        {
          icon: "📚",
          title: "Smart Library",
          description: "I found 1,200 papers in your field!",
          action: "Browse Papers",
        },
        {
          icon: "🔬",
          title: "Method Tracker",
          description: "Track & analyze research methods",
          action: "Start Tracking",
        },
        {
          icon: "📊",
          title: "Thesis Progress",
          description: "Plan your chapters here",
          action: "Plan Thesis",
        },
      ],
      suggestions: [
        "Find papers on quantum computing",
        "Explain methodology in simple terms",
        "Help plan my literature review",
      ],
    }
  } else if (isUndergrad) {
    return {
      welcome:
        "Hey! I've set up the perfect study space for you. Everything's designed to help you ace your coursework and research!",
      tools: [
        {
          icon: "📝",
          title: "Paper Helper",
          description: "I'll explain any paper!",
          action: "Get Help",
        },
        {
          icon: "🎯",
          title: "Course Tracker",
          description: "Upload your syllabus here",
          action: "Add Courses",
        },
        {
          icon: "👥",
          title: "Study Groups",
          description: "Find study buddies here",
          action: "Join Groups",
        },
      ],
      suggestions: [
        "Explain this paper in simple terms",
        "Help me start my research project",
        "Find papers for my assignment",
      ],
    }
  } else {
    return {
      welcome:
        "Perfect! I've created your personalized research environment. Here's what I've prepared based on your profile:",
      tools: [
        {
          icon: "🔍",
          title: "Research Hub",
          description: "Discover relevant papers",
          action: "Start Research",
        },
        {
          icon: "📈",
          title: "Progress Tracker",
          description: "Monitor your research goals",
          action: "Set Goals",
        },
        {
          icon: "🤝",
          title: "Collaboration",
          description: "Connect with peers",
          action: "Find Collaborators",
        },
      ],
      suggestions: [
        "Find recent papers in my field",
        "Help organize my research notes",
        "Suggest collaboration opportunities",
      ],
    }
  }
}

export default function OnboardingStep3({ userData, onComplete, className }: OnboardingStep3Props) {
  const { currentState, currentMessage, speak, celebrate, idle } = useARIAConversation()
  const [chatInput, setChatInput] = useState("")

  const content = getPersonalizedContent(userData.role, userData.level)

  React.useEffect(() => {
    setTimeout(() => {
      celebrate(content.welcome)
    }, 500)
  }, [content.welcome, celebrate])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    // Simulate ARIA response
    speak(
      `Great question! Let me help you with "${chatInput}". This is just a demo - in the full version, I'd provide detailed assistance with your research needs.`,
    )
    setChatInput("")
  }

  const handleStartExploring = () => {
    speak("Fantastic! Taking you to your research dashboard now!")
    setTimeout(() => {
      // Store user session with onboarded flag
      localStorage.setItem(
        "race_ai_user",
        JSON.stringify({
          email: userData.email,
          name: userData.email.split("@")[0],
          role: userData.role,
          level: userData.level,
          authenticated: true,
          onboarded: true,
        }),
      )
      window.location.href = "/jarvis"
    }, 2000)
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center relative overflow-hidden py-8", className)}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D1D1D] via-[#1D1D1D] to-[#2A2A2A]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-[#246CD8]/30 rounded-full animate-pulse" />
          <div className="absolute bottom-20 right-20 w-16 h-16 border border-[#0052CC]/30 rounded-full animate-pulse" />
          <div className="absolute top-1/2 right-10 w-12 h-12 border border-[#246CD8]/30 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        {/* ARIA Assistant - Celebrating */}
        <div className="flex justify-center mb-8">
          <ARIAAssistant size={100} state={currentState} message={currentMessage} onMessageComplete={() => idle()} />
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Personalized Tools */}
          <div className="mb-8">
            <h2 className="text-white text-2xl font-bold text-center mb-6">
              🎯 Your{" "}
              {userData.level === "phd"
                ? "Research Command Center"
                : userData.level === "undergrad"
                  ? "Study Command Center"
                  : "Research Hub"}
              :
            </h2>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {content.tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="text-3xl mb-3">{tool.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                  <Button size="sm" className="bg-[#246CD8] hover:bg-[#0052CC] text-white">
                    {tool.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Try ARIA Section */}
          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <h3 className="text-white text-lg font-medium mb-4">💬 Try asking me:</h3>
            <div className="grid gap-2 mb-4">
              {content.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setChatInput(suggestion)}
                  className="text-left text-gray-300 hover:text-white text-sm p-2 rounded hover:bg-white/10 transition-colors"
                >
                  • "{suggestion}"
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask ARIA anything about research..."
                className="bg-[#2E2E1E] border-gray-600 text-white focus:border-[#246CD8] flex-1"
              />
              <Button type="submit" className="bg-[#246CD8] hover:bg-[#0052CC] text-white">
                Ask
              </Button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleStartExploring}
              className="bg-gradient-to-r from-[#246CD8] to-[#0052CC] hover:from-[#0052CC] hover:to-[#246CD8] text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start Exploring
            </Button>

            <Button
              variant="outline"
              className="border-[#246CD8] text-[#246CD8] hover:bg-[#246CD8] hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300 bg-transparent"
            >
              ⚙️ Customize More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
