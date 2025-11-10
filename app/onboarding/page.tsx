"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GeometricBackground from "@/components/geometric-background";
import SimplifiedOnboardingContainer from "@/components/onboarding/simplified-onboarding-container";
import { useUser } from "../context/UserContext";
import { User } from "../context/UserContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState("");

  // Load from context
  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  const handleOnboardingComplete = async (completedUserData: User) => {
    const updatedUser = {
      ...completedUserData,
      authenticated: true,
      onboarded: true,
    };

    localStorage.setItem("race_ai_user", JSON.stringify(updatedUser));
    console.log("✅ Stored user in context:", updatedUser);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`;
      console.log("📡 Calling signup API:", endpoint);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser), // ✅ FIXED (was updateUser)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Signup API failed:", errText);
        throw new Error("Signup API failed");
      }

      const result = await res.json();
      console.log("✅ Signup successful, response:", result);

      // 🔹 Update context with final user info
      updateUser(updatedUser);

      // 🔹 Navigate to dashboard (or next)
      router.push("/jarvis");
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please try again.");
    }
  };

  if (!userData)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading onboarding...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/50 dark:to-blue-900/30 relative">
      <GeometricBackground variant="tesseract" />
      <SimplifiedOnboardingContainer
        initialUserData={userData}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}








// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import SimplifiedOnboardingContainer from "@/components/onboarding/simplified-onboarding-container"
// import GeometricBackground from "@/components/geometric-background"
// import { useUser } from "../context/UserContext";


// import { User } from "../types/user";

// interface UserState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;

//   // Actions
//   setUser: (user: User) => void;
//   setToken: (token: string) => void;
//   clearUser: () => void;
//   setLoading: (state: boolean) => void;
// }


// export default function OnboardingPage() {
//   const router = useRouter()
//   const [userData, setUserData] =  useState<User | null>(null);

//   const { user, updateUser } = useUser();
//    useEffect(() => {
//     if (user) {
//       setUserData(user);
//     }
//   }, [user]);

//   // Example usage:
//   console.log("Prefilled user email:", userData?.email);

//   useEffect(() => {
//     // Check if user is authenticated
//     const storedUser = localStorage.getItem("race_ai_user")
//     if (!storedUser) {
//       router.push("/")
//       return
//     }

//     const user = JSON.parse(storedUser)
//     if (!user.authenticated) {
//       router.push("/")
//       return
//     }

//     setUserData(user)
//   }, [router])

//   const handleOnboardingComplete = (completedUserData: any) => {
//     // Update user data with onboarding completion
//     const updatedUser = {
//       ...completedUserData,
//       authenticated: true,
//       onboarded: true,
//     }
//     localStorage.setItem("race_ai_user", JSON.stringify(updatedUser))

//     // Redirect to JARVIS chat
//     router.push("/jarvis")
//   }

//   if (!userData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/50 dark:to-blue-900/30 relative">
//         <GeometricBackground variant="tesseract" />
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <div className="card-default px-6 py-3">
//             <p className="text-foreground font-medium">Loading onboarding...</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-slate-950 dark:via-blue-950/50 dark:to-blue-900/30 relative">
//       <GeometricBackground variant="tesseract" />
//       <SimplifiedOnboardingContainer initialUserData={userData} onComplete={handleOnboardingComplete} />
//     </div>
//   )
// }



