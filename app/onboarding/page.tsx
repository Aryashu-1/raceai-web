"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UnifiedInteractiveGrid from "@/components/unified-interactive-grid";
import SimplifiedOnboardingContainer from "@/components/onboarding/simplified-onboarding-container";
import dynamic from "next/dynamic";


const Tesseract3D = dynamic(() => import("@/components/tesseract-3d"), { ssr: false });
import { useUser } from "../context/UserContext";
import { User } from "../context/UserContext";
import { SimpleThemeToggle } from "@/components/theme-toggle";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState("");

  // Load from context
  useEffect(() => {
    if (user) setUserData(user);
    // If no user in context, we might rely on localStorage or just wait?
    // For now, let's allow it to render so we can see the UI even if state is partial.
  }, [user]);

  const handleOnboardingComplete = async (completedUserData: User) => {
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    };

    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));
    
    // Update context
    updateUser(updatedUser);

    try {
      // Simulate or call backend signup if needed
      // const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`;
      // await fetch(...) 
      // For now, assume success and redirect:
      router.push("/jarvis");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* 1. Background from Home Page */}
      <div className="fixed inset-0 z-0 bg-background dark:bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)]">
        <UnifiedInteractiveGrid />
      </div>

       {/* Theme Toggle */}
       <div className="fixed top-6 right-6 z-50">
        <SimpleThemeToggle />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
         {/* Left Column: 3D Tesseract */}
         <div className="relative hidden lg:flex items-center justify-center p-12">
            {/* Tesseract Container - constrained */}
            <div className="w-full h-full max-w-lg max-h-[600px] relative">
               <Tesseract3D />
               <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <p className="text-muted-foreground/50 font-mono text-xs tracking-[0.2em] uppercase animate-pulse">
                     Initializing Neural Interface
                  </p>
               </div>
            </div>
         </div>

         {/* Right Column: Jarvis "Classy" Dialogue */}
         <div className="flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-xl">
               {userData ? (
                 <SimplifiedOnboardingContainer
                   initialUserData={userData}
                   onComplete={handleOnboardingComplete}
                 />
               ) : (
                  // Loading State
                  <div className="flex flex-col items-center gap-4 p-8 glass-panel rounded-2xl">
                     <div className="w-8 h-8 relative">
                        <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                     </div>
                     <p className="text-primary font-mono text-sm">Authenticating Protocol...</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
