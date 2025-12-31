"use client"

import { usePathname } from "next/navigation"
import NavigationSidebar from "@/components/navigation-sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Paths where the sidebar should strictly NOT appear
  const hideSidebarPaths = ["/", "/onboarding"]
  
  // Also hide on auth routes if they exist, or use a more robust check
  const shouldHideSidebar = hideSidebarPaths.includes(pathname) || pathname.startsWith("/auth")

  if (shouldHideSidebar) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* 
        Sticky sidebar wrapper. 
        h-screen makes it take full viewport height.
        sticky + top-0 makes it stick while scrolling main content.
      */}
      <aside className="sticky top-0 h-screen w-16 shrink-0 z-50">
        <div className="h-full flex flex-col">
            <NavigationSidebar />
        </div>
      </aside>

      {/* Main content area takes remaining width */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
