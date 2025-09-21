"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Check, Mail, Lock, User } from "lucide-react";
import { RaceGeometricLogo } from "@/components/race-geometric-logo";
import { OnboardingContainer } from "@/components/onboarding/onboarding-container";
import { Button } from "@/components/ui/button";
import {KnowledgeGraph} from "@/components/knowledge-graph";
import ThemeSelector from "@/components/theme-selector";
import LoadingSpinner from "@/components/loading-spinner";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />
        <KnowledgeGraph isBackground={true} />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <RaceGeometricLogo size={40} showText={true} />
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Button
              variant="outline"
              size="sm"
              className="glass-effect bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                  Research Accessible
                  <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    By Everyone
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Streamline your research with our intuitive research
                  empowerment and management tool. Organize, track progress,
                  collaborate with peers, and get AI-powered assistance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group hover-lift">
                  Watch Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-effect bg-transparent"
                >
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent research assistance
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Collaborative
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Work together seamlessly
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="lg:max-w-md mx-auto w-full">
              <AuthFormCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthFormCard = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleInputChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
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
    setFormErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        email: formData.email,
        password: formData.password,
        authenticated: true,
        onboarded: false,
      };
      localStorage.setItem("race_ai_user", JSON.stringify(userData));
      window.location.href = "/onboarding";
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "An unexpected error occurred",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Get Started</h2>
        <p className="text-muted-foreground">Join the research revolution</p>
      </div>

      <div className="flex bg-secondary rounded-full p-1 mb-6">
        <button
          onClick={() => setIsSignUp(false)}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            !isSignUp
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            isSignUp
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@university.edu"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          {formErrors.email && (
            <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a secure password"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-destructive text-xs mt-1">
              {formErrors.password}
            </p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">
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
              keepSignedIn ? "bg-primary border-primary" : "border-border"
            }`}
          >
            {keepSignedIn && (
              <Check size={12} className="text-primary-foreground" />
            )}
          </button>
          <label
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => setKeepSignedIn(!keepSignedIn)}
          >
            Keep me signed in
          </label>
        </div>

        {formErrors.submit && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-destructive text-sm">{formErrors.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full group hover-lift"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Please wait...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>{isSignUp ? "Continue with JARVIS" : "Sign In"}</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-4 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 glass-effect bg-transparent"
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
            className="flex items-center justify-center gap-2 glass-effect bg-transparent"
          >
            🔐 SSO
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Try demo without signing up
          </button>
        </div>
      </form>
    </div>
  );
};

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOnboardingComplete = (completedUserData) => {
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    };
    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));

    // Redirect to dashboard after onboarding
    window.location.href = "/dashboard";
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
      <LandingPage />
    </div>
  );
}
"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Check, Mail, Lock, User } from "lucide-react";
import { RaceGeometricLogo } from "@/components/race-geometric-logo";
import { OnboardingContainer } from "@/components/onboarding/onboarding-container";
import { Button } from "@/components/ui/button";
import {KnowledgeGraph} from "@/components/knowledge-graph";
import ThemeSelector from "@/components/theme-selector";
import LoadingSpinner from "@/components/loading-spinner";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10" />
        <KnowledgeGraph isBackground={true} />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <RaceGeometricLogo size={40} showText={true} />
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Button
              variant="outline"
              size="sm"
              className="glass-effect bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                  Research Accessible
                  <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    By Everyone
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Streamline your research with our intuitive research
                  empowerment and management tool. Organize, track progress,
                  collaborate with peers, and get AI-powered assistance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group hover-lift">
                  Watch Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-effect bg-transparent"
                >
                  Learn More
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent research assistance
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Collaborative
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Work together seamlessly
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="lg:max-w-md mx-auto w-full">
              <AuthFormCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthFormCard = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleInputChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
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
    setFormErrors((prev) => ({ ...prev, submit: "" }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        email: formData.email,
        password: formData.password,
        authenticated: true,
        onboarded: false,
      };
      localStorage.setItem("race_ai_user", JSON.stringify(userData));
      window.location.href = "/onboarding";
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "An unexpected error occurred",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-effect rounded-3xl p-8 shadow-2xl border border-border">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Get Started</h2>
        <p className="text-muted-foreground">Join the research revolution</p>
      </div>

      <div className="flex bg-secondary rounded-full p-1 mb-6">
        <button
          onClick={() => setIsSignUp(false)}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            !isSignUp
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsSignUp(true)}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
            isSignUp
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@university.edu"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          {formErrors.email && (
            <p className="text-destructive text-xs mt-1">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a secure password"
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-destructive text-xs mt-1">
              {formErrors.password}
            </p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-destructive text-xs mt-1">
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
              keepSignedIn ? "bg-primary border-primary" : "border-border"
            }`}
          >
            {keepSignedIn && (
              <Check size={12} className="text-primary-foreground" />
            )}
          </button>
          <label
            className="text-sm text-muted-foreground cursor-pointer"
            onClick={() => setKeepSignedIn(!keepSignedIn)}
          >
            Keep me signed in
          </label>
        </div>

        {formErrors.submit && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-destructive text-sm">{formErrors.submit}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full group hover-lift"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Please wait...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>{isSignUp ? "Continue with JARVIS" : "Sign In"}</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-4 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 glass-effect bg-transparent"
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
            className="flex items-center justify-center gap-2 glass-effect bg-transparent"
          >
            🔐 SSO
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Try demo without signing up
          </button>
        </div>
      </form>
    </div>
  );
};

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOnboardingComplete = (completedUserData) => {
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    };
    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));

    // Redirect to dashboard after onboarding
    window.location.href = "/dashboard";
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
      <LandingPage />
    </div>
  );
}
