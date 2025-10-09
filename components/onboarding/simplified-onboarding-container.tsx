"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import EmailVerification from "./email-verification"
import SimplifiedOnboarding from "./simplified-onboarding"

interface UserData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
  organization?: string
  interests: string[]
  verificationCode?: string
  profilePicture?: string
  profileType?: "upload" | "avatar"
}

interface SimplifiedOnboardingContainerProps {
  initialUserData?: Partial<UserData>
  onComplete: (userData: UserData) => void
}

export default function SimplifiedOnboardingContainer({
  initialUserData = {},
  onComplete
}: SimplifiedOnboardingContainerProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1) // Start with email verification
  const [userData, setUserData] = useState<Partial<UserData>>(initialUserData)

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const handleComplete = (profileData: Partial<UserData>) => {
    const completeUserData = {
      ...userData,
      ...profileData,
    } as UserData

    onComplete(completeUserData)
  }

  return (
    <div className="min-h-screen">
      {/* Step 1: Email Verification */}
      {currentStep === 1 && (
        <EmailVerification
          email={userData.email || ""}
          onNext={(code) => {
            updateUserData({ verificationCode: code })
            nextStep()
          }}
          onBack={() => router.push("/")}
        />
      )}

      {/* Step 2: Profile Completion */}
      {currentStep === 2 && (
        <SimplifiedOnboarding
          onComplete={handleComplete}
          onBack={prevStep}
          initialData={userData}
        />
      )}
    </div>
  )
}