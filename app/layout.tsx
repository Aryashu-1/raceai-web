import type React from "react";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "RACE AI - Research Accessible to Everyone",
  description: "Your Gateway to Effortless Research Management",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
          <meta
            name="api-keys-required"
            content="OPENAI_API_KEY for full functionality"
          />
        </head>
        <body className="font-sans antialiased bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
          >
            <div className="fixed inset-0 -z-20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-slate-50/40 to-blue-50/30 dark:from-slate-950/60 dark:via-slate-900/40 dark:to-blue-950/30" />
              <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/1 dark:bg-blue-400/2 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/1 dark:bg-indigo-400/2 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/1 dark:bg-purple-400/2 rounded-full blur-2xl animate-pulse delay-500" />
            </div>

            <div className="relative z-0">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
