"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AriaAssistant } from "@/components/aria-assistant";

interface AccountCreationProps {
  onNext: (data: { email: string; password: string }) => void;
  onSkip: () => void;
}

export default function AccountCreation({
  onNext,
  onSkip,
}: AccountCreationProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return { strength: "weak", color: "text-red-500" };
    if (
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return { strength: "strong", color: "text-green-500" };
    }
    return { strength: "medium", color: "text-yellow-500" };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (!acceptTerms) return;

    onNext({ email, password });
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-8 right-8">
          <AriaAssistant
            size="small"
            message="I'll help you get set up quickly"
            showMessage={false}
          />
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join RACE AI to unlock personalized research tools
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                className={`transition-all ${
                  emailError ? "border-red-500" : ""
                }`}
                placeholder="your.email@university.edu"
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
              {email.includes(".edu") && (
                <p className="text-sm text-blue-500">
                  ✓ University email detected - you'll get premium features!
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  className={`pr-10 transition-all ${
                    passwordError ? "border-red-500" : ""
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {password && (
                <p className={`text-sm ${passwordStrength.color}`}>
                  Strength: {passwordStrength.strength}
                </p>
              )}
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) =>
                  setAcceptTerms(checked as boolean)
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!acceptTerms || !email || !password}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Already have an account?{" "}
              <a href="/auth/signin" className="text-primary hover:underline">
                Sign in
              </a>
            </p>

            <Button variant="ghost" onClick={onSkip} className="text-sm">
              Continue as guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
