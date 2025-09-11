"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AriaAssistant } from "@/components/aria-assistant";
import { Upload } from "lucide-react";

interface ProfilePictureSelectionProps {
  onComplete: (profileData: {
    profilePicture: string;
    profileType: "upload" | "avatar";
    selectedAvatar?: any;
  }) => void;
  onSkip: () => void;
  userInterests: string[];
}

const ProfilePictureSelection: React.FC<ProfilePictureSelectionProps> = ({
  onComplete,
  onSkip,
  userInterests,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectionType, setSelectionType] = useState<
    "avatar" | "upload" | null
  >(null);
  const [ariaMessage, setAriaMessage] = useState("");
  const [dynamicAvatars, setDynamicAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const hardcodedAvatars = [
    {
      name: "Albert Einstein",
      field: "Physics",
      description:
        "Revolutionary physicist who developed the theory of relativity",
      avatar: "/cartoon-einstein-with-wild-hair-and-mustache.png",
    },
    {
      name: "Marie Curie",
      field: "Chemistry & Physics",
      description:
        "First woman to win a Nobel Prize and pioneer in radioactivity research",
      avatar: "/cartoon-marie-curie-with-lab-coat-and-radium-glow.png",
    },
    {
      name: "Stephen Hawking",
      field: "Theoretical Physics",
      description:
        "Brilliant cosmologist who made groundbreaking discoveries about black holes",
      avatar: "/cartoon-stephen-hawking-with-wheelchair-and-stars.png",
    },
    {
      name: "Isaac Newton",
      field: "Mathematics & Physics",
      description: "Father of classical mechanics and calculus",
      avatar: "/cartoon-isaac-newton-with-apple-and-wig.png",
    },
    {
      name: "Alan Turing",
      field: "Computer Science",
      description: "Father of computer science and artificial intelligence",
      avatar: "/cartoon-alan-turing-with-computer-and-enigma-machi.png",
    },
    {
      name: "Sundar Pichai",
      field: "Technology",
      description: "CEO of Google and Alphabet, leading AI innovation",
      avatar: "/cartoon-sundar-pichai-with-google-colors-and-tech-.png",
    },
    {
      name: "Elon Musk",
      field: "Technology & Space",
      description:
        "Entrepreneur advancing space exploration and sustainable technology",
      avatar: "/cartoon-elon-musk-with-rocket-and-tesla-car.png",
    },
    {
      name: "Bill Gates",
      field: "Technology & Philanthropy",
      description: "Microsoft co-founder and global health advocate",
      avatar: "/cartoon-bill-gates-with-microsoft-logo-and-glasses.png",
    },
  ];

  useEffect(() => {
    const fetchDynamicAvatars = async () => {
      if (!userInterests || userInterests.length === 0) {
        setDynamicAvatars([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("/api/search-avatars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interests: userInterests }),
        });

        if (response.ok) {
          const data = await response.json();
          setDynamicAvatars(data.avatars || []);
        } else {
          console.error("Failed to fetch dynamic avatars");
          setDynamicAvatars([]);
        }
      } catch (error) {
        console.error("Error fetching dynamic avatars:", error);
        setDynamicAvatars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDynamicAvatars();
  }, [userInterests]);

  useEffect(() => {
    const relevantFields = userInterests?.join(", ") || "your research areas";
    setAriaMessage(
      `Perfect! Now let's add a personal touch. Choose a profile picture that represents you, or get inspired by a legendary researcher in ${relevantFields}!`
    );
  }, [userInterests]);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setSelectionType("avatar");
    setUploadedImage(null);
    setAriaMessage(
      `Great choice! ${avatar.name} is an incredible inspiration. ${avatar.description}`
    );
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result);
        setSelectionType("upload");
        setSelectedAvatar(null);
        setAriaMessage(
          "Perfect! Your own photo adds a personal touch to your research profile."
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (selectionType === "avatar" && selectedAvatar) {
      onComplete({
        profilePicture: selectedAvatar.avatar,
        profileType: "avatar",
        selectedAvatar: selectedAvatar,
      });
    } else if (selectionType === "upload" && uploadedImage) {
      onComplete({
        profilePicture: uploadedImage,
        profileType: "upload",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-full animate-float-slow"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-400/15 to-blue-500/5 rounded-full animate-float-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-blue-600/10 to-blue-700/5 rounded-full animate-float-slow"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-full animate-float-slow"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Floating research icons with subtle light effects */}
        <div
          className="absolute top-1/4 left-1/3 animate-float-particle"
          style={{ animationDelay: "3s" }}
        >
          <svg
            className="w-16 h-16 text-blue-400/20 drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div
          className="absolute top-1/2 right-1/4 animate-float-particle"
          style={{ animationDelay: "5s" }}
        >
          <svg
            className="w-12 h-12 text-blue-300/15 drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7.01 5 5 7.01 5 9.5S7.01 14 9.5 14 14 11.99 14 9.5 11.99 5 9.5 5z" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* ARIA Assistant */}
        <div className="flex justify-center mb-8">
          <AriaAssistant
            state="speaking"
            size="lg"
            message={ariaMessage}
            showMessage={true}
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Choose your research persona
          </h2>
          <p className="text-muted-foreground text-lg">
            Add a profile picture or get inspired by legendary researchers
          </p>
        </div>

        {/* Upload Option */}
        <div className="mb-8">
          <div className="backdrop-blur-sm bg-card/80 border border-border/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
              Upload Your Photo
            </h3>
            <div className="flex justify-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div
                  className={`w-32 h-32 rounded-full border-2 border-dashed transition-all duration-200 flex items-center justify-center hover:scale-105 ${
                    uploadedImage
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-border hover:border-blue-500 hover:bg-accent/50"
                  }`}
                >
                  {uploadedImage ? (
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Upload
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-muted-foreground mt-2">
              Finding researchers in your field...
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              Get Inspired by Legendary Researchers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hardcodedAvatars.map((avatar, index) => (
                <div
                  key={`avatar-${index}`}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`cursor-pointer backdrop-blur-sm border rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                    selectedAvatar?.name === avatar.name
                      ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20"
                      : "bg-card/80 border-border/50 hover:bg-accent/50 hover:border-border"
                  }`}
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/20 flex items-center justify-center">
                    <img
                      src={avatar.avatar || "/placeholder.svg"}
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-foreground font-medium text-sm mb-1">
                    {avatar.name}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    {avatar.field}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={onSkip}
            variant="outline"
            className="px-8 py-3 rounded-xl transition-all duration-200 bg-transparent hover:scale-105"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectionType}
            className="px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with ARIA →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSelection;
