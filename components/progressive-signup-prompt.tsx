"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import ARIAAssistant, { useARIAConversation } from "@/components/aria-assistant"

interface ProgressiveSignupPromptProps {
  trigger: "interaction_limit" | "feature_request" | "time_based"
  context?: string
  onDismiss?: () => void
}

export default function ProgressiveSignupPrompt({ trigger, context, onDismiss }: ProgressiveSignupPromptProps) {
  const router = useRouter()
  const { currentState, currentMessage, speak, idle } = useARIAConversation()

  React.useEffect(() => {
    let message = ""
    switch (trigger) {
      case "interaction_limit":
        message =
          "I can see you're really interested in what I can do! To give you the personalized, detailed help you deserve, I'll need you to sign up. It only takes 60 seconds, and then I can access your research profile and provide much better assistance."
        break
      case "feature_request":
        message = `You're asking about ${context}, which is one of my advanced features! I'd love to show you the full capability, but I'll need access to your research profile first. Ready to unlock the complete experience?`
        break
      case "time_based":
        message =
          "You've been exploring for a while now! I think you'd really benefit from the full RACE AI experience. With a quick signup, I can start learning your research interests and provide much more targeted help."
        break
    }
    speak(message)
  }, [trigger, context, speak])

  const handleSignUp = () => {
    router.push("/?onboarding=true")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="aria-card max-w-md w-full p-6 text-center">
        <ARIAAssistant size={80} state={currentState} message={currentMessage} onMessageComplete={() => idle()} />

        <div className="mt-6">
          <h3 className="text-foreground font-semibold mb-2">Ready to Unlock Full Access?</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Sign up now to get personalized research assistance, unlimited conversations, and access to advanced tools.
          </p>

          <div className="flex gap-2 justify-center">
            <Button onClick={handleSignUp} className="primary-button">
              Sign Up with ARIA
            </Button>
            {onDismiss && (
              <Button onClick={onDismiss} variant="outline" className="secondary-button bg-transparent">
                Maybe Later
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
