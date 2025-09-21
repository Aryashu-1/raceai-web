"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import ARIAAssistant, {
  useARIAConversation,
} from "@/components/aria-assistant";
import { cn } from "@/lib/utils";

interface OnboardingStep2Props {
  onNext: (data: {
    email: string;
    password: string;
    role: string;
    level: string;
  }) => void;
  onBack: () => void;
  className?: string;
}

const roles = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "researcher", label: "Researcher", icon: "🔬" },
  { id: "professor", label: "Professor", icon: "👨‍🏫" },
  { id: "staff", label: "Staff", icon: "📊" },
];

const levels = [
  { id: "undergrad", label: "Undergrad" },
  { id: "graduate", label: "Graduate" },
  { id: "phd", label: "PhD" },
  { id: "postdoc", label: "Postdoc" },
];

export default function OnboardingStep2({
  onNext,
  onBack,
  className,
}: OnboardingStep2Props) {
  const { currentState, currentMessage, speak, think, idle } =
    useARIAConversation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    level: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: email, 1: password, 2: role, 3: level

  React.useEffect(() => {
    speak(
      "First, I need your email so I can personalize everything perfectly for you."
    );
  }, [speak]);

  const handleEmailSubmit = () => {
    if (!formData.email) return;

    think();
    setTimeout(() => {
      const isAcademic = formData.email.includes(".edu");
      const domain = formData.email.split("@")[1];

      if (isAcademic) {
        speak(`${domain}! Impressive. Now let's create a secure password:`);
      } else {
        speak("Great email! Now let's create a secure password:");
      }
      setCurrentStep(1);
    }, 1000);
  };

  const handlePasswordSubmit = () => {
    if (formData.password.length < 8) return;

    think();
    setTimeout(() => {
      speak("Perfect! I can tell you're academic. What's your role?");
      setCurrentStep(2);
    }, 1000);
  };

  const handleRoleSelect = (roleId: string) => {
    setFormData((prev) => ({ ...prev, role: roleId }));
    think();
    setTimeout(() => {
      const roleLabel = roles.find((r) => r.id === roleId)?.label;
      speak(
        `${roleLabel}! What level are you researching at? This helps me adjust my explanations.`
      );
      setCurrentStep(3);
    }, 1000);
  };

  const handleLevelSelect = (levelId: string) => {
    const newData = { ...formData, level: levelId };
    setFormData(newData);

    speak(
      "Excellent! I'm setting up your perfect research environment... ✨",
      "excited"
    );
    setTimeout(() => {
      onNext(newData);
    }, 2500);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length < 8) return { strength: "Weak", color: "text-red-500" };
    if (password.length < 12)
      return { strength: "Medium", color: "text-yellow-500" };
    return { strength: "Strong", color: "text-green-500" };
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center relative overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D1D1D] via-[#1D1D1D] to-[#2A2A2A]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 border border-[#246CD8]/30 rounded-full animate-pulse" />
          <div className="absolute bottom-32 left-16 w-24 h-24 border border-[#0052CC]/30 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* ARIA Assistant - Smaller, positioned top-right */}
        <div className="absolute -top-20 -right-10">
          <ARIAAssistant
            size={80}
            state={currentState}
            message={currentMessage}
            onMessageComplete={() => idle()}
          />
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    step <= currentStep ? "bg-[#246CD8]" : "bg-white/30"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Email Step */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  📧 Email Address
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="bg-[#2E2E1E] border-gray-600 text-white focus:border-[#246CD8]"
                  placeholder="your@email.com"
                  onKeyPress={(e) => e.key === "Enter" && handleEmailSubmit()}
                />
              </div>
              <Button
                onClick={handleEmailSubmit}
                disabled={!formData.email}
                className="w-full bg-[#246CD8] hover:bg-[#0052CC] text-white"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Password Step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  🔒 Create Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="bg-[#2E2E1E] border-gray-600 text-white focus:border-[#246CD8] pr-10"
                    placeholder="Enter password"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handlePasswordSubmit()
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formData.password && (
                  <div
                    className={cn("text-sm mt-2", getPasswordStrength().color)}
                  >
                    Strength: {getPasswordStrength().strength}
                  </div>
                )}
              </div>
              <Button
                onClick={handlePasswordSubmit}
                disabled={formData.password.length < 8}
                className="w-full bg-[#246CD8] hover:bg-[#0052CC] text-white"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Role Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium text-center mb-6">
                👤 Choose your role:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="bg-white/10 hover:bg-[#246CD8] border border-white/20 hover:border-[#246CD8] rounded-lg p-4 text-white transition-all duration-200 text-center"
                  >
                    <div className="text-2xl mb-2">{role.icon}</div>
                    <div className="text-sm font-medium">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Level Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium text-center mb-6">
                📚 What level?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleLevelSelect(level.id)}
                    className="bg-white/10 hover:bg-[#0052CC] border border-white/20 hover:border-[#0052CC] rounded-lg p-3 text-white transition-all duration-200 text-center text-sm font-medium"
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white text-sm underline"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
