"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import OnboardingContainer from "@/components/onboarding/onboarding-container";
import RaceGeometricLogo from "@/components/race-geometric-logo";
import Tesseract3D from "@/components/tesseract-3d";

const ResearchIcon = ({ type, size = 40 }) => {
  const icons = {
    dna: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path
          d="M8 8C12 12 16 16 20 20C24 16 28 12 32 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M8 32C12 28 16 24 20 20C24 24 28 28 32 32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
        <circle cx="30" cy="10" r="2" fill="currentColor" />
        <circle cx="10" cy="30" r="2" fill="currentColor" />
        <circle cx="30" cy="30" r="2" fill="currentColor" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
    atom: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <ellipse
          cx="20"
          cy="20"
          rx="15"
          ry="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          transform="rotate(0 20 20)"
        />
        <ellipse
          cx="20"
          cy="20"
          rx="15"
          ry="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          transform="rotate(60 20 20)"
        />
        <ellipse
          cx="20"
          cy="20"
          rx="15"
          ry="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          transform="rotate(120 20 20)"
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
      </svg>
    ),
    microscope: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="8" y="32" width="24" height="2" fill="currentColor" />
        <rect x="12" y="28" width="4" height="6" fill="currentColor" />
        <rect x="18" y="20" width="6" height="14" fill="currentColor" />
        <circle
          cx="21"
          cy="16"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <rect x="20" y="8" width="2" height="8" fill="currentColor" />
        <circle cx="21" cy="8" r="2" fill="currentColor" />
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="6" y="24" width="4" height="10" fill="currentColor" />
        <rect x="12" y="18" width="4" height="16" fill="currentColor" />
        <rect x="18" y="12" width="4" height="22" fill="currentColor" />
        <rect x="24" y="20" width="4" height="14" fill="currentColor" />
        <rect x="30" y="16" width="4" height="18" fill="currentColor" />
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path
          d="M12 8C8 8 6 12 8 16C6 18 8 22 12 22C14 26 18 28 22 26C26 28 30 26 32 22C36 22 38 18 36 16C38 12 36 8 32 8C28 6 24 8 22 12C20 8 16 6 12 8Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M16 14C18 16 22 16 24 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 18C16 20 20 20 22 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    book: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect
          x="8"
          y="6"
          width="24"
          height="28"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path d="M8 10L32 10" stroke="currentColor" strokeWidth="2" />
        <path d="M12 16L28 16" stroke="currentColor" strokeWidth="1" />
        <path d="M12 20L28 20" stroke="currentColor" strokeWidth="1" />
        <path d="M12 24L24 24" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    network: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="10" cy="10" r="3" fill="currentColor" />
        <circle cx="30" cy="10" r="3" fill="currentColor" />
        <circle cx="10" cy="30" r="3" fill="currentColor" />
        <circle cx="30" cy="30" r="3" fill="currentColor" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <path d="M13 13L17 17" stroke="currentColor" strokeWidth="2" />
        <path d="M23 17L27 13" stroke="currentColor" strokeWidth="2" />
        <path d="M13 27L17 23" stroke="currentColor" strokeWidth="2" />
        <path d="M23 23L27 27" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    molecule: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="28"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="20"
          cy="28"
          r="4"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path d="M16 12L24 12" stroke="currentColor" strokeWidth="2" />
        <path d="M14 16L18 24" stroke="currentColor" strokeWidth="2" />
        <path d="M26 16L22 24" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  };

  return <div className="text-blue-300">{icons[type]}</div>;
};

const AnimatedLogoFormation = () => {
  const logoSegments = [
    // Top edge
    { start: { x: 30, y: 0 }, end: { x: 70, y: 0 }, delay: 0 },
    // Top-right edge
    { start: { x: 70, y: 0 }, end: { x: 100, y: 30 }, delay: 0.5 },
    // Right edge
    { start: { x: 100, y: 30 }, end: { x: 100, y: 70 }, delay: 1 },
    // Bottom-right edge
    { start: { x: 100, y: 70 }, end: { x: 70, y: 100 }, delay: 1.5 },
    // Bottom edge
    { start: { x: 70, y: 100 }, end: { x: 30, y: 100 }, delay: 2 },
    // Bottom-left edge
    { start: { x: 30, y: 100 }, end: { x: 0, y: 70 }, delay: 2.5 },
    // Left edge
    { start: { x: 0, y: 70 }, end: { x: 0, y: 30 }, delay: 3 },
    // Top-left edge
    { start: { x: 0, y: 30 }, end: { x: 30, y: 0 }, delay: 3.5 },
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-32 h-32">
        {/* Converging lines from all directions */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = i * 22.5 * (Math.PI / 180);
          const distance = 60;
          const startX = Math.cos(angle) * distance;
          const startY = Math.sin(angle) * distance;

          return (
            <div
              key={`converging-${i}`}
              className="absolute top-1/2 left-1/2 w-16 h-px"
              style={{
                background: `linear-gradient(to right, transparent, #1E40AF80, #2563EB40)`,
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`,
                transformOrigin: "left center",
                animation: `convergeLine 20s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0,
              }}
            />
          );
        })}

        {/* Logo formation segments */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          style={{ animation: "logoFormation 25s ease-in-out infinite" }}
        >
          {logoSegments.map((segment, index) => (
            <line
              key={index}
              x1={segment.start.x}
              y1={segment.start.y}
              x2={segment.end.x}
              y2={segment.end.y}
              stroke="url(#raceLogoGradient)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="logo-segment"
              style={{
                animation: `segmentForm 25s ease-in-out infinite`,
                animationDelay: `${segment.delay + 8}s`,
                opacity: 0,
              }}
            />
          ))}

          <defs>
            <linearGradient
              id="raceLogoGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Central pulse when logo completes */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "#2563EB",
            animation: "centralPulse 25s ease-in-out infinite",
            animationDelay: "18s",
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
};

const FloatingCircularElements = ({ isReturningUser = false }) => {
  const orbitalElements = [
    {
      id: 1,
      type: "dna",
      size: 80,
      orbit: "inner",
      angle: 0,
      delay: 0,
      speed: 90,
      orbitRadius: 200,
    },
    {
      id: 2,
      type: "atom",
      size: 70,
      orbit: "middle",
      angle: 120,
      delay: 3,
      speed: 140,
      orbitRadius: 320,
    },
    {
      id: 3,
      type: "brain",
      size: 85,
      orbit: "outer",
      angle: 240,
      delay: 6,
      speed: 110,
      orbitRadius: 420,
    },
    {
      id: 4,
      type: "microscope",
      size: 75,
      orbit: "inner",
      angle: 180,
      delay: 9,
      speed: 80,
      orbitRadius: 180,
    },
    {
      id: 5,
      type: "chart",
      size: 80,
      orbit: "middle",
      angle: 300,
      delay: 12,
      speed: 160,
      orbitRadius: 350,
    },
    {
      id: 6,
      type: "network",
      size: 70,
      orbit: "outer",
      angle: 60,
      delay: 15,
      speed: 120,
      orbitRadius: 400,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {orbitalElements.map((element) => (
        <div
          key={element.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-500/10 to-blue-700/20 backdrop-blur-sm border border-blue-400/20 flex items-center justify-center shadow-2xl hover:scale-110 hover:rotate-12 transition-all duration-700 cursor-pointer group orbital-element hover:shadow-blue-400/50"
          style={{
            width: element.size,
            height: element.size,
            left: `50%`,
            top: `50%`,
            transform: `translate(-50%, -50%) rotate(${element.angle}deg) translateX(${element.orbitRadius}px) rotate(-${element.angle}deg)`,
            animation: `orbitalMotion${element.id} ${element.speed}s linear infinite`,
            animationDelay: `${element.delay}s`,
            filter:
              "drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.1))",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter =
              "drop-shadow(0 8px 24px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter =
              "drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.1))";
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/30 group-hover:from-blue-300/30 group-hover:to-blue-500/40 transition-all duration-700" />
          <div
            className="absolute inset-0 rounded-full animate-pulse opacity-40 group-hover:opacity-70 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)",
              filter: "blur(12px)",
              animation: `subtlePulse ${8 + element.id}s ease-in-out infinite`,
              animationDelay: `${element.delay * 0.5}s`,
            }}
          />

          <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
            <ResearchIcon type={element.type} size={element.size * 0.4} />
          </div>
        </div>
      ))}

      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={`dot-${i}`}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-60"
          style={{
            top: `${20 + i * 12}%`,
            left: `${15 + i * 15}%`,
            animation: `floatDot ${20 + i * 3}s ease-in-out infinite`,
            animationDelay: `${i * 2}s`,
            filter:
              "drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.2))",
          }}
        />
      ))}
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [userData, setUserData] = useState({});
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleOnboardingComplete = () => {
    // Handle onboarding completion logic here
    setShowOnboarding(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("race_ai_user");
    const hasVisited = localStorage.getItem("race_ai_visited");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.authenticated && user.keepSignedIn) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error parsing saved user:", error);
      }
    }

    if (hasVisited) {
      setIsReturningUser(true);
    } else {
      localStorage.setItem("race_ai_visited", "true");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error(
        "[v0] Event or event.target is undefined in handleInputChange"
      );
      return;
    }

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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

    if (isSignUp) {
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (formData.email && formData.password) {
          setUserData({
            email: formData.email,
            password: formData.password,
            authMethod: "email",
            keepSignedIn,
          });
          setShowOnboarding(true);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const signedInUser = {
          email: formData.email,
          authenticated: true,
          onboardingComplete: true,
          keepSignedIn,
          name: formData.email.split("@")[0],
        };

        localStorage.setItem("race_ai_user", JSON.stringify(signedInUser));
        router.push("/jarvis");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setFormErrors({ email: "Authentication failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeBack = () => {
    router.push("/jarvis");
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
    <div className="min-h-screen relative overflow-hidden bg-background">
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <Tesseract3D />
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <FloatingCircularElements isReturningUser={isReturningUser} />
        <AnimatedLogoFormation />

        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px"
              style={{
                top: `${i * 5}%`,
                background: `linear-gradient(to right, transparent, #1E40AF30, transparent)`,
                animation: `gridPulse ${8 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px"
              style={{
                left: `${i * 5}%`,
                background: `linear-gradient(to bottom, transparent, #1E40AF30, transparent)`,
                animation: `gridPulse ${8 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[120vh] h-[120vh] border border-primary/20 rounded-full animate-spin-ultra-slow" />
          <div
            className="absolute w-[90vh] h-[90vh] border border-primary/15 rounded-full animate-spin-ultra-slow"
            style={{ animationDirection: "reverse", animationDuration: "120s" }}
          />
          <div
            className="absolute w-[60vh] h-[60vh] border border-primary/25 rounded-full animate-spin-ultra-slow"
            style={{ animationDuration: "80s" }}
          />

          <div className="absolute inset-0">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-[50vh] h-px origin-left"
                style={{
                  background: `linear-gradient(to right, #1E40AF30, transparent, #1E40AF30)`,
                  transform: `translateY(-50%) rotate(${i * 45}deg)`,
                  animation: `connectionPulse ${
                    6 + i * 0.5
                  }s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-primary rounded-full animate-pulse" />
          <div
            className="absolute top-[70%] right-[25%] w-2 h-2 bg-accent rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[30%] left-[20%] w-4 h-4 bg-primary rounded-full animate-pulse"
            style={{ animationDelay: "4s" }}
          />
          <div
            className="absolute top-[40%] right-[15%] w-3 h-3 bg-accent rounded-full animate-pulse"
            style={{ animationDelay: "6s" }}
          />
        </div>

        <div className="absolute inset-0">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `particleFloat ${15 + i * 2}s linear infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
          <div className="max-w-2xl">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <RaceGeometricLogo
                  size={48}
                  variant="primary"
                  showText={true}
                />
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div className="relative">
                {isReturningUser && !currentUser ? (
                  <h2
                    className="text-6xl font-bold text-foreground leading-tight"
                    style={{
                      textShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                      fontFamily: "'Satoshi', 'Inter', sans-serif",
                    }}
                  >
                    Research made
                    <span className="text-primary">
                      <i> simple</i>
                    </span>
                  </h2>
                ) : (
                  <h2
                    className="text-6xl font-bold text-foreground leading-tight"
                    style={{
                      textShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)",
                      fontFamily: "'Satoshi', 'Inter', sans-serif",
                    }}
                  >
                    Research made
                    <span className="text-primary"> simple</span>
                  </h2>
                )}

                <div
                  className="absolute top-full left-0 text-6xl font-bold leading-tight opacity-20 transform scale-y-[-1] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter:
                      "blur(1px) drop-shadow(0 2px 8px rgba(255, 255, 255, 0.1))",
                    maskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 60%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 60%)",
                    fontFamily: "'Satoshi', 'Inter', sans-serif",
                  }}
                >
                  {isReturningUser && !currentUser ? (
                    <>
                      Welcome back to
                      <span className="text-blue-400"> RACE</span>
                    </>
                  ) : (
                    <>
                      Research made
                      <span className="text-blue-400"> simple</span>
                    </>
                  )}
                </div>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                {isReturningUser && !currentUser
                  ? "Ready to continue your research journey? JARVIS is here to help you discover, organize, and collaborate on research like never before."
                  : "Ready to continue your research journey? JARVIS is here to help you discover, organize, and collaborate on research like never before."}
              </p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4 group">
                <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-125 transition-transform" />
                <div>
                  <span className="text-white font-semibold">
                    Intelligent paper discovery and analysis
                  </span>
                  <p className="text-blue-200 text-sm mt-1">
                    AI-powered insights that help you understand complex
                    research papers in minutes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-125 transition-transform" />
                <div>
                  <span className="text-white font-semibold">
                    Seamless collaboration with peers and mentors
                  </span>
                  <p className="text-blue-200 text-sm mt-1">
                    Work together in real-time, share insights, and build
                    knowledge as a team
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-125 transition-transform" />
                <div>
                  <span className="text-white font-semibold">
                    Progress tracking and milestone management
                  </span>
                  <p className="text-blue-200 text-sm mt-1">
                    Stay organized with intelligent project management and
                    research goal tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-lg lg:w-[500px] flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div
              className="race-card p-10 relative overflow-hidden"
              style={{
                background: "var(--card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl" />

              <div className="mb-8 text-center relative z-10">
                {currentUser ? (
                  <>
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      Welcome back, {currentUser.name}!
                    </h3>
                    <p className="text-muted-foreground">
                      Ready to continue your research?
                    </p>
                    <button
                      onClick={handleWelcomeBack}
                      className="mt-6 w-full race-btn-primary py-4 rounded-xl font-semibold text-base transform hover:scale-105 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Continue to Dashboard</span>
                        <ArrowRight size={18} />
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      Get started
                    </h3>
                    <p className="text-muted-foreground">Get. Set. Race.</p>
                  </>
                )}
              </div>

              {!currentUser && (
                <>
                  <div className="flex bg-muted rounded-xl p-1 mb-8 relative z-10">
                    <button
                      onClick={() => setIsSignUp(false)}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        !isSignUp
                          ? "race-btn-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsSignUp(true)}
                      className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        isSignUp
                          ? "race-btn-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@university.edu"
                        className="race-input w-full"
                      />
                      {formErrors.email && (
                        <p className="text-destructive text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        {isSignUp ? "Create password" : "Password"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`race-input w-full pr-12 ${
                            formErrors.password ? "border-red-400" : ""
                          }`}
                          placeholder={
                            isSignUp
                              ? "Create a secure password"
                              : "Enter your password"
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="mt-1 text-sm text-red-400">
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    {isSignUp && (
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Confirm password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`race-input w-full pr-12 ${
                              formErrors.confirmPassword ? "border-red-400" : ""
                            }`}
                            placeholder="Re-enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                        {formErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-400">
                            {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setKeepSignedIn(!keepSignedIn)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          keepSignedIn
                            ? "bg-primary border-primary"
                            : "border-border hover:border-foreground/50"
                        }`}
                      >
                        {keepSignedIn && (
                          <Check size={12} className="text-white" />
                        )}
                      </button>
                      <label
                        onClick={() => setKeepSignedIn(!keepSignedIn)}
                        className="text-sm text-muted-foreground cursor-pointer select-none"
                      >
                        Keep me signed in
                      </label>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full race-btn-primary py-4 rounded-xl font-semibold text-base transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Please wait...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>
                            {isSignUp ? "Continue with JARVIS" : "Sign In"}
                          </span>
                          <ArrowRight size={18} />
                        </div>
                      )}
                    </button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-background px-4 text-muted-foreground">
                          or continue with
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const { signInWithGoogle } = await import(
                              "@/lib/google-auth"
                            );
                            const result = await signInWithGoogle();
                            if (result.success) {
                              setUserData({
                                method: "google",
                                email: result.user.email,
                                name: result.user.name,
                                avatar: result.user.picture,
                              });
                              setShowOnboarding(true);
                            }
                          } catch (error) {
                            setFormErrors({
                              email: "Google sign-in failed. Please try again.",
                            });
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-muted border border-border rounded-xl text-foreground font-medium hover:bg-muted transform hover:scale-105 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.84c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23 7.7 23 3.99 20.53 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            const dropdown =
                              document.getElementById("sso-dropdown");
                            dropdown.classList.toggle("hidden");
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-muted border border-border rounded-xl text-foreground font-medium hover:bg-muted transform hover:scale-105 transition-all duration-200"
                        >
                          🔐 SSO
                        </button>

                        <div
                          id="sso-dropdown"
                          className="hidden absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-50"
                          style={{
                            boxShadow:
                              "0 10px 25px rgba(255, 255, 255, 0.1), 0 5px 15px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <div className="space-y-3">
                            <button
                              onClick={async () => {
                                const email = prompt(
                                  "Enter your email address:"
                                );
                                if (email && /\S+@\S+\.\S+/.test(email)) {
                                  try {
                                    const { sendEmailOTP } = await import(
                                      "@/lib/sso-auth"
                                    );
                                    await sendEmailOTP(email);
                                    const otp = prompt(
                                      "Enter the OTP sent to your email:"
                                    );
                                    if (otp) {
                                      const { verifyOTP } = await import(
                                        "@/lib/sso-auth"
                                      );
                                      const result = await verifyOTP(
                                        email,
                                        otp
                                      );
                                      if (result.success) {
                                        setUserData({
                                          method: "email-otp",
                                          email,
                                        });
                                        setShowOnboarding(true);
                                      } else {
                                        setFormErrors({
                                          email:
                                            "Invalid OTP. Please try again.",
                                        });
                                      }
                                    }
                                  } catch (error) {
                                    setFormErrors({
                                      email:
                                        "Failed to send OTP. Please try again.",
                                    });
                                  }
                                } else {
                                  setFormErrors({
                                    email:
                                      "Please enter a valid email address.",
                                  });
                                }
                                document
                                  .getElementById("sso-dropdown")
                                  .classList.add("hidden");
                              }}
                              className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600/20 rounded-lg transform hover:scale-105 transition-all duration-200"
                            >
                              📧 Email OTP
                            </button>
                            <button
                              onClick={async () => {
                                const phone = prompt(
                                  "Enter your phone number:"
                                );
                                if (phone && /^\+?[\d\s-()]+$/.test(phone)) {
                                  try {
                                    const { sendPhoneOTP } = await import(
                                      "@/lib/sso-auth"
                                    );
                                    await sendPhoneOTP(phone);
                                    const otp = prompt(
                                      "Enter the OTP sent to your phone:"
                                    );
                                    if (otp) {
                                      const { verifyOTP } = await import(
                                        "@/lib/sso-auth"
                                      );
                                      const result = await verifyOTP(
                                        phone,
                                        otp
                                      );
                                      if (result.success) {
                                        setUserData({
                                          method: "phone-otp",
                                          phone,
                                        });
                                        setShowOnboarding(true);
                                      } else {
                                        setFormErrors({
                                          email:
                                            "Invalid OTP. Please try again.",
                                        });
                                      }
                                    }
                                  } catch (error) {
                                    setFormErrors({
                                      email:
                                        "Failed to send OTP. Please try again.",
                                    });
                                  }
                                } else {
                                  setFormErrors({
                                    email: "Please enter a valid phone number.",
                                  });
                                }
                                document
                                  .getElementById("sso-dropdown")
                                  .classList.add("hidden");
                              }}
                              className="w-full text-left px-3 py-2 text-blue-100 hover:bg-blue-600/20 rounded-lg transform hover:scale-105 transition-all duration-200"
                            >
                              📱 Phone OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <button
                        type="button"
                        onClick={() => router.push("/demo")}
                        className="text-sm text-blue-300 hover:text-white transform hover:scale-105 transition-all duration-200"
                      >
                        Take a look at our demo
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
