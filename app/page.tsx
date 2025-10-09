"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Brain, Search, FileText, Zap } from "lucide-react";
import ModernLogo from "@/components/modern-logo";
import SimplifiedOnboardingContainer from "@/components/onboarding/simplified-onboarding-container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import AnimatedTechBackground from "@/components/animated-tech-background";
import GeometricBackground from "@/components/geometric-background";

interface AuthFormCardProps {
  onAuthSuccess: (userData: any, isNewUser?: boolean) => void;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  password: string;
  confirmPassword: string;
  submit: string;
}

const AuthFormCard: React.FC<AuthFormCardProps> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: "",
    password: "",
    confirmPassword: "",
    submit: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    }
  };

  const validateForm = () => {
    const errors: Partial<FormErrors> = {};
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
    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setFormErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        email: formData.email,
        password: formData.password,
        authenticated: true,
        onboarded: !isSignUp, // Existing users (sign-in) are already onboarded
      };
      localStorage.setItem("race_ai_user", JSON.stringify(userData));
      onAuthSuccess(userData, isSignUp);
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "An unexpected error occurred",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        email: "user@gmail.com",
        provider: "google",
        authenticated: true,
        onboarded: false,
      };
      localStorage.setItem("race_ai_user", JSON.stringify(userData));
      onAuthSuccess(userData, true);
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "Failed to sign in with Google",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate GitHub OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        email: "user@github.com",
        provider: "github",
        authenticated: true,
        onboarded: false,
      };
      localStorage.setItem("race_ai_user", JSON.stringify(userData));
      onAuthSuccess(userData, true);
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "Failed to sign in with GitHub",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card-default p-8 bg-card/80 backdrop-blur-sm shadow-xl border border-border/50">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Start your research journey" : "Sign in to continue"}
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
              !isSignUp
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${
              isSignUp
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-11 pr-4 py-3 h-12 text-sm bg-input border border-border rounded-lg transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  formErrors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-11 pr-12 py-3 h-12 bg-input border border-border rounded-lg transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  formErrors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="btn-ghost p-1 absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Field - Only for Sign Up */}
          {isSignUp && (
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-3 h-12 bg-input border border-border rounded-lg transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    formErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="btn-ghost p-1 absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Error */}
          {formErrors.submit && (
            <p className="text-sm text-red-500 text-center">
              {formErrors.submit}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-3 mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full btn-secondary py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC04"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={handleGitHubSignIn}
              disabled={isLoading}
              className="w-full btn-secondary py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? (
                <>
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="link-button-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#4C9AFF] focus:ring-offset-1 rounded cursor-pointer"
                  >
                    Sign up →
                  </button>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOnboardingComplete = (completedUserData: any) => {
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    };
    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));
    router.push("/dashboard");
  };

  const handleAuthSuccess = (userData: any, isNewUser: boolean = false) => {
    if (isNewUser) {
      // New user - go to onboarding
      const updatedUser = {
        ...userData,
        authenticated: true,
        onboarded: false,
      };
      localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));
      router.push("/onboarding");
    } else {
      // Existing user - go directly to JARVIS chat
      const updatedUser = {
        ...userData,
        authenticated: true,
        onboarded: true,
      };
      localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));
      router.push("/jarvis");
    }
  };

  if (showOnboarding) {
    return (
      <SimplifiedOnboardingContainer
        initialUserData={userData}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedTechBackground variant="grid" />
      <div className="dark:block hidden">
        <GeometricBackground variant="tesseract" />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <div className="card-glass p-2">
          <SimpleThemeToggle />
        </div>
      </div>

      {/* Hero Section - Split Screen Layout */}
      <section className="min-h-screen flex items-center py-16 px-12 lg:px-16 relative z-10">
        <div className="container-lg">
          <div className="grid lg:grid-cols-5 gap-16 items-center min-h-[80vh]">
            {/* Left Side - Hero Content (60%) */}
            <div className="lg:col-span-3 text-center lg:text-left px-12 lg:px-16">
              <div className="flex justify-center lg:justify-start mb-8">
                <ModernLogo size={56} />
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight leading-tight">
                Research
                <br />
                Accessible
                <br />
                <span className="text-[#0052CC]">by Everyone</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
                Transform your research workflow with JARVIS, your AI assistant.
                Analyze papers, discover insights, and collaborate seamlessly.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-card-foreground hover:bg-muted transition-colors duration-200">
                  AI-Powered Research
                </span>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-card-foreground hover:bg-muted transition-colors duration-200">
                  Instant Insights
                </span>
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-card-foreground hover:bg-muted transition-colors duration-200">
                  Collaborative Platform
                </span>
              </div>
            </div>

            {/* Right Side - Auth Form (40%) */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end px-12 lg:px-16">
              <AuthFormCard onAuthSuccess={handleAuthSuccess} />
            </div>
          </div>
        </div>
      </section>

      {/* Research Journey Section */}
      <section className="py-16 responsive-padding">
        <div className="container-lg">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Built for Researchers, By Researchers
            </h2>
            <p className="text-lg text-muted-foreground container-sm leading-relaxed">
              Enter any research field and contribute meaningfully - fast. All your research tools in one place.
            </p>
          </div>

          {/* Research Journey Flow */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">

              {/* Step 1: Reduce Time to Research */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">1. Reduce Time to Research</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Cut down months of learning into days. Get quick field onboarding, understand complex papers instantly, and have AI explain terminology on-demand.
                </p>
              </div>

              {/* Flow Arrow 1 */}
              <div className="hidden lg:block">
                <ArrowRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="lg:hidden">
                <svg className="w-8 h-8 text-muted-foreground rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 2: Unified Research Workspace */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">2. Unified Research Workspace</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Complete research management platform. Organize projects hierarchically, access multiple LLMs, LaTeX editor, and collaboration tools - all in one place.
                </p>
              </div>

              {/* Flow Arrow 2 */}
              <div className="hidden lg:block">
                <ArrowRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="lg:hidden">
                <svg className="w-8 h-8 text-muted-foreground rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Step 3: Stay at the Cutting Edge */}
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">3. Stay at the Cutting Edge</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  Track state-of-the-art research, discover major unsolved problems, connect with top researchers, and access funding opportunities.
                </p>
              </div>
            </div>

            {/* Key Features Below */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="flex items-start space-x-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Knowledge Discovery</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Explore state-of-the-art research, track breakthroughs, and discover what matters in your field
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Research Management</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Organize projects, papers, and collaborations in a hierarchical workspace inspired by Box Notes
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">AI-Powered Learning</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Generate podcasts from papers, get explanations in simple terms, understand new fields faster
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Multi-LLM Assistant</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Access GPT-4, Claude, Gemini, and more - all in one place with auto-mode combining responses
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Collaboration Tools</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Voice chat, screen sharing, whiteboard - everything you need to work with your team
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Problems & Funding</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Discover significant research challenges and connect with funding opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
