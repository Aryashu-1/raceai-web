"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Search, Users, Lightbulb, User, Settings, LayoutDashboard, FolderKanban } from "lucide-react"
import ModernLogo from "@/components/modern-logo"
import { ThemeToggle } from "./theme-toggle"
import Image from "next/image"
import { useState, useEffect } from "react"

const navigationItems = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    path: "/jarvis",
  },
  {
    id: "knowledge",
    label: "Knowledge & Discovery",
    icon: Search,
    path: "/knowledge",
  },
  {
    id: "research",
    label: "Collaborate",
    icon: Users,
    path: "/research",
  },
  {
    id: "problems",
    label: "SOTA",
    icon: Lightbulb,
    path: "/problems",
  },
]

const secondaryNavItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
]

export default function NavigationSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  useEffect(() => {
    // Get user profile picture from localStorage
    const savedProfileImage = localStorage.getItem("profile_image")
    if (savedProfileImage) {
      setProfilePicture(savedProfileImage)
    }
  }, [])

  const handleLogoClick = () => {
    // Check if user is signed in - you can replace this with actual auth check
    const isSignedIn = true // Replace with: const isSignedIn = !!session or your auth state

    if (isSignedIn) {
      router.push("/jarvis")
    } else {
      router.push("/") // Sign up page
    }
  }

  return (
    <div className="w-16 glass-card border-r border-border/50 flex flex-col items-center pt-2 pb-4 relative z-50">
      {/* Logo */}
      <div className="mb-8 cursor-pointer" onClick={handleLogoClick}>
        <ModernLogo size={50} showText={false} />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col mt-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={`w-12 h-12 p-0 rounded-full transition-all duration-200 group hover:cursor-pointer relative hover:scale-105 ${
                isActive
                  ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
                  : "bg-transparent hover:bg-muted dark:hover:bg-muted/50"
              }`}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
              )}
              <Icon
                size={20}
                className={isActive ? "text-primary dark:text-primary" : "text-primary dark:text-muted-foreground group-hover:text-primary dark:group-hover:text-foreground"}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-gray-300 dark:bg-border my-4"></div>

      {/* Secondary Navigation Items */}
      <div className="flex flex-col space-y-1">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={`w-12 h-12 p-0 rounded-full transition-all duration-200 group hover:cursor-pointer relative hover:scale-105 ${
                isActive
                  ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
                  : "bg-transparent hover:bg-muted dark:hover:bg-muted/50"
              }`}
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
              )}
              <Icon
                size={20}
                className={isActive ? "text-primary dark:text-primary" : "text-primary dark:text-muted-foreground group-hover:text-primary dark:group-hover:text-foreground"}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Button>
          )
        })}
      </div>

         <div className="mt-auto mb-4">
                <ThemeToggle />
            </div>
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/settings")}
          className={`w-12 h-12 p-0 rounded-full transition-all duration-200 group relative hover:scale-105 ${
            pathname === "/settings"
              ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
              : "bg-transparent hover:bg-muted dark:hover:bg-muted/50"
          }`}
          title="Settings"
        >
          {pathname === "/settings" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
          )}
          <Settings
            size={20}
            className={pathname === "/settings" ? "text-primary dark:text-primary" : "text-primary dark:text-muted-foreground group-hover:text-primary dark:group-hover:text-foreground"}
            strokeWidth={pathname === "/settings" ? 2.5 : 2}
          />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/profile")}
          className={`w-12 h-12 p-0 rounded-full transition-all duration-200 group relative overflow-hidden hover:scale-105 ${
            pathname === "/profile"
              ? "bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25"
              : "bg-transparent hover:bg-muted dark:hover:bg-muted/50"
          }`}
          title="Profile"
        >
          {pathname === "/profile" && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm" />
          )}
          {profilePicture ? (
            <div className={pathname === "/profile" ? "ring-2 ring-primary rounded-full" : ""}>
              <Image
                src={profilePicture}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <User
              size={20}
              className={pathname === "/profile" ? "text-primary dark:text-primary" : "text-primary dark:text-muted-foreground group-hover:text-primary dark:group-hover:text-foreground"}
              strokeWidth={pathname === "/profile" ? 2.5 : 2}
            />
          )}
        </Button>

        {/* Active Indicator */}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
