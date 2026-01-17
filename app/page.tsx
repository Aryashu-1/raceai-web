"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Brain, Search, FileText, Zap } from "lucide-react";
import ModernLogo from "@/components/modern-logo";
import SimplifiedOnboardingContainer from "@/components/onboarding/simplified-onboarding-container";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { SimpleThemeToggle } from "@/components/theme-toggle";
import UnifiedInteractiveGrid from "@/components/unified-interactive-grid";
import CustomCursor from "@/components/custom-cursor";
import { useUser } from "./context/UserContext";
import { useProjects } from "@/app/context/ProjectContext";
import { useChatContext } from "@/app/context/ChatContext";


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
  const { setProjects } = useProjects();
  const { setChatSessions } = useChatContext();
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
  const router = useRouter();
  const { updateUser } = useUser();

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
      if (isSignUp) {
        // store in context (no API call)

        updateUser({
          email: formData.email,
          password: formData.password,
        });


        // Navigate to onboarding page
        router.push("/onboarding");

      } else {
        // --- SIGNIN: call backend ---
        const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`;
        console.log("🔹 Signing in via:", endpoint);

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        // Backend not found or down
        if (!response.ok) {
          const text = await response.text();
          console.error("❌ Backend response:", text);
          throw new Error(`Signin failed (${response.status})`);
        }

        const result = await response.json();
        console.log("✅ Signin response:", result);

        const { user, token } = result;
        if (!user || !token) {
          throw new Error("Invalid response from server");
        }

        // Save to localStorage for persistence
        localStorage.setItem("race_ai_user", JSON.stringify(user));
        localStorage.setItem("race_ai_token", token);

        // Update context
        updateUser(user);

        //load chats
        try {
          const chatsResp = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/user/${user.id}`
          );
          if (chatsResp.ok) {
            const chatsJson = await chatsResp.json();
            setChatSessions(chatsJson);
            console.log("✅ chats loaded into context", chatsJson.length);
          } else {
            console.warn("Chats fetch failed");
          }
        } catch (err) {
          console.warn("Chats fetch error", err);
        }




        // load projects
        try {
          const projectsResp = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/structuredProjects/${user.id}`
          );
          if (projectsResp.ok) {
            const projectsJson = await projectsResp.json();
            setProjects(projectsJson);
            console.log("✅ projects loaded into context", projectsJson.length);
          } else {
            console.warn("Projects fetch failed");
          }
        } catch (err) {
          console.warn("Projects fetch error", err);
        }



        // Notify parent if applicable
        onAuthSuccess(user, false);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: error.message || "An unexpected error occurred",
      }));
    } finally {
      setIsLoading(false);
    }
  };


  /* 
   * NOTE: For Production, you should use `signIn` from `next-auth/react` on the client side.
   * However, since `next-auth` integration often requires SessionProvider wrapping in the root layout,
   * we will implement the handler to redirect to the API routes which standard NextAuth Setup uses.
   * If you have `signIn` available from a hook/import, use it. Here we assume standard path.
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
       // Standard NextAuth pattern: default sign-in route
       // Or `import { signIn } from "next-auth/react"` if you wrap the app in SessionProvider
       // Since we are fixing "correct implementation", let's redirect to the provider flow.
       window.location.href = "/api/auth/signin/google";
    } catch (error) {
      console.error(error);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Failed to sign in with Google",
      }));
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      window.location.href = "/api/auth/signin/github";
    } catch (error) {
       console.error(error);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Failed to sign in with GitHub",
      }));
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-outfit">
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
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${!isSignUp
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-3 px-6 text-sm font-medium rounded-md transition-all duration-200 ${isSignUp
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
                className={`w-full pl-11 pr-4 py-3 h-12 text-sm bg-input border border-border rounded-lg transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${formErrors.email ? "border-red-500" : ""
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
                className={`w-full pl-11 pr-12 py-3 h-12 bg-input border border-border rounded-lg transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${formErrors.password ? "border-red-500" : ""
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
                  className={`w-full pl-11 pr-12 py-3 h-12 bg-input border border-border rounded-lg transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${formErrors.confirmPassword ? "border-red-500" : ""
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
      <footer className="w-full py-6 text-center text-xs text-white/30 relative z-0 mt-8">
         <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Support</a>
         </div>
         © 2026 RaceAI. Research Accessible by Everyone.
      </footer>
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
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Unified Background: Moving + Rubber Band Physics */}
      <div className="fixed inset-0 z-0 bg-background dark:bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)]">
        <UnifiedInteractiveGrid />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <SimpleThemeToggle />
      </div>

      {/* Main Layout - Allow Scrolling (Revert to natural scroll) */ }
      <div className="container-lg w-full relative z-10 px-6 min-h-screen flex flex-col justify-center py-20">
        


        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto gap-12 lg:gap-10">
          
          {/* Top: Value Prop + Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-6"
          >
              <div className="flex flex-col items-center">
                {/* Logo Centered Above Text */}
                <div className="mb-6 scale-125">
                   <ModernLogo size={80} showText={false} animated={true} />
                </div>
                
                <h1 className="font-space-grotesk text-5xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight leading-none">
                  Research Accessible
                  <br />
                  <span className="text-primary">by Everyone.</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed mx-auto">
                  Analyze papers, collaborate with AI and your team, manage tasks & discover breakthroughs faster than ever.
                </p>
              </div>

              {/* Steps (Compact - Centered) */}
              {/* <ul className="flex flex-wrap justify-center gap-8 mt-8 hidden lg:flex">
                 <li className="flex items-center gap-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                     <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 shrink-0 font-bold border border-blue-200 dark:border-blue-800 text-xs">1</div>
                     <span className="text-sm font-medium text-muted-foreground">Access Platform</span>
                 </li>
                 <li className="flex items-center gap-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                     <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 shrink-0 font-bold border border-purple-200 dark:border-purple-800 text-xs">2</div>
                     <span className="text-sm font-medium text-muted-foreground">Define Field</span>
                 </li>
                 <li className="flex items-center gap-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
                     <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 shrink-0 font-bold border border-green-200 dark:border-green-800 text-xs">3</div>
                     <span className="text-sm font-medium text-muted-foreground">Accelerate</span>
                 </li>
              </ul> */}
          </motion.div>

          {/* Bottom: Auth Form */}
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
             className="w-full max-w-md mx-auto"
          >
             {/* Using a transparent container to let grid show, assuming auth-form-card handles its own blur or transparency */}
             <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
                <AuthFormCard onAuthSuccess={handleAuthSuccess} />
             </div>
          </motion.div>

        </div>
      </div>
    </div>
      
     );
}
