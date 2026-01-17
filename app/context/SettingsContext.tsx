"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SettingsState {
  notifications: {
    email: boolean;
    push: boolean;
    research: boolean;
    collaborations: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    researchVisible: boolean;
    shareByDefault: boolean;
    dataRetention: string;
  };
  ai: {
     defaultModel: string;
     researchModel: string;
     autoSave: boolean;
     contextMemory: boolean;
     researchMode: boolean;
  };
  interface: {
     theme: "dark" | "light" | "system";
     compactMode: boolean;
     showGrid: boolean;
     autoCollapseSidebar: boolean;
     fontSize: "small" | "medium" | "large";
  };
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (section: keyof SettingsState, data: Partial<any>) => void;
}

const defaultSettings: SettingsState = {
  notifications: {
    email: true,
    push: false,
    research: true,
    collaborations: true,
    updates: false
  },
  privacy: {
    profileVisible: true,
    researchVisible: false,
    shareByDefault: false,
    dataRetention: "1-year"
  },
  ai: {
    defaultModel: "gpt-4o",
    researchModel: "claude-3",
    autoSave: true,
    contextMemory: true,
    researchMode: true
  },
  interface: {
    theme: "system",
    compactMode: false,
    showGrid: true,
    autoCollapseSidebar: true,
    fontSize: "medium"
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("raceai-settings");
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
       localStorage.setItem("raceai-settings", JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (section: keyof SettingsState, data: Partial<any>) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
