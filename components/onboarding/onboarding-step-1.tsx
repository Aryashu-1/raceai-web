"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import ARIAAssistant, {
  useARIAConversation,
} from "@/components/aria-assistant";
import { cn } from "@/lib/utils";

interface OnboardingStep1Props {
  onNext: () => void;
  onSkip: () => void;
  className?: string;
}

export default function OnboardingStep1({
  onNext,
  onSkip,
  className,
}: OnboardingStep1Props) {
  const { currentState, currentMessage, speak, idle } = useARIAConversation();

  React.useEffect(() => {
    // ARIA introduction sequence
    const timer = setTimeout(() => {
      speak(
        "Hi there! I'm ARIA, your AI research assistant. I'll help you get set up in under 60 seconds. Ready to supercharge your research?"
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [speak]);

  const handleGetStarted = () => {
    speak(
      "Excellent! Let's get you set up with the perfect research environment.",
      "excited"
    );
    setTimeout(onNext, 2000);
  };

  const handleSkipToDemo = () => {
    speak("No problem! Feel free to explore and come back when you're ready.");
    setTimeout(onSkip, 1500);
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center relative overflow-hidden",
        className
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1D1D1D] via-[#1D1D1D] to-[#2A2A2A]">
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border border-[#246CD8]/30 rounded-full animate-pulse" />
          <div
            className="absolute bottom-32 right-16 w-24 h-24 border border-[#0052CC]/30 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 border border-[#246CD8]/30 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-20 h-20 border border-[#0052CC]/30 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#246CD8]/5 via-transparent to-[#0052CC]/5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* ARIA Assistant */}
        <ARIAAssistant
          size={140}
          state={currentState}
          message={currentMessage}
          onMessageComplete={() => idle()}
          className="mb-8"
        />

        {/* Welcome Content */}
        <div className="text-white mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome to RACE AI
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Research Accessible by Everyone
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-[#246CD8] to-[#0052CC] hover:from-[#0052CC] hover:to-[#246CD8] text-white px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Let's Go! 🚀
          </Button>

          <Button
            onClick={handleSkipToDemo}
            variant="outline"
            className="border-[#246CD8] text-[#246CD8] hover:bg-[#246CD8] hover:text-white px-8 py-3 text-lg rounded-full transition-all duration-300 bg-transparent"
          >
            Explore First
          </Button>
        </div>

        {/* Sign In Link */}
        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={onSkip}
              className="text-[#0052CC] hover:text-[#246CD8] underline transition-colors"
            >
              Sign me in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
