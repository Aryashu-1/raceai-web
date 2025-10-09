"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: string | undefined
  systemTheme: string | undefined
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeStateProvider({ children }: { children: React.ReactNode }) {
  const themeHook = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not exposing theme data until mounted
  const value = {
    theme: (mounted ? themeHook.theme : "system") as Theme,
    setTheme: themeHook.setTheme,
    resolvedTheme: mounted ? themeHook.resolvedTheme : undefined,
    systemTheme: mounted ? themeHook.systemTheme : undefined,
    mounted,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useAppTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider")
  }
  return context
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="race-ai-theme"
      themes={["light", "dark"]}
      {...props}
    >
      <ThemeStateProvider>{children}</ThemeStateProvider>
    </NextThemesProvider>
  )
}
