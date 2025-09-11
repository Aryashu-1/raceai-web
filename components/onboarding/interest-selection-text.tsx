"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AriaAssistant } from "@/components/aria-assistant";
import { Search, X } from "lucide-react";

const RESEARCH_DOMAINS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Robotics",
  "Data Science",
  "Bioinformatics",
  "Computational Biology",
  "Neuroscience",
  "Psychology",
  "Cognitive Science",
  "Physics",
  "Chemistry",
  "Materials Science",
  "Biomedical Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Environmental Science",
  "Climate Science",
  "Astronomy",
  "Astrophysics",
  "Mathematics",
  "Statistics",
  "Economics",
  "Finance",
  "Marketing",
  "Business Analytics",
  "Operations Research",
  "Social Sciences",
  "Political Science",
  "Anthropology",
  "Sociology",
  "Education",
  "Medicine",
  "Public Health",
  "Epidemiology",
  "Genetics",
  "Molecular Biology",
  "Biochemistry",
  "Pharmacology",
  "Immunology",
  "Microbiology",
  "Ecology",
];

interface InterestSelectionTextProps {
  onComplete: (interests: string[]) => void;
  onSkip: () => void;
}

const InterestSelectionText: React.FC<InterestSelectionTextProps> = ({
  onComplete,
  onSkip,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [ariaMessage, setAriaMessage] = useState("");

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = RESEARCH_DOMAINS.filter((domain) =>
        domain.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8);
      setFilteredDomains(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (selectedInterests.length === 0) {
      setAriaMessage(
        "What research areas spark your curiosity? Start typing to see suggestions!"
      );
    } else if (selectedInterests.length === 1) {
      setAriaMessage(
        "Great choice! Feel free to add 1-2 more areas or continue if you're ready."
      );
    } else if (selectedInterests.length >= 2) {
      setAriaMessage(
        "Perfect! I can already see some exciting research possibilities for you."
      );
    }
  }, [selectedInterests]);

  const handleAddInterest = (interest: string) => {
    if (!selectedInterests.includes(interest) && selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest]);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter((i) => i !== interest));
  };

  const handleContinue = () => {
    if (selectedInterests.length > 0) {
      onComplete(selectedInterests);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* ARIA Assistant */}
        <div className="flex justify-center mb-4">
          <AriaAssistant
            state="speaking"
            size="lg"
            message={ariaMessage}
            showMessage={true}
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            What drives your research?
          </h2>
          <p className="text-[#C3DDFF] text-lg">
            Tell me about your research interests so I can personalize your
            experience
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#C3DDFF]/60 w-5 h-5" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type your research areas (e.g., Machine Learning, Neuroscience...)"
              className="w-full pl-12 pr-4 py-4 bg-white/5 border-white/20 text-white placeholder:text-[#C3DDFF]/50 rounded-xl text-lg focus:border-[#246CD8] focus:ring-2 focus:ring-[#246CD8]/20 transition-all duration-200"
              onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredDomains.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
              {filteredDomains.map((domain, index) => (
                <button
                  key={index}
                  onClick={() => handleAddInterest(domain)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                  disabled={
                    selectedInterests.includes(domain) ||
                    selectedInterests.length >= 3
                  }
                >
                  <span
                    className={
                      selectedInterests.includes(domain) ? "opacity-50" : ""
                    }
                  >
                    {domain}
                  </span>
                  {selectedInterests.includes(domain) && (
                    <span className="text-[#246CD8] ml-2">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Interests */}
        {selectedInterests.length > 0 && (
          <div className="mb-8">
            <p className="text-[#C3DDFF] mb-4 text-center">
              Selected interests ({selectedInterests.length}/3):
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {selectedInterests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gradient-to-r from-[#246CD8]/20 to-[#0052CC]/20 text-white border border-[#246CD8]/30 px-4 py-2 text-sm hover:from-[#246CD8]/30 hover:to-[#0052CC]/30 transition-all duration-200"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-[#C3DDFF] hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onSkip}
            variant="outline"
            className="px-8 py-3 bg-white/5 border-white/20 text-[#C3DDFF] hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedInterests.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-[#246CD8] to-[#0052CC] hover:from-[#0052CC] hover:to-[#246CD8] text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#246CD8]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with ARIA →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterestSelectionText;
