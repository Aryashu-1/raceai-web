import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

//context providers
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext"
import { ChatProvider } from "./context/ChatContext"
// NEW FEATURES - Add these imports
import { NotificationProvider } from "@/lib/contexts/notification-context"
import { ToastProvider } from "@/lib/contexts/toast-context"
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
  // const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  // const isValidClerkKey = publishableKey && publishableKey.startsWith("pk_") && publishableKey.length > 20

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="api-keys-required" content="OPENAI_API_KEY for full functionality" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <UserProvider>
            <ProjectProvider>
              <ChatProvider>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
                  {/* NEW: Wrap with feature providers */}
                  <ToastProvider>
                    <NotificationProvider>
                      {children}

                      {/* NEW: Add global features */}
                      <CommandPalette />  {/* Press ⌘K or Ctrl+K to open */}
                      <QuickCapture />    {/* Floating + button in bottom-right */}
                    </NotificationProvider>
                  </ToastProvider>
                </ThemeProvider>
              </ChatProvider>
            </ProjectProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  )

  // if (isValidClerkKey) {
  //   return <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>
  // }
  // return content
}
