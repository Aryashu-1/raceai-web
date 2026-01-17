import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk, Outfit } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import CustomCursor from "@/components/custom-cursor"

//context providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext"
import { ChatProvider } from "./context/ChatContext"
import { SettingsProvider } from "./context/SettingsContext"

import { ToastProvider } from "@/lib/contexts/toast-context"
import { NotificationProvider } from "@/lib/contexts/notification-context"
import { CommandPalette } from "@/components/command-palette"
import { QuickCapture } from "@/components/quick-capture"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "RACE AI - Research Accessible to Everyone",
  description: "Your Gateway to Effortless Research Management",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="api-keys-required" content="OPENAI_API_KEY for full functionality" />
      </head>
      <body className={`${inter.className} font-sans antialiased bg-background text-foreground`} suppressHydrationWarning>
        <CustomCursor />
        <AuthProvider>
          <UserProvider>
            <ProjectProvider>
              <ChatProvider>
                <SettingsProvider>
                  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
                    <ToastProvider>
                      <NotificationProvider>
                        {children}
                        <CommandPalette />
                        <QuickCapture />
                      </NotificationProvider>
                    </ToastProvider>
                  </ThemeProvider>
                </SettingsProvider>
              </ChatProvider>
            </ProjectProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
