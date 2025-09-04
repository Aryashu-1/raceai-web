"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Search, Users, Lightbulb, User } from "lucide-react"
import Logo2D from "@/components/logo-2d"

const navigationItems = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare,
    path: "/jarvis",
    description: "AI Research Assistant",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    icon: Search,
    path: "/knowledge",
    description: "Discovery & Research",
  },
  {
    id: "research",
    label: "Research",
    icon: Users,
    path: "/research",
    description: "Collaboration Hub",
  },
  {
    id: "problems",
    label: "SOTA",
    icon: Lightbulb,
    path: "/problems",
    description: "State-of-the-Art Problems",
  },
]

export default function NavigationSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="w-16 bg-white/10 backdrop-blur-md border-r border-white/20 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8 cursor-pointer" onClick={() => router.push("/jarvis")}>
        <Logo2D size="sm" />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={`w-12 h-12 p-0 rounded-xl transition-all duration-200 group relative ${
                isActive ? "bg-primary text-white shadow-lg" : "text-gray-600 hover:text-primary hover:bg-white/20"
              }`}
              title={item.label}
            >
              <Icon size={20} />

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-medium">{item.label}</div>
                <div className="text-gray-300 text-xs">{item.description}</div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </Button>
          )
        })}
      </div>

      {/* Profile Section */}
      <div className="mt-auto flex flex-col items-center space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/profile")}
          className={`w-12 h-12 p-0 rounded-xl transition-all duration-200 group relative ${
            pathname === "/profile"
              ? "bg-primary text-white shadow-lg"
              : "text-gray-600 hover:text-primary hover:bg-white/20"
          }`}
          title="Profile"
        >
          <User size={20} />

          {/* Tooltip */}
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            <div className="font-medium">Profile</div>
            <div className="text-gray-300 text-xs">User Settings</div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </Button>

        {/* Active Indicator */}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
