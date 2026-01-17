"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, X, User, Camera, Sparkles, ChevronRight, Terminal } from "lucide-react"
import ModernLogo from "@/components/modern-logo"
import { motion, AnimatePresence } from "framer-motion"

interface UserData {
  firstName: string
  lastName: string
  role: string
  organization?: string
  interests: string[]
  profilePicture?: string
  profileType?: "upload" | "avatar"
}

interface SimplifiedOnboardingProps {
  onComplete: (userData: UserData) => void
  onBack: () => void
  initialData?: Partial<UserData>
}

const RESEARCH_INTERESTS = [
  "Machine Learning", "Artificial Intelligence", "Computer Vision",
  "Natural Language Processing", "Robotics", "Data Science",
  "Quantum Computing", "Biotechnology", "Neuroscience",
  "Physics", "Chemistry", "Biology", "Medicine",
  "Environmental Science", "Materials Science", "Engineering"
]

export default function SimplifiedOnboarding({ onComplete, onBack, initialData = {} }: SimplifiedOnboardingProps) {
  const [formData, setFormData] = useState<UserData>({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    role: initialData.role || "",
    organization: initialData.organization || "",
    interests: initialData.interests || [],
    profilePicture: initialData.profilePicture || "",
    profileType: initialData.profileType || "upload"
  })

  const [interestInput, setInterestInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulation of "Jarvis" typing effect
  const [headerText, setHeaderText] = useState("")
  const fullText = "Identity Verification & Profile Calibration"

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setHeaderText(fullText.slice(0, i))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const addInterest = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({ ...prev, interests: [...prev.interests, interest] }))
    }
    setInterestInput("")
  }

  const removeInterest = (interest: string) => {
    setFormData(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, profilePicture: e.target?.result as string }))
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Required"
    if (!formData.lastName.trim()) newErrors.lastName = "Required"
    if (!formData.role.trim()) newErrors.role = "Required"
    if (formData.interests.length === 0) newErrors.interests = "Select at least one"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="relative w-full">
      {/* Glass Panel Main Container */}
      <div className="bg-background/40 dark:bg-black/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="bg-white/5 border-b border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                <Terminal size={12} />
                <span>Secure Connection</span>
            </div>
        </div>

        <div className="p-8 lg:p-10 space-y-8">
            {/* Jarvis Greeting */}
            <div className="flex gap-6 items-start">
                 {/* Jarvis Avatar */}
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-400 p-[2px] shrink-0 shadow-lg shadow-primary/20">
                     <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                         <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                     </div>
                 </div>

                 {/* Dialogue Bubble */}
                 <div className="space-y-2 flex-1">
                     <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm p-4 inline-block">
                        <p className="text-sm font-mono text-primary mb-1">JARVIS // AI ASSISTANT</p>
                        <h2 className="text-xl font-medium text-foreground min-h-[1.75rem]">
                            {headerText}<span className="animate-pulse">_</span>
                        </h2>
                     </div>
                     <p className="text-sm text-muted-foreground pl-1">
                        Please provide your credentials to authorize full system access.
                     </p>
                 </div>
            </div>

            {/* Form Fields - Styled as "Data Modules" */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="space-y-6"
            >
                {/* Module 1: Identity */}
                <div className="space-y-4">
                    <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 after:h-[1px] after:flex-1 after:bg-border">
                        <User size={12} /> Identity Verification
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">First Designation</Label>
                            <Input 
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className={`bg-background/20 border-white/10 focus:border-primary/50 transition-all ${errors.firstName && 'border-red-500'}`}
                                placeholder="First Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Family Designation</Label>
                            <Input 
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className={`bg-background/20 border-white/10 focus:border-primary/50 transition-all ${errors.lastName && 'border-red-500'}`}
                                placeholder="Last Name"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Role</Label>
                            <Input 
                                value={formData.role}
                                onChange={(e) => handleInputChange("role", e.target.value)}
                                className="bg-background/20 border-white/10"
                                placeholder="e.g. Lead Researcher"
                            />
                        </div>
                        <div className="space-y-1">
                             <Label className="text-xs">Affiliation</Label>
                             <Input 
                                value={formData.organization}
                                onChange={(e) => handleInputChange("organization", e.target.value)}
                                className="bg-background/20 border-white/10"
                                placeholder="Institution"
                            />
                        </div>
                    </div>
                </div>

                 {/* Module 2: Image Analysis */}
                <div className="flex items-center gap-4 p-4 border border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                     <div className="relative">
                         {formData.profilePicture ? (
                             <img src={formData.profilePicture} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50" />
                         ) : (
                             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                 <Camera size={20} className="text-primary" />
                             </div>
                         )}
                     </div>
                     <div className="flex-1">
                         <p className="text-sm font-medium">Biometric Uplink</p>
                         <p className="text-xs text-muted-foreground">Upload profile visualization (Max 5MB)</p>
                     </div>
                     <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="border-primary/30 hover:bg-primary/10">
                        {isUploading ? "Scanning..." : "Upload"}
                     </Button>
                     <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>


                {/* Module 3: Research Parameters */}
                <div className="space-y-4">
                     <h3 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 after:h-[1px] after:flex-1 after:bg-border">
                        <div className="w-2 h-2 bg-secondary rounded-full" /> Calibration Vectors
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                        {RESEARCH_INTERESTS.slice(0, 10).map((interest) => (
                          <Badge 
                            key={interest}
                            onClick={() => formData.interests.includes(interest) ? removeInterest(interest) : addInterest(interest)}
                            variant={formData.interests.includes(interest) ? "default" : "outline"}
                            className={`cursor-pointer transition-all hover:scale-105 ${
                                formData.interests.includes(interest) 
                                ? "bg-primary text-primary-foreground hover:bg-primary/80" 
                                : "hover:text-primary hover:border-primary/50"
                            }`}
                          >
                            {interest}
                          </Badge>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Action Footer */}
             <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
                      Return
                  </Button>
                  <Button 
                      onClick={() => { if(validateForm()) onComplete(formData) }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
                  >
                      Complete Protocol <ChevronRight size={16} className="ml-2" />
                  </Button>
             </div>
        </div>
      </div>
    </div>
  )
}