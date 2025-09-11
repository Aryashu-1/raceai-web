"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingContainer from "@/components/onboarding/onboarding-container";

export default function OnboardingPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem("race_ai_user");
    if (!storedUser) {
      router.push("/");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user.authenticated) {
      router.push("/");
      return;
    }

    setUserData(user);
  }, [router]);

  const handleOnboardingComplete = (completedUserData) => {
    // Update user data with onboarding completion
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    };
    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));

    // Redirect to jarvis page
    router.push("/jarvis");
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingContainer
      initialUserData={userData}
      onComplete={handleOnboardingComplete}
    />
  );
}
