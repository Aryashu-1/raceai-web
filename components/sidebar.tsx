"use client"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Users, FileText, Settings, HelpCircle, Bell, User, Plus } from "lucide-react"
import Logo2D from "@/components/logo-2d"

interface SidebarItem {
  id: string
  label: string
  icon: any
  href: string
  badge?: string
}

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const mainItems: SidebarItem[] = [
    { id: "new-topic", label: "+ New Topic", icon: Plus, href: "/jarvis" },
    { id: "knowledge", label: "Knowledge", icon: Search, href: "/knowledge" },
    { id: "research", label: "Research & Collab", icon: Users, href: "/research" },
    { id: "problems", label: "The Problems", icon: FileText, href: "/problems" },
  ]

  const discussionItems = [
    "Heterogeneous Cat...",
    "Quantum Error Cor...",
    "Jalianwala Bagh Ma...",
    "Multi-Genome Facet...",
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2 mb-4">
          <Logo2D size="sm" />
          <span className="font-bold text-lg text-sidebar-foreground">RACE AI</span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="p-4">
        <div className="space-y-2">
          {mainItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Previous Discussions */}
      <div className="flex-1 px-4">
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-3">Previous Discussions</h3>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {discussionItems.map((item, index) => (
              <button
                key={index}
                className="w-full text-left p-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <Settings size={16} className="mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <HelpCircle size={16} className="mr-2" />
          Help
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <Bell size={16} className="mr-2" />
          Notifications
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <User size={16} className="mr-2" />
          Profile
        </Button>
      </div>
    </div>
  )
}
