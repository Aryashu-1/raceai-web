"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AriaAssistant } from "@/components/aria-assistant";
import { ChevronLeft, Star, Loader2 } from "lucide-react";

interface Researcher {
  id: string;
  name: string;
  field: string;
  institution: string;
  citations: string;
  image: string;
  description: string;
  tags: string[];
}

interface ResearcherSelectionProps {
  interests: string[];
  onNext: (favoriteResearcher: Researcher | null) => void;
  onBack: () => void;
}

const fetchResearchersByInterests = async (
  interests: string[]
): Promise<Researcher[]> => {
  try {
    const researchers: Researcher[] = [];

    for (const interest of interests.slice(0, 3)) {
      // Limit to 3 interests to avoid too many API calls
      const query = `top influential researchers in ${interest} field 2024`;

      const response = await fetch("/api/search-researchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, interest }),
      });

      if (response.ok) {
        const data = await response.json();
        researchers.push(...data.researchers);
      }
    }

    return researchers.slice(0, 6); // Return max 6 researchers
  } catch (error) {
    console.error("Error fetching researchers:", error);
    return getFallbackResearchers(interests);
  }
};

const getFallbackResearchers = (interests: string[]): Researcher[] => {
  const allResearchers: Record<string, Researcher[]> = {
    "Artificial Intelligence": [
      {
        id: "1",
        name: "Dr. Fei-Fei Li",
        field: "Computer Vision & AI",
        institution: "Stanford University",
        citations: "180K+",
        image: "/professional-woman-researcher.png",
        description:
          "Pioneer in computer vision and AI ethics, co-director of Stanford HAI",
        tags: ["Computer Vision", "AI Ethics", "Deep Learning"],
      },
      {
        id: "2",
        name: "Dr. Yoshua Bengio",
        field: "Deep Learning",
        institution: "University of Montreal",
        citations: "200K+",
        image: "/professional-man-researcher.png",
        description:
          "Turing Award winner, pioneer of deep learning and neural networks",
        tags: ["Deep Learning", "Neural Networks", "AI Safety"],
      },
    ],
    "Machine Learning": [
      {
        id: "3",
        name: "Dr. Andrew Ng",
        field: "Machine Learning",
        institution: "Stanford University",
        citations: "150K+",
        image: "/professional-asian-man-researcher.png",
        description:
          "Co-founder of Coursera, former head of Baidu AI and Google Brain",
        tags: ["Machine Learning", "Online Education", "AI Applications"],
      },
    ],
    "Data Science": [
      {
        id: "4",
        name: "Dr. Cathy O'Neil",
        field: "Data Science & Ethics",
        institution: "Author & Consultant",
        citations: "25K+",
        image: "/professional-woman-data-scientist.png",
        description:
          "Author of 'Weapons of Math Destruction', expert in algorithmic bias",
        tags: ["Data Ethics", "Algorithmic Bias", "Social Impact"],
      },
    ],
    Neuroscience: [
      {
        id: "5",
        name: "Dr. Antonio Damasio",
        field: "Neuroscience",
        institution: "USC",
        citations: "120K+",
        image: "/professional-neuroscientist.png",
        description:
          "Leading researcher in emotion, decision-making, and consciousness",
        tags: ["Consciousness", "Emotion", "Decision Making"],
      },
    ],
    Psychology: [
      {
        id: "6",
        name: "Dr. Daniel Kahneman",
        field: "Behavioral Psychology",
        institution: "Princeton University",
        citations: "300K+",
        image: "/professional-elderly-psychologist.png",
        description: "Nobel Prize winner, pioneer of behavioral economics",
        tags: ["Behavioral Economics", "Cognitive Bias", "Decision Theory"],
      },
    ],
  };

  const relevantResearchers: Researcher[] = [];
  interests.forEach((interest) => {
    if (allResearchers[interest]) {
      relevantResearchers.push(...allResearchers[interest]);
    }
  });

  if (relevantResearchers.length === 0) {
    return Object.values(allResearchers).flat().slice(0, 6);
  }

  return relevantResearchers.slice(0, 6);
};

export default function ResearcherSelection({
  interests,
  onNext,
  onBack,
}: ResearcherSelectionProps) {
  const [selectedResearcher, setSelectedResearcher] =
    useState<Researcher | null>(null);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ariaMessage, setAriaMessage] = useState(
    "Let me find some influential researchers based on your interests. This might take a moment..."
  );

  useEffect(() => {
    const loadResearchers = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedResearchers = await fetchResearchersByInterests(interests);
        setResearchers(fetchedResearchers);
        setAriaMessage(
          `Based on your interests in ${interests.join(
            ", "
          )}, here are some influential researchers you might find inspiring. Choose one that resonates with you, or skip if you prefer!`
        );
      } catch (err) {
        setError("Failed to load researchers. Showing fallback options.");
        setResearchers(getFallbackResearchers(interests));
        setAriaMessage(
          "I had trouble finding researchers, but here are some great options based on your interests!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (interests.length > 0) {
      loadResearchers();
    } else {
      setResearchers(getFallbackResearchers([]));
      setLoading(false);
    }
  }, [interests]);

  const handleResearcherSelect = (researcher: Researcher) => {
    setSelectedResearcher(researcher);
    setAriaMessage(
      `Great choice! ${
        researcher.name
      } is known for ${researcher.description.toLowerCase()}`
    );
  };

  const handleContinue = () => {
    onNext(selectedResearcher);
  };

  const handleSkip = () => {
    setAriaMessage(
      "No problem! You can always explore researchers later in your dashboard."
    );
    onNext(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <AriaAssistant
              state={loading ? "thinking" : "speaking"}
              message={ariaMessage}
              size="md"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Top Researchers You'd Like to Follow
          </h1>
          <p className="text-muted-foreground">
            Select a researcher whose work inspires you, or skip this step to
            continue.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Finding researchers in your field...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-4 mb-6">
            <p className="text-amber-600 text-sm">{error}</p>
          </div>
        )}

        {/* Researchers Grid */}
        {!loading && researchers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {researchers.map((researcher) => (
              <Card
                key={researcher.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                  selectedResearcher?.id === researcher.id
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => handleResearcherSelect(researcher)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={researcher.image || "/placeholder.svg"}
                      alt={researcher.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate">
                        {researcher.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {researcher.field} • {researcher.institution}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs">
                            {researcher.citations}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {researcher.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {researcher.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-1 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="px-6 bg-transparent"
            >
              Skip
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedResearcher && !loading}
              className="px-8"
            >
              {selectedResearcher ? "Continue" : "Continue without selection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
