"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Check, Moon, Sun } from "lucide-react";
import { RaceGeometricLogo } from "@/components/race-geometric-logo";
import { OnboardingContainer } from "@/components/onboarding/onboarding-container";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const KnowledgeGraphHero = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative min-h-screen flex items-center justify-between overflow-hidden">
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all duration-200 bg-transparent"
        >
          Contact Us
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 bg-transparent"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between w-full">
        {/* Left side content with hero text */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <RaceGeometricLogo size={50} variant="primary" showText={true} />
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Research Accessible
            <span className="block text-blue-600 dark:text-blue-300 font-bold">
              By Everyone
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Streamline your research with our intuitive research empowerment and
            management tool. Organize, track progress, collaborate with peers,
            and get AI-powered assistance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              size="lg"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Watch Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right side Get Started form positioned for better conversion */}
        <div className="flex-shrink-0 w-full max-w-md ml-8">
          <AuthFormCard />
        </div>
      </div>
    </div>
  );
};

const AuthFormCard = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/jarvis");
    setIsLoading(false);
  };

  return (
    <div className="bg-white/98 dark:bg-slate-800/98 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-600/50">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#1e293b" }}>
          Get Started
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Join the research revolution
        </p>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-700 rounded-full p-1 mb-6">
        <button
          onClick={() => setIsSignUp(false)}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            !isSignUp
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            isSignUp
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.email@university.edu"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a secure password"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setKeepSignedIn(!keepSignedIn)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              keepSignedIn
                ? "bg-blue-600 border-blue-600"
                : "border-slate-300 dark:border-slate-600"
            }`}
          >
            {keepSignedIn && <Check size={12} className="text-white" />}
          </button>
          <label
            className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
            onClick={() => setKeepSignedIn(!keepSignedIn)}
          >
            Keep me signed in
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="default"
          size="lg"
          className="w-full rounded-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span>Please wait...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>{isSignUp ? "Continue with JARVIS" : "Sign In"}</span>
              <ArrowRight size={18} />
            </div>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-800 px-4 text-slate-500">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all duration-200 bg-transparent"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.84c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-all duration-200 bg-transparent"
          >
            🔐 SSO
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/demo")}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            Try demo without signing up
          </button>
        </div>
      </form>
    </div>
  );
};

export default function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <OnboardingContainer
        initialUserData={userData}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <KnowledgeGraphHero />
    </div>
  );
}
