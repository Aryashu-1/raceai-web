"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AriaAssistant } from "@/components/aria-assistant"
import { Eye, EyeOff, Mail, Smartphone, CheckCircle } from "lucide-react"

interface MultiAuthFormProps {
  onComplete: (userData: any) => void
}

export function MultiAuthForm({ onComplete }: MultiAuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState<"password" | "google" | "otp">("password")
  const [otpMethod, setOtpMethod] = useState<"email" | "mobile">("mobile")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  })
  const [step, setStep] = useState<"auth" | "verify">("auth")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [ariaMessage, setAriaMessage] = useState(
    "Welcome! I'm ARIA, your research assistant. Let's get you started with the best sign-in method for you.",
  )

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo-client-id",
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: false,
        })
      }
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleGoogleCallback = (response: any) => {
    try {
      // In a real app, you'd verify the JWT token on your backend
      const payload = JSON.parse(atob(response.credential.split(".")[1]))
      setAriaMessage("Perfect! Google sign-in successful. Welcome to RACE AI!")
      setTimeout(() => {
        onComplete({
          method: "google",
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        })
      }, 1000)
    } catch (error) {
      console.error("Google sign-in error:", error)
      setAriaMessage("Oops! There was an issue with Google sign-in. Let's try another method.")
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setAriaMessage("Great choice! Email sign-in gives you the most secure access to all features.")

    setTimeout(() => {
      setLoading(false)
      onComplete({ method: "email", email: formData.email })
    }, 1500)
  }

  const handleGoogleAuth = () => {
    setAriaMessage("Google sign-in is super convenient! You'll be up and running in seconds.")

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to one-tap if prompt fails
          window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
          })
        }
      })
    } else {
      // Demo fallback with better UX
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        onComplete({ method: "google", email: "demo@gmail.com", name: "Demo User" })
      }, 2000)
    }
  }

  const handleOTPAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (step === "auth") {
      const contactMethod = otpMethod === "email" ? "email" : "phone"
      const contactValue = otpMethod === "email" ? formData.email : formData.phone

      setAriaMessage(`Sending verification code to your ${contactMethod}...`)

      setTimeout(() => {
        setStep("verify")
        setOtpSent(true)
        setLoading(false)
        setAriaMessage(
          `Perfect! I've sent a 6-digit code to ${contactValue}. Check your ${contactMethod === "email" ? "inbox" : "messages"}.`,
        )
      }, 2000)
    } else {
      setAriaMessage("Verifying your code...")

      setTimeout(() => {
        if (formData.otp.length === 6) {
          setLoading(false)
          setAriaMessage("Excellent! Code verified successfully. Welcome to RACE AI!")
          setTimeout(() => {
            onComplete({
              method: "otp",
              [otpMethod === "email" ? "email" : "phone"]: otpMethod === "email" ? formData.email : formData.phone,
            })
          }, 1000)
        } else {
          setLoading(false)
          setAriaMessage("Hmm, that code doesn't look right. Please check and try again.")
        }
      }, 1500)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, "")
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* ARIA Assistant */}
      <div className="absolute top-8 left-8 z-10">
        <AriaAssistant message={ariaMessage} state={loading ? "thinking" : "speaking"} size="sm" showMessage={true} />
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-white">Get. Set. Race.</CardTitle>
          <CardDescription className="text-blue-100">Choose your preferred way to access RACE AI</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="password" className="data-[state=active]:bg-blue-500">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </TabsTrigger>
              <TabsTrigger value="google" className="data-[state=active]:bg-blue-500">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </TabsTrigger>
              <TabsTrigger value="otp" className="data-[state=active]:bg-blue-500">
                <Smartphone className="w-4 h-4 mr-1" />
                OTP
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4 mt-6">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 rounded-xl"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your secure password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 pr-10"
                      required
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-blue-200 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#0052CC] to-[#0747A6] hover:from-[#0747A6] hover:to-[#4C9AFF] active:from-[#003d99] active:to-[#003d99] text-white rounded-xl py-3" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In →"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="google" className="space-y-4 mt-6">
              <div className="text-center space-y-4">
                <p className="text-blue-100 text-sm">Sign in with your Google account for instant access</p>
                <div id="google-signin-button">
                  <Button
                    onClick={handleGoogleAuth}
                    className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium py-3 px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent  animate-spin"></div>
                        Connecting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Continue with Google</span>
                      </div>
                    )}
                  </Button>
                </div>

              </div>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4 mt-6">
              {step === "auth" ? (
                <form onSubmit={handleOTPAuth} className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-white text-sm">Choose verification method</Label>
                    <Tabs value={otpMethod} onValueChange={(value) => setOtpMethod(value as any)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/5">
                        <TabsTrigger value="mobile" className="data-[state=active]:bg-blue-500/50">
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobile
                        </TabsTrigger>
                        <TabsTrigger value="email" className="data-[state=active]:bg-blue-500/50">
                          <Mail className="w-3 h-3 mr-1" />
                          Email
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={otpMethod} className="text-white">
                      {otpMethod === "email" ? "Email Address" : "Phone Number"}
                    </Label>
                    <Input
                      id={otpMethod}
                      type={otpMethod === "email" ? "email" : "tel"}
                      placeholder={otpMethod === "email" ? "your.email@university.edu" : "+1 (555) 123-4567"}
                      value={otpMethod === "email" ? formData.email : formData.phone}
                      onChange={(e) => {
                        const value = otpMethod === "email" ? e.target.value : formatPhoneNumber(e.target.value)
                        setFormData((prev) => ({
                          ...prev,
                          [otpMethod === "email" ? "email" : "phone"]: value,
                        }))
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 rounded-xl"
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-[#0052CC] to-[#0747A6] hover:from-[#0747A6] hover:to-[#4C9AFF] active:from-[#003d99] active:to-[#003d99] text-white rounded-xl py-3" disabled={loading}>
                    {loading ? "Sending Code..." : "Send Code →"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOTPAuth} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="otp" className="text-white">
                        Verification Code
                      </Label>
                      {otpSent && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                    <p className="text-xs text-blue-200 mb-2">
                      Code sent to {otpMethod === "email" ? formData.email : formData.phone}
                    </p>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={formData.otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setFormData((prev) => ({ ...prev, otp: value }))
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#0052CC] to-[#0747A6] hover:from-[#0747A6] hover:to-[#4C9AFF] active:from-[#003d99] active:to-[#003d99] text-white rounded-xl py-3"
                    disabled={loading || formData.otp.length !== 6}
                  >
                    {loading ? "Verifying..." : "Verify & Continue →"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-blue-200 hover:text-white"
                    onClick={() => {
                      setStep("auth")
                      setOtpSent(false)
                      setFormData((prev) => ({ ...prev, otp: "" }))
                    }}
                    disabled={loading}
                  >
                    ← Back to {otpMethod} verification
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <p className="text-blue-200 text-sm">
              Don't have an account?{" "}
              <button className="text-white hover:underline font-medium">Create a new account</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, config: any) => void
        }
      }
    }
  }
}
