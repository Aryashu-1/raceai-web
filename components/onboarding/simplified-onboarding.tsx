"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, User, Camera } from "lucide-react"
import ModernLogo from "@/components/modern-logo"

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
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Data Science",
  "Quantum Computing",
  "Biotechnology",
  "Neuroscience",
  "Physics",
  "Chemistry",
  "Biology",
  "Medicine",
  "Environmental Science",
  "Materials Science",
  "Engineering",
  "Mathematics",
  "Statistics",
  "Psychology",
  "Sociology",
  "Economics",
  "Political Science",
  "Philosophy",
  "Linguistics",
  "Anthropology",
  "Archaeology",
  "History",
  "Literature",
  "Art History",
  "Music Theory"
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
  const [filteredInterests, setFilteredInterests] = useState<string[]>([])
  const [showInterestDropdown, setShowInterestDropdown] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Parallax mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleInterestInputChange = (value: string) => {
    setInterestInput(value)
    if (value.trim()) {
      const filtered = RESEARCH_INTERESTS.filter(interest =>
        interest.toLowerCase().includes(value.toLowerCase()) &&
        !formData.interests.includes(interest)
      )
      setFilteredInterests(filtered)
      setShowInterestDropdown(filtered.length > 0)
    } else {
      setShowInterestDropdown(false)
    }
  }

  const addInterest = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
    setInterestInput("")
    setShowInterestDropdown(false)
  }

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profilePicture: "Please select an image file" }))
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePicture: "File size must be less than 5MB" }))
      return
    }

    setIsUploading(true)
    try {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setFormData(prev => ({
          ...prev,
          profilePicture: base64,
          profileType: "upload"
        }))
        setIsUploading(false)
        if (errors.profilePicture) {
          setErrors(prev => ({ ...prev, profilePicture: "" }))
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setIsUploading(false)
      setErrors(prev => ({ ...prev, profilePicture: "Failed to upload image" }))
    }
  }

  const removeProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: "",
      profileType: "upload"
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }

    if (formData.interests.length === 0) {
      newErrors.interests = "Please select at least one research interest"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleComplete = () => {
    if (validateForm()) {
      onComplete(formData)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background gradient-bg relative">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
        <div className="floating-particle"></div>
      </div>

      <Card className="w-full max-w-2xl mx-auto card-default book-page page-flip-enter relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <ModernLogo size={48} showText={false} />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Complete Your Profile</CardTitle>
            <p className="text-muted-foreground mt-2">
              Tell us about yourself and your research interests to get started
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Profile Picture (Optional)</Label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {formData.profilePicture ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeProfilePicture}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center hover:bg-error/90 transition-fast"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="btn-secondary space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>{formData.profilePicture ? "Change Photo" : "Upload Photo"}</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max 5MB. JPG, PNG, GIF supported
                </p>
              </div>
            </div>
            {errors.profilePicture && (
              <p className="text-sm text-destructive">{errors.profilePicture}</p>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter your first name"
                className={errors.firstName ? "border-error" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-error">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter your last name"
                className={errors.lastName ? "border-error" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-error">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="e.g., Graduate Student, Professor, Researcher"
              className={errors.role ? "border-error" : ""}
            />
            {errors.role && (
              <p className="text-sm text-error">{errors.role}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => handleInputChange("organization", e.target.value)}
              placeholder="University or Institution (Optional)"
            />
          </div>

          {/* Research Interests */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">Research Interests *</Label>

            {/* Popular Interests */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {RESEARCH_INTERESTS.slice(0, 8).map((interest) => (
                  <button
                    key={interest}
                    onClick={() => addInterest(interest)}
                    disabled={formData.interests.includes(interest)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-fast focus-ring ${
                      formData.interests.includes(interest)
                        ? "bg-primary/20 text-primary cursor-not-allowed opacity-60"
                        : "btn-secondary hover:bg-primary/10"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Interest Input */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground mb-3 block">Add research interests</Label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Input
                    value={interestInput}
                    onChange={(e) => handleInterestInputChange(e.target.value)}
                    placeholder="Type your research area..."
                    onFocus={() => interestInput && setShowInterestDropdown(true)}
                    className={`bg-input border-border rounded-lg ${errors.interests ? "border-error" : ""}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && interestInput.trim()) {
                        e.preventDefault()
                        addInterest(interestInput.trim())
                      }
                    }}
                  />
                  {showInterestDropdown && filteredInterests.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 card-default rounded-lg shadow-lg max-h-40 overflow-y-auto mt-2">
                      {filteredInterests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => addInterest(interest)}
                          className="w-full text-left px-4 py-3 hover:bg-muted text-sm transition-fast first:rounded-t-lg last:rounded-b-lg"
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (interestInput.trim()) {
                      addInterest(interestInput.trim())
                    }
                  }}
                  disabled={!interestInput.trim()}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected Interests */}
            {formData.interests.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground mb-3 block">Your Selected Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <Badge
                      key={interest}
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary border-0 rounded-lg font-medium"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="hover:text-error transition-fast"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {errors.interests && (
              <p className="text-sm text-error">{errors.interests}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="btn-primary"
            >
              Done
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}