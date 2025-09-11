"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AriaAssistant } from "@/components/aria-assistant";

interface InterestSelectionProps {
  onNext: (interests: string[]) => void;
  onBack: () => void;
}

const interestCategories = [
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: "🤖",
    description: "Neural networks, deep learning, NLP",
  },
  {
    id: "biotech",
    name: "Biotechnology",
    icon: "🧬",
    description: "Genetics, bioengineering, pharmaceuticals",
  },
  {
    id: "physics",
    name: "Physics",
    icon: "⚛️",
    description: "Quantum mechanics, astrophysics, materials",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "🧪",
    description: "Organic, inorganic, analytical chemistry",
  },
  {
    id: "social",
    name: "Social Sciences",
    icon: "👥",
    description: "Psychology, sociology, anthropology",
  },
  {
    id: "economics",
    name: "Economics",
    icon: "📊",
    description: "Microeconomics, finance, behavioral economics",
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "⚙️",
    description: "Mechanical, electrical, civil engineering",
  },
  {
    id: "medicine",
    name: "Medicine",
    icon: "🏥",
    description: "Clinical research, public health, epidemiology",
  },
];

export default function InterestSelection({
  onNext,
  onBack,
}: InterestSelectionProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((id) => id !== interestId);
      } else if (prev.length < 3) {
        return [...prev, interestId];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedInterests.length > 0) {
      onNext(selectedInterests);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="absolute top-8 right-8">
          <AriaAssistant
            size="small"
            message="Pick 1-3 areas you're interested in"
            showMessage={false}
          />
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50">
          <div className="text-center mb-8">
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Research Interests
            </h1>
            <p className="text-muted-foreground">
              Select 1-3 areas to personalize your research experience
            </p>
            <p className="text-sm text-primary mt-2">
              {selectedInterests.length} of 3 selected
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {interestCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleInterest(category.id)}
                disabled={
                  !selectedInterests.includes(category.id) &&
                  selectedInterests.length >= 3
                }
                className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedInterests.includes(category.id)
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-foreground mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 bg-transparent"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedInterests.length === 0}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
