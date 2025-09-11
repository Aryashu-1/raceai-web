"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmailVerification from "./email-verification";
import BasicProfile from "./basic-profile";
import InterestSelectionText from "./interest-selection-text";
import ProfilePictureSelection from "./profile-picture-selection";
import ResearcherSelection from "./researcher-selection";
import WelcomeComplete from "./welcome-complete";
import PersonaAssignment from "./persona-assignment";
import JarvisConversation from "../jarvis-conversation";

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  organization?: string;
  interests: string[];
  verificationCode?: string;
  favoriteResearcher?: any;
  persona?: { name: string; tagline: string; color: string };
  profilePicture?: string;
  profileType?: "upload" | "avatar";
  selectedAvatar?: any;
}

interface OnboardingContainerProps {
  initialUserData?: Partial<UserData>;
  onComplete: (userData: UserData) => void;
}

export default function OnboardingContainer({
  initialUserData = {},
  onComplete,
}: OnboardingContainerProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(2);
  const [userData, setUserData] = useState<Partial<UserData>>(initialUserData);
  const [jarvisMessage, setJarvisMessage] = useState("");
  const [jarvisState, setJarvisState] = useState<
    "idle" | "speaking" | "thinking" | "excited"
  >("speaking");

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleComplete = () => {
    // Store user session
    const completeUserData = {
      ...userData,
      authenticated: true,
      onboarded: true,
    } as UserData;

    onComplete(completeUserData);
  };

  const handleSkipToDemo = () => {
    router.push("/demo");
  };

  const getJarvisMessage = (step: number) => {
    switch (step) {
      case 2:
        const emailDomain = userData.email?.split("@")[1] || "";
        const isUniversity =
          emailDomain.includes(".edu") ||
          emailDomain.includes("university") ||
          emailDomain.includes("college");

        if (isUniversity) {
          return `Hi! I'm JARVIS, your AI research assistant. I see you're from ${emailDomain.replace(
            ".edu",
            ""
          )} - impressive! I've sent a verification code to your email. Let's get you verified so I can start helping with your research journey!`;
        }
        return "Hi there! I'm JARVIS, your AI research assistant. I've sent a verification code to your email. Let's get you verified so I can start helping revolutionize your research process!";

      case 3:
        return "Perfect! Now I'd love to get to know you better. What's your name and role? This helps me personalize everything perfectly for you - from explaining complex concepts to suggesting the right research tools.";

      case 4:
        const role = userData.role?.toLowerCase() || "";
        if (role.includes("student")) {
          return "Excellent! Now, what research areas spark your curiosity? Start typing to see suggestions from various domains.";
        } else if (role.includes("professor") || role.includes("researcher")) {
          return "Great! What are your primary research domains? Type to explore different fields and select what interests you most.";
        }
        return "Wonderful! What research areas interest you most? Start typing to discover various fields and select your favorites.";

      case 5:
        return "Perfect! Now let's add a personal touch to your profile. Choose your own photo or get inspired by legendary researchers and innovators.";

      case 6:
        return "Fantastic choices! Let me show you some leading researchers in your fields. Picking a favorite helps me understand your research style and methodology preferences.";

      case 7:
        const researcher =
          userData.favoriteResearcher?.name || "your chosen researcher";
        return `Based on your interests and admiration for ${researcher}, I'm creating your unique research persona. This helps me tailor recommendations and personalize your entire research experience!`;

      case 8:
        const persona = userData.persona?.name || "Research Explorer";
        return `Welcome to RACE AI, ${userData.firstName}! Your personalized research environment is ready. As a "${persona}", I've customized your dashboard with tools perfect for your research style. Ready to discover something amazing?`;

      default:
        return "Let's continue building your perfect research environment together!";
    }
  };

  useEffect(() => {
    setJarvisMessage(getJarvisMessage(currentStep));
    setJarvisState("speaking");
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-6 right-6 z-30">
        <div className="group relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-0.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <div className="w-full h-full rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : userData.selectedAvatar ? (
                <img
                  src={userData.selectedAvatar.image || "/placeholder.svg"}
                  alt={userData.selectedAvatar.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {userData.firstName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Hover tooltip */}
          <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            <span className="text-sm text-foreground">
              {userData.firstName
                ? `${userData.firstName} ${userData.lastName || ""}`.trim()
                : "Profile"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
          <defs>
            <linearGradient
              id="lightGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#246CD8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#0052CC" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#246CD8" stopOpacity="0.05" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse
            cx="600"
            cy="400"
            rx="400"
            ry="200"
            stroke="#246CD8"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
            filter="url(#glow)"
          />

          <g
            className="animate-orbit-ellipse"
            style={{ transformOrigin: "600px 400px", animationDuration: "20s" }}
          >
            <g transform="translate(1000, 400)">
              <circle
                cx="0"
                cy="0"
                r="8"
                fill="#246CD8"
                opacity="0.6"
                filter="url(#glow)"
              />
              <path
                d="M-6,-6 L6,6 M6,-6 L-6,6 M0,-8 L0,8 M-8,0 L8,0"
                stroke="#0052CC"
                strokeWidth="1"
                opacity="0.8"
              />
            </g>
          </g>

          <g
            className="animate-orbit-ellipse-reverse"
            style={{ transformOrigin: "600px 400px", animationDuration: "25s" }}
          >
            <g transform="translate(200, 400)">
              <circle
                cx="0"
                cy="0"
                r="4"
                fill="#0052CC"
                opacity="0.7"
                filter="url(#glow)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="12"
                ry="6"
                stroke="#246CD8"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="6"
                ry="12"
                stroke="#246CD8"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </g>
          </g>

          <g
            className="animate-orbit-ellipse"
            style={{
              transformOrigin: "600px 400px",
              animationDuration: "30s",
              animationDelay: "10s",
            }}
          >
            <g transform="translate(600, 200)">
              <circle
                cx="0"
                cy="0"
                r="6"
                fill="#246CD8"
                opacity="0.6"
                filter="url(#glow)"
              />
              <path
                d="M0,0 L-15,-10 M0,0 L15,-10 M0,0 L-10,15 M0,0 L10,15"
                stroke="#0052CC"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <circle cx="-15" cy="-10" r="2" fill="#0052CC" opacity="0.5" />
              <circle cx="15" cy="-10" r="2" fill="#0052CC" opacity="0.5" />
            </g>
          </g>

          <g className="animate-float-slow" style={{ animationDuration: "8s" }}>
            <path
              d="M0,300 Q300,250 600,300 Q900,350 1200,300"
              stroke="url(#lightGradient)"
              strokeWidth="1"
              fill="none"
            />
          </g>
          <g
            className="animate-float-slow"
            style={{ animationDuration: "12s", animationDelay: "2s" }}
          >
            <path
              d="M0,500 Q400,450 800,500 Q1000,520 1200,500"
              stroke="url(#lightGradient)"
              strokeWidth="0.8"
              fill="none"
            />
          </g>

          <circle
            cx="150"
            cy="200"
            r="2"
            fill="#246CD8"
            opacity="0.4"
            className="animate-float-particle"
            style={{ animationDuration: "6s" }}
          />
          <circle
            cx="850"
            cy="150"
            r="1.5"
            fill="#0052CC"
            opacity="0.3"
            className="animate-float-particle"
            style={{ animationDuration: "8s", animationDelay: "1s" }}
          />
          <circle
            cx="300"
            cy="600"
            r="2.5"
            fill="#246CD8"
            opacity="0.5"
            className="animate-float-particle"
            style={{ animationDuration: "7s", animationDelay: "3s" }}
          />
        </svg>
      </div>

      <div className="relative z-10 pt-8 px-4">
        <div className="max-w-xl mx-auto flex justify-center">
          <JarvisConversation
            message={jarvisMessage}
            state={jarvisState}
            showTyping={currentStep === 2}
          />
        </div>
      </div>

      <div className="relative z-10 -mt-16">
        {currentStep === 2 && (
          <EmailVerification
            email={userData.email || ""}
            onNext={(code) => {
              updateUserData({ verificationCode: code });
              nextStep();
            }}
            onBack={() => router.push("/")}
          />
        )}

        {currentStep === 3 && (
          <BasicProfile
            onNext={(data) => {
              updateUserData(data);
              nextStep();
            }}
            onBack={prevStep}
          />
        )}

        {currentStep === 4 && (
          <InterestSelectionText
            onComplete={(interests) => {
              updateUserData({ interests });
              nextStep();
            }}
            onSkip={() => {
              updateUserData({ interests: [] });
              nextStep();
            }}
          />
        )}

        {currentStep === 5 && (
          <ProfilePictureSelection
            onComplete={(profileData) => {
              updateUserData(profileData);
              nextStep();
            }}
            onSkip={() => nextStep()}
            userInterests={userData.interests || []}
          />
        )}

        {currentStep === 6 && (
          <ResearcherSelection
            interests={userData.interests || []}
            onNext={(researcher) => {
              updateUserData({ favoriteResearcher: researcher });
              nextStep();
            }}
            onBack={prevStep}
          />
        )}

        {currentStep === 7 && (
          <PersonaAssignment
            userData={userData as any}
            favoriteResearcher={userData.favoriteResearcher}
            onComplete={(persona) => {
              updateUserData({ persona });
              nextStep();
            }}
          />
        )}

        {currentStep === 8 && (
          <WelcomeComplete
            userData={userData as UserData}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}

export { OnboardingContainer };
