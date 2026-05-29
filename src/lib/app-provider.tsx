"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BootSplash } from "@/components/boot-splash";
import { CommandPalette } from "@/components/command-palette";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  toggleTheme: () => void;
  search: string;
  setSearch: (v: string) => void;
  replayBoot: () => void;
}

const AppContext = createContext<AppState | null>(null);

const THEME_KEY = "sentinel:theme";
const BOOT_KEY = "sentinel:boot-shown";

function readInitialTheme(): Theme {
  // Sentinel defaults to dark (SOC command-center aesthetic).
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [showBoot, setShowBoot] = useState(false);

  useEffect(() => {
    setTheme(readInitialTheme());
    setHydrated(true);

    // Show boot splash once per browser session.
    try {
      const seen = window.sessionStorage.getItem(BOOT_KEY);
      if (!seen) setShowBoot(true);
    } catch {
      setShowBoot(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const handleBootDone = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOT_KEY, "1");
    } catch {
      /* sessionStorage may be unavailable in private mode */
    }
    setShowBoot(false);
  }, []);

  const replayBoot = useCallback(() => {
    setShowBoot(true);
  }, []);

  const value = useMemo<AppState>(
    () => ({ theme, toggleTheme, search, setSearch, replayBoot }),
    [theme, toggleTheme, search, replayBoot]
  );

  return (
    <AppContext.Provider value={value}>
      {showBoot && <BootSplash onDone={handleBootDone} />}
      <CommandPalette />
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
