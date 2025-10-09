"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ModernLogo from "@/components/modern-logo"
import { MessageCircle, Sparkles } from "lucide-react"

interface EmailVerificationProps {
  email: string
  onNext: (code: string) => void
  onBack: () => void
}

export default function EmailVerification({ email, onNext, onBack }: EmailVerificationProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [resendCountdown, setResendCountdown] = useState(60)
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const validateCode = (codeString: string) => {
    if (codeString.length !== 6) {
      setError("Please enter all 6 digits")
      return false
    }
    if (!/^\d{6}$/.test(codeString)) {
      setError("Code must contain only numbers")
      return false
    }
    return true
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError("")

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when complete
    if (newCode.every((digit) => digit) && newCode.join("").length === 6) {
      const codeString = newCode.join("")
      if (validateCode(codeString)) {
        setIsVerifying(true)
        setTimeout(() => {
          setIsVerifying(false)
          onNext(codeString)
        }, 500)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleManualVerify = () => {
    const codeString = code.join("")
    if (validateCode(codeString)) {
      setIsVerifying(true)
      setTimeout(() => {
        setIsVerifying(false)
        onNext(codeString)
      }, 500)
    }
  }

  const handleResend = () => {
    setResendCountdown(60)
    setError("")
    setCode(["", "", "", "", "", ""])
    // Focus first input after resend
    setTimeout(() => {
      const firstInput = document.getElementById("code-0")
      firstInput?.focus()
    }, 100)
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-md text-center">
          <p className="text-red-500 mb-4">Email address is required for verification</p>
          <Button onClick={onBack} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        {/* JARVIS Welcome Chat */}
        <div className="card-default p-6 book-page page-flip-enter">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">JARVIS</h3>
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Race AI! I'm JARVIS, your AI research assistant. I'm here to help you discover insights,
                analyze papers, and accelerate your research journey. Let's verify your email to get started!
              </p>
            </div>
          </div>
        </div>

        {/* Email Verification Card */}
        <div className="card-default p-8 book-page page-flip-enter">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ModernLogo size={48} showText={false} />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Verify Email</h1>
            <p className="text-muted-foreground">
              We sent a 6-digit code to
              <br />
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-14 text-center text-lg font-bold ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {error && (
              <div className="text-center">
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </p>
              </div>
            )}

            <div className="text-center">
              {resendCountdown > 0 ? (
                <p className="text-sm text-muted-foreground">Resend code in {resendCountdown}s</p>
              ) : (
                <button onClick={handleResend} className="btn-ghost text-sm" disabled={isVerifying}>
                  Resend Code
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button onClick={onBack} className="flex-1 btn-secondary" disabled={isVerifying}>
                Back
              </button>
              <button
                onClick={handleManualVerify}
                disabled={code.some((digit) => !digit) || isVerifying}
                className="flex-1 btn-primary"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
