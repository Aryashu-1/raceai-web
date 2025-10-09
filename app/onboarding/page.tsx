"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SimplifiedOnboardingContainer from "@/components/onboarding/simplified-onboarding-container"
import GeometricBackground from "@/components/geometric-background"

export default function OnboardingPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem("race_ai_user")
    if (!storedUser) {
      router.push("/")
      return
    }

    const user = JSON.parse(storedUser)
    if (!user.authenticated) {
      router.push("/")
      return
    }

    setUserData(user)
  }, [router])

  const handleOnboardingComplete = (completedUserData: any) => {
    // Update user data with onboarding completion
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    }
    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser))

    // Redirect to JARVIS chat
    router.push("/jarvis")
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/50 dark:to-blue-900/30 relative">
        <GeometricBackground variant="tesseract" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="card-default px-6 py-3">
            <p className="text-foreground font-medium">Loading onboarding...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/50 dark:to-blue-900/30 relative">
      <GeometricBackground variant="tesseract" />
      <SimplifiedOnboardingContainer initialUserData={userData} onComplete={handleOnboardingComplete} />
    </div>
  )
}
