"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Mic,
  Paperclip,
  Settings,
  Download,
  Share,
  RefreshCw,
  Trash2,
  Pin,
  Search,
  Filter,
  Plus,
  Loader2,
  ExternalLink,
  X,
  Calendar,
  Edit3,
  Save,
  Users,
  Link,
} from "lucide-react"
import Logo2D from "@/components/logo-2d"
import NavigationSidebar from "@/components/navigation-sidebar"
import { LLM_PROVIDERS, getModelById } from "@/lib/llm-providers"
import { useRouter } from "next/navigation"

const CleanBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">{children}</div>
)

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  resources?: Array<{
    title: string
    url: string
    snippet: string
  }>
}

interface ChatSession {
  id: string
  title: string
  preview: string
  timestamp: string
  createdAt: Date
  isPinned?: boolean
  category: "recent" | "pinned" | "project"
  projectName?: string
  topic?: string
}

interface FilterState {
  searchText: string
  dateRange: { from: Date | null; to: Date | null }
  category: string
  topic: string
}

interface ChatAction {
  type: "rename" | "share" | "save" | "delete"
  chatId: string
}

interface ShareOptions {
  type: "external" | "collaborator"
  link?: string
  collaboratorEmail?: string
}

interface ProjectSave {
  projectName: string
  folderName?: string
}

export default function JarvisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to JARVIS Chat! How can I assist with your research today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [activeTab, setActiveTab] = useState<"recent" | "pinned" | "project">("recent")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    dateRange: { from: null, to: null },
    category: "",
    topic: "",
  })

  const [hoveredChat, setHoveredChat] = useState<string | null>(null)
  const [showChatActions, setShowChatActions] = useState<string | null>(null)
  const [showShareModal, setShowShareModal] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const chatSessions: ChatSession[] = [
    {
      id: "1",
      title: "Quantum Research 1",
      preview: "Latest findings on quantum entanglement",
      timestamp: "Today, 2:45 PM",
      createdAt: new Date(),
      category: "recent",
      topic: "quantum-computing",
    },
    {
      id: "2",
      title: "Machine Learning Models",
      preview: "Discussion about neural network architectures",
      timestamp: "Today, 1:30 PM",
      createdAt: new Date(),
      category: "recent",
      topic: "machine-learning",
    },
    {
      id: "3",
      title: "AI Ethics Discussion",
      preview: "Exploring ethical implications of AI research",
      timestamp: "Yesterday, 4:20 PM",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: "recent",
      topic: "ai-ethics",
    },
    {
      id: "4",
      title: "Important Research",
      preview: "Critical findings for the project",
      timestamp: "Yesterday, 4:20 PM",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: "pinned",
      isPinned: true,
      topic: "research-methods",
    },
    {
      id: "5",
      title: "Project Alpha Discussion",
      preview: "Team collaboration on AI models",
      timestamp: "2 days ago",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: "project",
      projectName: "Project Alpha",
      topic: "project-management",
    },
  ]

  const router = useRouter()

  const getFilteredSessions = () => {
    return chatSessions.filter((session) => {
      // Text search filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase()
        const matchesTitle = session.title.toLowerCase().includes(searchLower)
        const matchesPreview = session.preview.toLowerCase().includes(searchLower)
        const matchesProject = session.projectName?.toLowerCase().includes(searchLower)
        if (!matchesTitle && !matchesPreview && !matchesProject) return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const sessionDate = new Date(session.createdAt)
        if (filters.dateRange.from && sessionDate < filters.dateRange.from) return false
        if (filters.dateRange.to && sessionDate > filters.dateRange.to) return false
      }

      // Category filter
      if (filters.category && !session.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false
      }

      // Topic filter
      if (filters.topic && session.topic && !session.topic.toLowerCase().includes(filters.topic.toLowerCase())) {
        return false
      }

      return true
    })
  }

  const handleNewChat = () => {
    const newChatId = Date.now().toString()
    setMessages([
      {
        id: "1",
        content: "Welcome to JARVIS Chat! How can I assist with your research today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
    setInputMessage("")

    // Add new chat session to the beginning of the list
    const newSession: ChatSession = {
      id: newChatId,
      title: "New Chat",
      preview: "Start a new conversation with JARVIS",
      timestamp: "Now",
      createdAt: new Date(),
      category: "recent",
      topic: "general",
    }

    console.log("Created new chat session:", newSession)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
          includeResources: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: data.message.id,
        content: data.message.content,
        sender: "assistant",
        timestamp: new Date(data.message.timestamp),
        resources: data.message.resources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredSessions = getFilteredSessions().filter((session) => session.category === activeTab)

  const allModels = LLM_PROVIDERS.flatMap((provider) =>
    provider.models.map((model) => ({
      ...model,
      providerName: provider.name,
      fullId: model.id,
    })),
  )

  const selectedModelInfo = getModelById(selectedModel)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      console.log("File selected:", file.name)
    }
  }

  const handleVoiceInput = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setIsRecording(true)

        setTimeout(() => {
          setIsRecording(false)
          stream.getTracks().forEach((track) => track.stop())
          console.log("Voice recording completed")
        }, 3000)
      } catch (error) {
        console.error("Error accessing microphone:", error)
      }
    } else {
      setIsRecording(false)
    }
  }

  const handleChatAction = (action: ChatAction) => {
    switch (action.type) {
      case "rename":
        const newTitle = prompt("Enter new chat title:")
        if (newTitle) {
          console.log("Renaming chat:", action.chatId, "to:", newTitle)
          // Update chat title in state
        }
        break
      case "share":
        setShowShareModal(action.chatId)
        break
      case "save":
        router.push("/dashboard")
        break
      case "delete":
        if (confirm("Are you sure you want to delete this chat?")) {
          console.log("Deleting chat:", action.chatId)
          // Remove chat from state
        }
        break
    }
    setShowChatActions(null)
  }

  const handleShare = (chatId: string, options: ShareOptions) => {
    if (options.type === "external") {
      const shareLink = `${window.location.origin}/shared/${chatId}`
      navigator.clipboard.writeText(shareLink)
      console.log("Created external share link:", shareLink)
      // Move to shared folder with external indicator
    } else if (options.type === "collaborator") {
      const email = prompt("Enter collaborator email:")
      if (email) {
        console.log("Sharing with collaborator:", email)
        // Move to shared folder with collaborator indicator
      }
    }
    setShowShareModal(null)
  }

  return (
    <CleanBackground>
      <div className="h-screen flex">
        <NavigationSidebar />

        {/* Chat Sidebar */}
        <div className="w-80 bg-card border-r border-border flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                
                <span className="font-semibold text-foreground">Chats</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:cursor-pointer hover:bg-accent"
                  onClick={handleNewChat}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div>
              <div className="relative mb-4 z-10">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search conversations..."
                className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground"
                value={filters.searchText}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchText: e.target.value }))}
              />
              {/* <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={14} />
              </Button> */}
            </div>

            </div>
            

            {showFilters && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Filters</span>
                  <Button size="sm" variant="ghost" onClick={() => setShowFilters(false)} className="h-6 w-6 p-0">
                    <X size={12} />
                  </Button>
                </div>

                {/* Date Range Filter with Calendar */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs bg-transparent"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <Calendar size={12} className="mr-2" />
                      {filters.dateRange.from || filters.dateRange.to
                        ? `${filters.dateRange.from?.toLocaleDateString() || "Start"} - ${filters.dateRange.to?.toLocaleDateString() || "End"}`
                        : "Select date range"}
                    </Button>
                    {showDatePicker && (
                      <div className="p-2 bg-background border rounded-md space-y-2">
                        <Input
                          type="date"
                          placeholder="From"
                          className="text-xs"
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: e.target.value ? new Date(e.target.value) : null },
                            }))
                          }
                        />
                        <Input
                          type="date"
                          placeholder="To"
                          className="text-xs"
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: e.target.value ? new Date(e.target.value) : null },
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Filter - Text Input */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                  <Input
                    placeholder="Enter category..."
                    className="text-xs"
                    value={filters.category}
                    onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  />
                </div>

                {/* Topic Filter - Text Input */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Topic</label>
                  <Input
                    placeholder="Enter topic..."
                    className="text-xs"
                    value={filters.topic}
                    onChange={(e) => setFilters((prev) => ({ ...prev, topic: e.target.value }))}
                  />
                </div>

                {/* Clear Filters */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      searchText: "",
                      dateRange: { from: null, to: null },
                      category: "",
                      topic: "",
                    })
                  }
                  className="w-full text-xs"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              {[
                { key: "recent", label: "Recent" },
                { key: "pinned", label: "Pinned" },
                { key: "project", label: "Projects" },
                { key: "shared", label: "Shared" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-medium hover:cursor-pointer transition-all ${
                    activeTab === tab.key
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-4">
              {/* Today Section */}
              {(() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const todaySessions = filteredSessions.filter((session) => {
                  const sessionDate = new Date(session.createdAt)
                  sessionDate.setHours(0, 0, 0, 0)
                  return sessionDate.getTime() === today.getTime()
                })

                if (todaySessions.length === 0) return null

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-sm font-medium text-foreground">Today</h3>
                      <span className="text-xs text-muted-foreground">{todaySessions.length} Total</span>
                    </div>
                    <div className="space-y-2">
                      {todaySessions.map((session) => (
                        <div
                          key={session.id}
                          className=" p-3 rounded-lg bg-card hover:bg-accent cursor-pointer  transition-all duration-300 ease-in-out 
                                      hover:scale-100 hover:shadow-xl border border-border hover:border-primary/50 group"
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-foreground text-sm truncate flex-1">{session.title}</h4>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && <Pin size={12} className="text-primary flex-shrink-0" />}
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // Toggle pin status
                                      console.log("Toggling pin for chat:", session.id)
                                    }}
                                  >
                                    <Pin
                                      size={10}
                                      className={session.isPinned ? "text-primary" : "text-muted-foreground"}
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "rename", chatId: session.id })
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "share", chatId: session.id })
                                    }}
                                  >
                                    <Share size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "save", chatId: session.id })
                                    }}
                                  >
                                    <Save size={10} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{session.preview}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{session.timestamp}</span>
                            {session.projectName && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                {session.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Previous 7 Days Section */}
              {(() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const sevenDaysAgo = new Date(today)
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

                const previousWeekSessions = filteredSessions.filter((session) => {
                  const sessionDate = new Date(session.createdAt)
                  sessionDate.setHours(0, 0, 0, 0)
                  return sessionDate < today && sessionDate >= sevenDaysAgo
                })

                if (previousWeekSessions.length === 0) return null

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-sm font-medium text-foreground">Previous 7 Days</h3>
                      <span className="text-xs text-muted-foreground">{previousWeekSessions.length}</span>
                    </div>
                    <div className="space-y-2">
                      {previousWeekSessions.map((session) => (
                        <div
                          key={session.id}
                          className="relative p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-all border border-border hover:border-primary/50 group"
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-foreground text-sm truncate flex-1">{session.title}</h4>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && <Pin size={12} className="text-primary flex-shrink-0" />}
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // Toggle pin status
                                      console.log("Toggling pin for chat:", session.id)
                                    }}
                                  >
                                    <Pin
                                      size={10}
                                      className={session.isPinned ? "text-primary" : "text-muted-foreground"}
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "rename", chatId: session.id })
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "share", chatId: session.id })
                                    }}
                                  >
                                    <Share size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 hover:cursor-pointer w-5 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "save", chatId: session.id })
                                    }}
                                  >
                                    <Save size={10} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{session.preview}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{session.timestamp}</span>
                            {session.projectName && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                {session.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Older Sessions Section */}
              {(() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)

                const sevenDaysAgo = new Date(today)
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

                const olderSessions = filteredSessions.filter((session) => {
                  const sessionDate = new Date(session.createdAt)
                  sessionDate.setHours(0, 0, 0, 0)
                  return sessionDate < sevenDaysAgo
                })

                if (olderSessions.length === 0) return null

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-sm font-medium text-foreground">Older</h3>
                      <span className="text-xs text-muted-foreground">{olderSessions.length}</span>
                    </div>
                    <div className="space-y-2">
                      {olderSessions.map((session) => (
                        <div
                          key={session.id}
                          className="relative p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-all border border-border hover:border-primary/50 group"
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-foreground text-sm truncate flex-1">{session.title}</h4>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && <Pin size={12} className="text-primary flex-shrink-0" />}
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "rename", chatId: session.id })
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "share", chatId: session.id })
                                    }}
                                  >
                                    <Share size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChatAction({ type: "save", chatId: session.id })
                                    }}
                                  >
                                    <Save size={10} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{session.preview}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{session.timestamp}</span>
                            {session.projectName && (
                              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                {session.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </ScrollArea>

          {showShareModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg border border-border max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Share Chat</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleShare(showShareModal, { type: "external" })}
                  >
                    <Link size={16} className="mr-2" />
                    Create shareable link
                    <Badge variant="secondary" className="ml-auto text-xs">
                      External
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleShare(showShareModal, { type: "collaborator" })}
                  >
                    <Users size={16} className="mr-2" />
                    Share with collaborator
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Internal
                    </Badge>
                  </Button>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShowShareModal(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  
                  <div>
                    <h2 className="font-semibold text-foreground">JARVIS RACE Research Assistant</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedModelInfo
                        ? `${selectedModelInfo.provider.name} • ${selectedModelInfo.model.name}`
                        : "Powered by AI"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center  space-x-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[180px]  h-8 text-xs bg-card border-border">
                    <div className="flex hover:cursor-pointer items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <SelectValue>{selectedModelInfo?.model.name || "GPT-4o"}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="w-[320px] bg-card border-border ">
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectGroup key={provider.id}>
                        <SelectLabel className="text-xs font-semibold">{provider.name}</SelectLabel>
                        {provider.models.map((model) => (
                          <SelectItem key={model.id} value={model.id} className="text-xs hover:cursor-pointer py-3">
                            <div className="flex flex-col gap-1 hover:cursor-pointer">
                              <div className="flex items-center gap-2 ">
                                <span className="font-medium">{model.name}</span>
                                {model.isPro && (
                                  <Badge variant="secondary" className="text-xs h-4 px-1">
                                    PRO
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {model.id === "gpt-4o" && "Best for complex reasoning and analysis"}
                                {model.id === "gpt-4o-mini" && "Fast, efficient for simple tasks"}
                                {model.id === "o1-preview" && "Advanced reasoning with chain-of-thought"}
                                {model.id === "o1-mini" && "Lightweight reasoning model"}
                                {model.id === "claude-3-5-sonnet" && "Best for creative and nuanced content"}
                                {model.id === "claude-3-5-haiku" && "Fast Claude model for quick tasks"}
                                {model.id === "claude-3-opus" && "Most capable Claude for complex work"}
                                {model.id === "gemini-1.5-pro" && "Google's best for multimodal tasks"}
                                {model.id === "gemini-1.5-flash" && "Fast Google model for quick responses"}
                                {model.id === "gemini-2.0-flash-exp" && "Experimental features and capabilities"}
                                {model.id === "llama-3.1-sonar-large" && "Open-source with web search"}
                                {model.id === "llama-3.1-sonar-small" && "Lightweight with web search"}
                                {model.id === "llama-3.1-sonar-huge" && "Most powerful open-source option"}
                                {model.id === "grok-2-1212" && "Latest Grok with real-time knowledge"}
                                {model.id === "grok-2-vision-1212" && "Grok with image understanding"}
                                {model.id === "deepseek-r1" && "Specialized for research tasks"}
                                {model.id === "deepseek-r1-distill-llama-70b" && "Research-focused, large model"}
                                {model.id === "mixtral-8x7b" && "Efficient mixture of experts model"}
                                {model.id === "mixtral-8x22b" && "Large MoE for complex tasks"}
                                {model.id === "mistral-large" && "Mistral's flagship model"}
                                {model.id === "mistral-nemo" && "Balanced performance model"}
                                {model.id === "nemotron-70b" && "NVIDIA's large language model"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectSeparator />
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:cursor-pointer bg-card/30 backdrop-blur-sm border-border/50"
                >
                  <Settings size={16} />
                </Button>
                
              
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:cursor-pointer bg-card/30 backdrop-blur-sm border-border/50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-15 bg-background">
            <div className="max-w-5xl mx-auto space-y-6 px-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-5 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-card-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                    {message.resources && message.resources.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="text-xs font-medium text-muted-foreground mb-3">Related Resources:</div>
                        {message.resources.map((resource, index) => (
                          <div key={index} className="bg-muted p-4 rounded-xl border border-border">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <h4 className="text-sm font-medium text-foreground mb-2">{resource.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                  {resource.snippet}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open(resource.url, "_blank")}
                                className="ml-2 p-2 h-8 w-8 hover:bg-primary/10"
                              >
                                <ExternalLink size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p
                      className={`text-xs mt-3 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card/70 backdrop-blur-sm p-5 rounded-2xl border border-border/50 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">JARVIS is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          
          
            <div className="max-w-5xl mx-auto px-4">
              {/* {selectedFile && (
                <div className="mb-4 p-3 bg-muted rounded-xl border border-border flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Paperclip size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground font-medium">{selectedFile.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedFile(null)}
                    className="text-muted-foreground hover:text-destructive p-1 h-6 w-6"
                  >
                    ×
                  </Button>
                </div>
              )} */}

              <div className=" w-[800px] bg-transparent pt-1 mb-10 flex items-end space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask JARVIS anything about your research..."
                    className="pr-24 py-2 h-[52px] bg-input border-border text-foreground placeholder-muted-foreground rounded-[40px] text-base"
                    disabled={isLoading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.md"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:cursor-pointer  hover:text-foreground p-2 h-8 w-8"
                      disabled={isLoading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip size={32} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-muted-foreground hover:cursor-pointer hover:text-foreground p-2 h-8 w-8 ${isRecording ? "text-destructive animate-pulse" : ""}`}
                      disabled={isLoading}
                      onClick={handleVoiceInput}
                    >
                      <Mic size={32} />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-primary h-[50px] hover:bg-primary/90 text-primary-foreground p-4 rounded-[52px] hover:cursor-pointer min-w-[48px]"
                >
                  {isLoading ? <Loader2 size={48} className="animate-spin" /> : <Send size={48} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      
    </CleanBackground>
  )
}
