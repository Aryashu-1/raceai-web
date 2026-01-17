"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Sparkles, Terminal, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

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
  const [targetCode, setTargetCode] = useState("")
  
  // Typing effect state
  const [headerText, setHeaderText] = useState("")
  const fullText = "Security Protocol: Identity Verification"

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setHeaderText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    if (email) sendVerificationCode(email);
  }, [email])

  const sendVerificationCode = async (toEmail: string) => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setTargetCode(newCode);
      try {
          // Dev only simulation
          console.log("Code sent (dev mode):", newCode);
      } catch (err) {
          setError("Failed to send verification code.");
      }
  }

  const validateCode = (codeString: string) => {
    if (codeString.length !== 6) {
      setError("Please enter all 6 digits")
      return false
    }
    if (codeString !== targetCode) {
        setError("Invalid code. Please try again.")
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

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

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
    if (email) sendVerificationCode(email)
    setTimeout(() => document.getElementById("code-0")?.focus(), 100)
  }

  return (
    <div className="relative w-full">
      {/* Glass Panel Container */}
      <div className="bg-background/40 dark:bg-black/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden min-h-[500px]">
        
         {/* Status Bar */}
        <div className="bg-white/5 border-b border-white/5 p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                <ShieldCheck size={12} />
                <span>Verification Pending</span>
            </div>
        </div>

        <div className="p-8 lg:p-10 space-y-8">
            {/* Jarvis Dialogue */}
            <div className="flex gap-6 items-start">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 p-[2px] shrink-0 shadow-lg shadow-primary/20">
                     <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                         <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                     </div>
                 </div>

                 <div className="space-y-2 flex-1">
                     <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm p-4 inline-block">
                        <p className="text-sm font-mono text-primary mb-1">JARVIS // SECURITY GATE</p>
                        <h2 className="text-xl font-medium text-foreground min-h-[1.75rem]">
                            {headerText}<span className="animate-pulse">_</span>
                        </h2>
                     </div>
                     <p className="text-sm text-muted-foreground pl-1">
                        A 6-digit confirmation key has been transmitted to <span className="text-foreground font-mono bg-white/5 px-1 rounded">{email || "your device"}</span>.
                     </p>
                 </div>
            </div>

            {/* Input Module */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="space-y-6"
            >
                <div>
                   <label className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Input Access Key</label>
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
                        className={`w-12 h-14 text-center text-xl font-mono bg-background/50 border-white/10 focus:border-primary focus:ring-primary/20 transition-all ${error ? "border-red-500 bg-red-500/5 text-red-500" : ""}`}
                        disabled={isVerifying}
                        />
                    ))}
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                        <p className="text-xs text-red-400 font-mono flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </p>
                    </motion.div>
                )}
            </motion.div>
            
            <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                 <div className="flex gap-4 w-full">
                    <Button variant="ghost" onClick={onBack} className="flex-1 text-muted-foreground hover:text-foreground">
                        Abort
                    </Button>
                    <Button 
                        onClick={handleManualVerify}
                        disabled={code.some((digit) => !digit) || isVerifying}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        {isVerifying ? "Authenticating..." : "Confirm Access"}
                    </Button>
                 </div>
                 
                 {resendCountdown > 0 ? (
                    <p className="text-xs text-muted-foreground font-mono">Resend uplink available in {resendCountdown}s</p>
                 ) : (
                    <button onClick={handleResend} className="text-xs text-primary hover:underline font-mono" disabled={isVerifying}>
                        Retransmit Signal
                    </button>
                 )}
            </div>
        </div>
      </div>
    </div>
  )
}
