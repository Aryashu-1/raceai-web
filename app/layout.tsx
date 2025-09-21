import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Space_Grotesk } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import "./globals.css"

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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="api-keys-required" content="OPENAI_API_KEY for full functionality" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          
          {children}
        </ThemeProvider>
      </body>
    </html>
  )

  // if (isValidClerkKey) {
  //   return <ClerkProvider publishableKey={publishableKey}>{content}</ClerkProvider>
  // }
  // return content
}
