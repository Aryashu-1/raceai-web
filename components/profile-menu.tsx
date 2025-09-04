"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Settings, Shield, LogOut, ChevronDown } from "lucide-react"

interface ProfileMenuProps {
  user: {
    name: string
    email: string
    profilePicture?: string
    role?: string
  }
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("race_ai_user")
    router.push("/")
  }

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Shield, label: "Security", href: "/security" },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
          {user.profilePicture ? (
            <img
              src={user.profilePicture || "/placeholder.svg"}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-blue-200">{user.role || "Researcher"}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-blue-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="font-medium text-white">{user.name}</p>
                <p className="text-sm text-blue-200">{user.email}</p>
                <p className="text-xs text-blue-300">{user.role || "Researcher"}</p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-blue-100 hover:bg-white/5 hover:text-white transition-colors"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
