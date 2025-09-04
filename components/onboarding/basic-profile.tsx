"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BasicProfileProps {
  onNext: (data: { firstName: string; lastName: string; role: string; organization?: string }) => void
  onBack: () => void
}

const roles = ["Student", "Researcher", "Professor", "Staff", "Industry Professional", "Other"]

export default function BasicProfile({ onNext, onBack }: BasicProfileProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("")
  const [organization, setOrganization] = useState("")
  const [currentField, setCurrentField] = useState("firstName")
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    role?: string
  }>({})

  useEffect(() => {
    if (!firstName) {
      setCurrentField("firstName")
    } else if (firstName && !lastName) {
      setCurrentField("lastName")
    } else if (firstName && lastName && !role) {
      setCurrentField("role")
    } else if (firstName && lastName && role) {
      setCurrentField("organization")
    }
  }, [firstName, lastName, role, organization])

  const validateFields = () => {
    const newErrors: typeof errors = {}

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters"
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters"
    }

    if (!role) {
      newErrors.role = "Please select your role"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateFields()) {
      onNext({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
        organization: organization.trim() || undefined,
      })
    }
  }

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value)
    if (errors.firstName) {
      setErrors((prev) => ({ ...prev, firstName: undefined }))
    }
  }

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value)
    if (errors.lastName) {
      setErrors((prev) => ({ ...prev, lastName: undefined }))
    }
  }

  const handleRoleChange = (value: string) => {
    setRole(value)
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }))
    }
  }

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const trigger = e.currentTarget as HTMLElement
    trigger.click()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className={`aria-guide aria-guide-${currentField}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary via-blue-500 to-primary flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] animate-pulse border-2 border-white/20">
          <div className="w-5 h-5 rounded-full bg-white/90 animate-ping shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400 animate-bounce shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-card-enhanced rounded-2xl p-6 shadow-2xl border border-primary/20">
          <div className="text-center mb-4">
            <div className="w-full bg-muted rounded-full h-2 mb-3">
              <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "60%" }}></div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Complete Your Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 relative" id="firstName-field">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  placeholder="John"
                  required
                  className={`input-field-enhanced ${errors.firstName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-2 relative" id="lastName-field">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={handleLastNameChange}
                  placeholder="Doe"
                  required
                  className={`input-field-enhanced ${errors.lastName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2 relative" id="role-field">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select value={role} onValueChange={handleRoleChange} required>
                <SelectTrigger
                  className={`input-field-enhanced ${errors.role ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  onClick={handleSelectClick}
                >
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption} value={roleOption}>
                      {roleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>

            <div className="space-y-2 relative" id="organization-field">
              <Label htmlFor="organization" className="text-sm font-medium">
                University/Institution (Optional)
              </Label>
              <Input
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Stanford University"
                className="input-field-enhanced"
              />
            </div>

            <div className="flex space-x-3 pt-3">
              <Button variant="outline" onClick={onBack} className="flex-1 btn-secondary bg-transparent">
                Back
              </Button>
              <Button type="submit" className="flex-1 btn-primary">
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
