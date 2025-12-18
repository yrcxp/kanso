"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ReaderSettings {
  // Theme presets
  theme: "compact" | "comfortable" | "spacious";
  
  // Font settings
  fontSize: number; // in px, range 14-28
  fontFamily: "bookerly" | "amazon-ember" | "noto-serif" | "system";
  
  // Layout settings
  marginHorizontal: number; // in px, range 0-48
  lineHeight: number; // multiplier, range 1.2-2.0
}

const defaultSettings: ReaderSettings = {
  theme: "comfortable",
  fontSize: 18,
  fontFamily: "bookerly",
  marginHorizontal: 16,
  lineHeight: 1.6,
};

// Theme presets
export const themePresets: Record<ReaderSettings["theme"], Partial<ReaderSettings>> = {
  compact: {
    fontSize: 16,
    marginHorizontal: 8,
    lineHeight: 1.4,
  },
  comfortable: {
    fontSize: 18,
    marginHorizontal: 16,
    lineHeight: 1.6,
  },
  spacious: {
    fontSize: 20,
    marginHorizontal: 24,
    lineHeight: 1.8,
  },
};

interface ReaderSettingsContextType {
  settings: ReaderSettings;
  updateSettings: (newSettings: Partial<ReaderSettings>) => void;
  applyThemePreset: (theme: ReaderSettings["theme"]) => void;
  resetSettings: () => void;
}

const ReaderSettingsContext = createContext<ReaderSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "kindle-reader-settings";

export const ReaderSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load reader settings:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.error("Failed to save reader settings:", e);
      }
    }
  }, [settings, isHydrated]);

  const updateSettings = (newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const applyThemePreset = (theme: ReaderSettings["theme"]) => {
    const preset = themePresets[theme];
    setSettings((prev) => ({ ...prev, ...preset, theme }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <ReaderSettingsContext.Provider
      value={{ settings, updateSettings, applyThemePreset, resetSettings }}
    >
      {children}
    </ReaderSettingsContext.Provider>
  );
};

export const useReaderSettings = () => {
  const context = useContext(ReaderSettingsContext);
  if (context === undefined) {
    throw new Error("useReaderSettings must be used within a ReaderSettingsProvider");
  }
  return context;
};

export { ReaderSettingsContext };

