"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import JarvisAssistant, { useJarvisConversation } from "@/components/jarvis-assistant"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export default function DemoPage() {
  const router = useRouter()
  const { currentState, currentMessage, speak, idle } = useJarvisConversation()
  const [chatInput, setChatInput] = React.useState("")
  const [chatHistory, setChatHistory] = React.useState<Array<{ type: "user" | "jarvis"; message: string }>>([])
  const [interactionCount, setInteractionCount] = React.useState(0)
  const [showLimitPrompt, setShowLimitPrompt] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      speak(
        "Welcome to RACE AI! This is a demo of what I can do. Try asking me about research, papers, or anything academic. I'll show you the basics, but for the full experience with personalized recommendations and unlimited access, you'll want to sign up!",
      )
    }, 1000)
  }, [speak])

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newCount = interactionCount + 1
    setInteractionCount(newCount)

    // Add user message to history
    setChatHistory((prev) => [...prev, { type: "user", message: chatInput }])

    // Show limitation after 3 interactions
    if (newCount >= 3) {
      setTimeout(() => {
        speak(
          "I'd love to give you more detailed help, but I'm limited in demo mode! With a full account, I can access real research databases, provide personalized recommendations, and remember our conversation history. Ready to unlock the full experience?",
        )
        setShowLimitPrompt(true)
      }, 1000)
      setChatInput("")
      return
    }

    // Contextual demo responses based on input
    let response = ""
    const input = chatInput.toLowerCase()

    if (input.includes("paper") || input.includes("research") || input.includes("study")) {
      response =
        "Great question about research! In the full version, I'd search through millions of academic papers and give you personalized recommendations. For now, I can tell you that I'd help you find relevant papers, summarize key findings, and track your reading progress."
    } else if (input.includes("write") || input.includes("draft") || input.includes("essay")) {
      response =
        "I'd love to help with your writing! With full access, I can provide detailed outlines, suggest improvements, check citations, and even help with academic formatting. The demo gives you just a taste of these capabilities."
    } else if (input.includes("collaborate") || input.includes("team") || input.includes("share")) {
      response =
        "Collaboration is one of our strongest features! In the full version, you can share research with teammates, get peer reviews, and work together in real-time. Sign up to experience seamless academic collaboration."
    } else if (input.includes("data") || input.includes("analysis") || input.includes("statistics")) {
      response =
        "Data analysis is where I really shine! With full access, I can help you interpret research data, suggest statistical methods, and even generate visualizations. This demo only scratches the surface of what's possible."
    } else {
      const responses = [
        "That's fascinating! In the full version, I'd provide detailed insights backed by the latest research and tailored to your specific field of study.",
        "Excellent question! With unlimited access, I can dive deep into this topic, cross-reference multiple sources, and give you comprehensive analysis.",
        "I'd love to explore this further with you! Full members get personalized research plans, progress tracking, and unlimited AI assistance.",
        "This is exactly the kind of question I excel at! Sign up to get detailed, personalized answers with citations and follow-up suggestions.",
      ]
      response = responses[Math.floor(Math.random() * responses.length)]
    }

    setTimeout(() => {
      speak(response)
      setChatHistory((prev) => [...prev, { type: "jarvis", message: response }])
    }, 1000)

    setChatInput("")
  }

  const handleSignUp = () => {
    router.push("/?onboarding=true")
  }

  const handleContinueDemo = () => {
    setShowLimitPrompt(false)
    setInteractionCount(0) // Reset counter for continued demo
    speak("Alright! I'll keep showing you what I can do. Remember, this is just a preview of the full experience.")
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-400/30 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-16 w-24 h-24 border border-blue-300/30 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-blue-400/30 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <div>
            <h1 className="text-2xl font-bold text-white">RACE AI Demo</h1>
            <p className="text-blue-200 text-sm">
              Experience AI-assisted research • {3 - interactionCount} demo interactions remaining
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={handleSignUp}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-full"
            >
              Sign Up for Full Access
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* JARVIS Assistant */}
          <JarvisAssistant size={120} state={currentState} message={currentMessage} onMessageComplete={() => idle()} />

          {/* Demo Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-4xl w-full mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-white font-semibold mb-2">Smart Search</h3>
              <p className="text-blue-200 text-sm">Find relevant papers instantly with AI-powered search</p>
              <div className="mt-3 text-xs text-blue-400">Demo: Basic search only</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-white font-semibold mb-2">Research Analytics</h3>
              <p className="text-blue-200 text-sm">Track progress and get insights on your research</p>
              <div className="mt-3 text-xs text-blue-400">Full version: Advanced analytics</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-white font-semibold mb-2">Collaboration</h3>
              <p className="text-blue-200 text-sm">Work together with peers and mentors seamlessly</p>
              <div className="mt-3 text-xs text-blue-400">Full version: Real-time collaboration</div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-4 max-h-60 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="text-center">
                  <p className="text-blue-200 mb-4">Try asking JARVIS something about research!</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <button
                      onClick={() => setChatInput("Find papers on machine learning")}
                      className="text-left p-2 rounded hover:bg-white/10 text-blue-300 hover:text-white transition-colors"
                    >
                      "Find papers on machine learning"
                    </button>
                    <button
                      onClick={() => setChatInput("Help me write a literature review")}
                      className="text-left p-2 rounded hover:bg-white/10 text-blue-300 hover:text-white transition-colors"
                    >
                      "Help me write a literature review"
                    </button>
                    <button
                      onClick={() => setChatInput("Analyze this research data")}
                      className="text-left p-2 rounded hover:bg-white/10 text-blue-300 hover:text-white transition-colors"
                    >
                      "Analyze this research data"
                    </button>
                    <button
                      onClick={() => setChatInput("Collaborate with my team")}
                      className="text-left p-2 rounded hover:bg-white/10 text-blue-300 hover:text-white transition-colors"
                    >
                      "Collaborate with my team"
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={cn("flex", chat.type === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-xs px-4 py-2 rounded-lg text-sm",
                          chat.type === "user" ? "bg-blue-600 text-white" : "bg-white/10 text-blue-200",
                        )}
                      >
                        {chat.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Limitation Prompt */}
            {showLimitPrompt && (
              <div className="bg-white/10 backdrop-blur-xl border border-blue-500/50 rounded-xl p-6 mb-4">
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-2">Ready for the Full Experience?</h3>
                  <p className="text-blue-200 text-sm mb-4">
                    You've reached the demo limit. Sign up to get unlimited access, personalized recommendations, and
                    advanced research tools.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleSignUp} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Sign Up Now
                    </Button>
                    <Button
                      onClick={handleContinueDemo}
                      className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    >
                      Continue Demo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  interactionCount >= 3
                    ? "Sign up for unlimited conversations..."
                    : "Ask JARVIS about research, papers, or academic topics..."
                }
                className="bg-white/10 border-white/20 text-white placeholder-blue-300 flex-1"
                disabled={interactionCount >= 3 && !showLimitPrompt}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={interactionCount >= 3 && !showLimitPrompt}
              >
                Ask
              </Button>
            </form>
          </div>

          {/* Progressive Enhancement Prompts */}
          <div className="mt-8 text-center max-w-2xl">
            {interactionCount === 0 && (
              <p className="text-blue-300 text-sm">
                This demo shows basic functionality. Sign up to unlock personalized research assistance!
              </p>
            )}
            {interactionCount === 1 && (
              <p className="text-blue-300 text-sm">
                Enjoying the demo? Full members get unlimited conversations and advanced research tools.
              </p>
            )}
            {interactionCount === 2 && (
              <p className="text-blue-300 text-sm">
                One more demo interaction left. Sign up now to continue with unlimited access!
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-300 mt-4">
              <span className={cn(interactionCount >= 1 ? "line-through opacity-50" : "")}>✓ Basic AI responses</span>
              <span className="text-blue-400">✓ Full research database access</span>
              <span className="text-blue-400">✓ Personalized recommendations</span>
              <span className="text-blue-400">✓ Advanced analytics</span>
              <span className="text-blue-400">✓ Unlimited conversations</span>
            </div>

            <Button
              onClick={handleSignUp}
              className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-medium rounded-full transform hover:scale-105 transition-all duration-300"
            >
              Get Started with RACE AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
