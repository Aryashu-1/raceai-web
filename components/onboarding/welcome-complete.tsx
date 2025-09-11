"use client";

import { Button } from "@/components/ui/button";
import { AriaAssistant } from "@/components/aria-assistant";
import { useRouter } from "next/navigation";

interface WelcomeCompleteProps {
  userData: {
    firstName: string;
    lastName: string;
    role: string;
    interests: string[];
  };
  onComplete: () => void;
}

const actionCards = [
  {
    id: "explore",
    title: "Explore Research",
    description: "Browse papers and discover new insights",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    color:
      "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/30",
    route: "/explore",
  },
  {
    id: "ai-chat",
    title: "Chat with ARIA",
    description: "Get AI-powered research assistance",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    color:
      "bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 hover:border-blue-600/30",
    route: "/jarvis",
  },
  {
    id: "project",
    title: "Start a Project",
    description: "Organize your research workflow",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 1v6"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 1v6"
        />
      </svg>
    ),
    color:
      "bg-blue-700/10 border-blue-700/20 hover:bg-blue-700/20 hover:border-blue-700/30",
    route: "/projects",
  },
  {
    id: "connect",
    title: "Connect with Peers",
    description: "Collaborate with other researchers",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
    color:
      "bg-blue-800/10 border-blue-800/20 hover:bg-blue-800/20 hover:border-blue-800/30",
    route: "/collaborations",
  },
];

export default function WelcomeComplete({
  userData,
  onComplete,
}: WelcomeCompleteProps) {
  const router = useRouter();

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const handleEnterDashboard = () => {
    router.push("/jarvis");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="absolute top-8 right-8">
          <AriaAssistant
            size="medium"
            state="excited"
            message="Welcome to RACE AI!"
            showMessage={false}
          />
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome, {userData.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Your research command center is ready. Here's what you can do:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {actionCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                className={`p-4 rounded-xl border-2 ${card.color} hover:scale-105 transition-all cursor-pointer`}
              >
                <div className="mb-2">{card.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">
              Quick Start Tips:
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Try asking ARIA: "Find recent papers in my field"</li>
              <li>• Use the search to discover relevant research</li>
              <li>• Create projects to organize your work</li>
            </ul>
          </div>

          <Button onClick={handleEnterDashboard} className="w-full" size="lg">
            Enter Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
