"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Mic,
  Paperclip,
  Share,
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
  User,
} from "lucide-react";
import NavigationSidebar from "@/components/navigation-sidebar";
import { LLM_PROVIDERS, getModelById } from "@/lib/llm-providers";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { RaceGeometricLogo } from "@/components/race-geometric-logo";
import { KnowledgeGraph } from "@/components/knowledge-graph";

const EnhancedBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
    {/* Animated gradient orbs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-gentle-pulse" />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-gentle-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-gentle-pulse"
        style={{ animationDelay: "4s" }}
      />
    </div>

    {/* Knowledge Graph Background */}
    <KnowledgeGraph />

    {/* Content */}
    <div className="relative z-10">{children}</div>
  </div>
);

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  resources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

interface ChatSession {
  userGroup: string;
  user: any;
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  createdAt: Date;
  isPinned?: boolean;
  isShared?: boolean;
  category: "recent" | "pinned" | "project" | "shared";
  projectName?: string;
  topic: string;
}

interface FilterState {
  searchText: string;
  dateRange: { from: Date | null; to: Date | null };
  user: string;
  userGroup: string;
}

interface ChatAction {
  type: "rename" | "share" | "save" | "delete";
  chatId: string;
}

interface ShareOptions {
  type: "external" | "collaborator";
  link?: string;
  collaboratorEmail?: string;
}

interface ProjectSave {
  projectName: string;
  folderName?: string;
}

export default function JarvisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to JARVIS Chat! How can I assist with your research today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Quantum Research Discussion",
      preview: "Exploring quantum computing applications in machine learning...",
      timestamp: "2 hours ago",
      createdAt: new Date(),
      category: "recent",
      isPinned: false,
      isShared: false,
      projectName: "Quantum ML Project",
      topic: "quantum-computing",
      userGroup: "",
      user: undefined
    },
    {
      id: "2",
      title: "Literature Review Analysis",
      preview: "Analyzing recent papers on neural network architectures...",
      timestamp: "1 day ago",
      createdAt: new Date(),
      category: "recent",
      isPinned: true,
      isShared: false,
      projectName: "Deep Learning Survey",
      topic: "machine-learning",
      userGroup: "",
      user: undefined
    },
    {
      id: "3",
      title: "Data Processing Pipeline",
      preview: "Discussing automated data preprocessing techniques...",
      timestamp: "3 days ago",
      createdAt: new Date(),
      category: "recent",
      isPinned: false,
      isShared: false,
      topic: "data-science",
      userGroup: "",
      user: undefined
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [activeTab, setActiveTab] = useState<
    "recent" | "pinned" | "project" | "shared"
  >("recent");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    dateRange: { from: null, to: null },
    user: "",
    userGroup: "",
  });

  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [showChatActions, setShowChatActions] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string>("");
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const getFilteredSessions = () => {
    const sessions = chatSessions.filter((session) => {
      // Text search filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesTitle = session.title.toLowerCase().includes(searchLower);
        const matchesPreview = session.preview
          .toLowerCase()
          .includes(searchLower);
        const matchesProject = session.projectName
          ?.toLowerCase()
          .includes(searchLower);
        if (!matchesTitle && !matchesPreview && !matchesProject) return false;
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const sessionDate = new Date(session.createdAt);
        if (filters.dateRange.from && sessionDate < filters.dateRange.from)
          return false;
        if (filters.dateRange.to && sessionDate > filters.dateRange.to)
          return false;
      }

      // User filter
      if (
        filters.user &&
        !session.user?.toLowerCase().includes(filters.user.toLowerCase())
      ) {
        return false;
      }

      // User group filter (lab/collaborator)
      if (
        filters.userGroup &&
        session.userGroup &&
        !session.userGroup
          .toLowerCase()
          .includes(filters.userGroup.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    switch (activeTab) {
      case "recent":
        return sessions;
      case "pinned":
        return sessions.filter((session) => session.isPinned);
      case "project":
        return sessions.filter((session) => session.projectName);
      case "shared":
        return sessions.filter((session) => session.isShared);
      default:
        return sessions;
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    setMessages([
      {
        id: "1",
        content:
          "Welcome to JARVIS Chat! How can I assist with your research today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    setInputMessage("");

    // Add new chat session to the beginning of the list
    const newSession: ChatSession = {
      id: newChatId,
      title: "New Chat",
      preview: "Start a new conversation with JARVIS",
      timestamp: "Now",
      createdAt: new Date(),
      category: "recent",
      topic: "general",
      userGroup: "",
      user: undefined
    };

    console.log("Created new chat session:", newSession);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

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
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.message.id,
        content: data.message.content,
        sender: "assistant",
        timestamp: new Date(data.message.timestamp),
        resources: data.message.resources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredSessions = getFilteredSessions();

  const allModels = LLM_PROVIDERS.flatMap((provider) =>
    provider.models.map((model) => ({
      ...model,
      providerName: provider.name,
      fullId: model.id,
    }))
  );

  const selectedModelInfo = getModelById(selectedModel);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("File selected:", file.name);
    }
  };

  const handleVoiceInput = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setIsRecording(true);

        setTimeout(() => {
          setIsRecording(false);
          stream.getTracks().forEach((track) => track.stop());
          console.log("Voice recording completed");
        }, 3000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleChatAction = (action: ChatAction) => {
    switch (action.type) {
      case "rename":
        const newTitle = prompt("Enter new chat title:");
        if (newTitle) {
          setChatSessions((prev) =>
            prev.map((session) =>
              session.id === action.chatId
                ? { ...session, title: newTitle }
                : session
            )
          );
          console.log("[v0] Renamed chat:", action.chatId, "to:", newTitle);
        }
        break;
      case "share":
        setShowShareModal(action.chatId);
        break;
      case "save":
        router.push("/dashboard");
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this chat?")) {
          setChatSessions((prev) =>
            prev.filter((session) => session.id !== action.chatId)
          );
          console.log("[v0] Deleted chat:", action.chatId);
        }
        break;
    }
    setShowChatActions(null);
  };

  const handleShare = (chatId: string, options: ShareOptions) => {
    if (options.type === "external") {
      const shareLink = `${window.location.origin}/shared/${chatId}`;
      navigator.clipboard.writeText(shareLink).then(() => {
        setShareLink(shareLink);
        setShowLinkCopied(true);
        setTimeout(() => setShowLinkCopied(false), 3000);
        console.log("[v0] Created external share link:", shareLink);
      });
    } else if (options.type === "collaborator") {
      const email = prompt("Enter collaborator email:");
      if (email) {
        const collaboratorLink = `${
          window.location.origin
        }/collaborate/${chatId}?email=${encodeURIComponent(email)}`;
        navigator.clipboard.writeText(collaboratorLink).then(() => {
          setShareLink(collaboratorLink);
          setShowLinkCopied(true);
          setTimeout(() => setShowLinkCopied(false), 3000);
          console.log(
            "[v0] Shared with collaborator:",
            email,
            "Link:",
            collaboratorLink
          );
        });
      }
    }
    setShowShareModal(null);
  };

  const togglePin = (chatId: string) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === chatId
          ? { ...session, isPinned: !session.isPinned }
          : session
      )
    );
    console.log("[v0] Toggled pin for chat:", chatId);
  };

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");

  return (
    <EnhancedBackground>
      <div className="h-screen flex">
        <NavigationSidebar />

        {/* Chat Sidebar */}
        <div className="w-80 glass-effect border-r border-white/20 dark:border-slate-700/50 flex flex-col backdrop-blur-xl bg-white/80 dark:bg-slate-900/80">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/20 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <RaceGeometricLogo
                  size={24}
                  variant="primary"
                  showText={false}
                />
                <span className="font-semibold text-slate-900 dark:text-white">
                  Chats
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleNewChat}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
                size={16}
              />
              <Input
                placeholder="Search conversations..."
                className="pl-10 pr-12 glass-effect border-white/30 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-full bg-white/70 dark:bg-slate-800/70 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                value={filters.searchText}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchText: e.target.value,
                  }))
                }
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-white/50 dark:hover:bg-slate-700/50 hover:scale-110 transition-all duration-200"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={14} />
              </Button>
            </div>

            {showFilters && (
              /* Enhanced filter panel with glass effects */
              <div className="mb-4 p-3 glass-effect bg-white/60 dark:bg-slate-800/60 rounded-lg border border-white/30 dark:border-slate-600/50 space-y-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Filters
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowFilters(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X size={12} />
                  </Button>
                </div>

                {/* Date Range Filter with Calendar */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs bg-transparent"
                      onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                      <Calendar size={12} className="mr-2" />
                      {filters.dateRange.from || filters.dateRange.to
                        ? `${
                            filters.dateRange.from?.toLocaleDateString() ||
                            "Start"
                          } - ${
                            filters.dateRange.to?.toLocaleDateString() || "End"
                          }`
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
                              dateRange: {
                                ...prev.dateRange,
                                from: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              },
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
                              dateRange: {
                                ...prev.dateRange,
                                to: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              },
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* User Filter */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                    User
                  </label>
                  <Input
                    placeholder="Enter user name..."
                    className="text-xs"
                    value={filters.user}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, user: e.target.value }))
                    }
                  />
                </div>

                {/* User Group Filter */}
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">
                    User Group
                  </label>
                  <select
                    className="w-full text-xs p-2 border rounded-md bg-background"
                    value={filters.userGroup}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        userGroup: e.target.value,
                      }))
                    }
                  >
                    <option value="">All Groups</option>
                    <option value="lab">Lab</option>
                    <option value="collaborator">Collaborator</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      searchText: "",
                      dateRange: { from: null, to: null },
                      user: "",
                      userGroup: "",
                    })
                  }
                  className="w-full text-xs"
                >
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/50 dark:bg-slate-800/50 p-1 rounded-full border border-white/30 dark:border-slate-600/50">
              {["Recent", "Pinned", "Projects", "Shared"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase() as any)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    activeTab === tab.toLowerCase()
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-4">
              {/* Today Section */}
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todaySessions = filteredSessions.filter((session) => {
                  const sessionDate = new Date(session.createdAt);
                  sessionDate.setHours(0, 0, 0, 0);
                  return sessionDate.getTime() === today.getTime();
                });

                if (todaySessions.length === 0) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-sm font-medium text-foreground">
                        Today
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {todaySessions.length} Total
                      </span>
                    </div>
                    <div className="space-y-2">
                      {todaySessions.map((session) => (
                        <div
                          key={session.id}
                          className="relative p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-all border border-border hover:border-primary/50 group"
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-foreground text-sm truncate flex-1">
                              {session.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && (
                                <Pin
                                  size={12}
                                  className="text-primary flex-shrink-0"
                                />
                              )}
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePin(session.id);
                                    }}
                                  >
                                    <Pin
                                      size={10}
                                      className={
                                        session.isPinned
                                          ? "text-blue-600 fill-current"
                                          : "text-muted-foreground hover:text-blue-600"
                                      }
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "rename",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Edit3
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "share",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Share
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "save",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Save
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {session.preview}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {session.timestamp}
                            </span>
                            {session.projectName && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-primary/10 text-primary"
                              >
                                {session.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Previous 7 Days Section */}
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const previousWeekSessions = filteredSessions.filter(
                  (session) => {
                    const sessionDate = new Date(session.createdAt);
                    sessionDate.setHours(0, 0, 0, 0);
                    return sessionDate < today && sessionDate >= sevenDaysAgo;
                  }
                );

                if (previousWeekSessions.length === 0) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-sm font-medium text-foreground">
                        Previous 7 Days
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {previousWeekSessions.length}
                      </span>
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
                            <h4 className="font-medium text-foreground text-sm truncate flex-1">
                              {session.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && (
                                <Pin
                                  size={12}
                                  className="text-primary flex-shrink-0"
                                />
                              )}
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "rename",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Edit3
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "share",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Share
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "save",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Save
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {session.preview}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {session.timestamp}
                            </span>
                            {session.projectName && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-primary/10 text-primary"
                              >
                                {session.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Older Sessions Section */}
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const olderSessions = filteredSessions.filter((session) => {
                  const sessionDate = new Date(session.createdAt);
                  sessionDate.setHours(0, 0, 0, 0);
                  return sessionDate < sevenDaysAgo;
                });

                if (olderSessions.length === 0) return null;

                return (
                  <div>
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-sm font-medium text-foreground">
                        Older
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {olderSessions.length}
                      </span>
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
                            <h4 className="font-medium text-foreground text-sm truncate flex-1">
                              {session.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {session.isPinned && (
                                <Pin
                                  size={12}
                                  className="text-primary flex-shrink-0"
                                />
                              )}
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "rename",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Edit3
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "share",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Share
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "save",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Save
                                      size={10}
                                      className="text-muted-foreground hover:text-blue-600"
                                    />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {session.preview}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {session.timestamp}
                            </span>
                            {session.projectName && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-primary/10 text-primary"
                              >
                                {session.projectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </ScrollArea>

          {showShareModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg border border-border max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Share Chat</h3>
                {showLinkCopied && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      ✓ Link copied to clipboard!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1 font-mono break-all">
                      {shareLink}
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() =>
                      handleShare(showShareModal, { type: "external" })
                    }
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
                    onClick={() =>
                      handleShare(showShareModal, { type: "collaborator" })
                    }
                  >
                    <Users size={16} className="mr-2" />
                    Share with collaborator
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Internal
                    </Badge>
                  </Button>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowShareModal(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {shareModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Share Chat</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShareModalOpen(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Share Link
                    </label>
                    <div className="flex gap-2">
                      <Input value={shareLink} readOnly className="text-xs" />
                      <Button
                        size="sm"
                        onClick={async () => {
                          await navigator.clipboard.writeText(shareLink);
                          setShareFeedback("Link copied to clipboard!");
                          setTimeout(() => setShareFeedback(""), 3000);
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                    {shareFeedback && (
                      <p className="text-xs text-green-600 mt-1">
                        {shareFeedback}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Share on Social Media
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(
                              shareLink
                            )}`,
                            "_blank"
                          )
                        }
                        className="text-xs"
                      >
                        WhatsApp
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `mailto:?subject=Check out this research chat&body=${encodeURIComponent(
                              shareLink
                            )}`,
                            "_blank"
                          )
                        }
                        className="text-xs"
                      >
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                              shareLink
                            )}`,
                            "_blank"
                          )
                        }
                        className="text-xs"
                      >
                        LinkedIn
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`https://www.instagram.com/`, "_blank")
                        }
                        className="text-xs"
                      >
                        Instagram
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://discord.com/channels/@me`,
                            "_blank"
                          )
                        }
                        className="text-xs"
                      >
                        Discord
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/20 dark:border-slate-700/50 glass-effect bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push("/jarvis")}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <RaceGeometricLogo
                    size={32}
                    variant="primary"
                    showText={false}
                  />
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      JARVIS Research Assistant
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedModelInfo
                        ? `${selectedModelInfo.provider.name} • ${selectedModelInfo.model.name}`
                        : "Powered by AI"}
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[180px] h-8 text-xs bg-card border-border rounded-full">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <SelectValue>
                        {selectedModelInfo?.model.name || "GPT-4o"}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="w-[320px] bg-card border-border">
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectGroup key={provider.id}>
                        <SelectLabel className="text-xs font-semibold">
                          {provider.name}
                        </SelectLabel>
                        {provider.models.map((model) => (
                          <SelectItem
                            key={model.id}
                            value={model.id}
                            className="text-xs py-3"
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {model.name}
                                </span>
                                {model.isPro && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs h-4 px-1 rounded-full"
                                  >
                                    PRO
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {model.id === "gpt-4o" &&
                                  "Best for complex reasoning and analysis"}
                                {model.id === "gpt-4o-mini" &&
                                  "Fast, efficient for simple tasks"}
                                {model.id === "o1-preview" &&
                                  "Advanced reasoning with chain-of-thought"}
                                {model.id === "o1-mini" &&
                                  "Lightweight reasoning model"}
                                {model.id === "claude-3-5-sonnet" &&
                                  "Best for creative and nuanced content"}
                                {model.id === "claude-3-5-haiku" &&
                                  "Fast, lightweight Claude model"}
                                {model.id === "gemini-1.5-pro" &&
                                  "Google's most capable model"}
                                {model.id === "gemini-1.5-flash" &&
                                  "Fast, efficient Gemini model"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full hover:bg-accent hover:scale-110 transition-all duration-200"
                  onClick={() => router.push("/profile")}
                >
                  <User size={16} />
                </Button>

                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6 bg-transparent">
            <div className="max-w-5xl mx-auto space-y-6 px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "glass-effect bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-white/30 dark:border-slate-600/50 backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>

                    {message.resources && message.resources.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <div className="text-xs font-medium text-muted-foreground mb-3">
                          Related Resources:
                        </div>
                        {message.resources.map((resource, index) => (
                          <div
                            key={index}
                            className="bg-muted p-4 rounded-xl border border-border"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                                  {resource.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                  {resource.snippet}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  window.open(resource.url, "_blank")
                                }
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
                      className={`text-xs mt-3 ${
                        message.sender === "user"
                          ? "text-white/70"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass-effect bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-5 rounded-2xl border border-white/30 dark:border-slate-600/50 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        JARVIS is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-white/20 dark:border-slate-700/50 glass-effect bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto px-4">
              {selectedFile && (
                <div className="mb-4 p-3 glass-effect bg-white/70 dark:bg-slate-800/70 rounded-xl border border-white/30 dark:border-slate-600/50 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <Paperclip
                      size={16}
                      className="text-slate-500 dark:text-slate-400"
                    />
                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                      {selectedFile.name}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-500 dark:text-red-500 hover:text-red-600 p-1 h-6 w-6"
                  >
                    ×
                  </Button>
                </div>
              )}

              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask JARVIS anything about your research..."
                    className="pr-24 py-4 glass-effect border-white/30 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-full text-base bg-white/70 dark:bg-slate-800/70 focus:bg-white/90 dark:focus:bg-slate-800/90 transition-all duration-200 shadow-lg focus:shadow-xl"
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
                      className="text-slate-500 dark:text-blue-500 hover:text-blue-600 p-2 h-8 w-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 transition-all duration-200"
                      disabled={isLoading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip size={16} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className={`p-2 h-8 w-8 rounded-full hover:scale-110 transition-all duration-200 ${
                        isRecording
                          ? "text-red-500 bg-red-100 dark:bg-red-900/30"
                          : "text-slate-500 dark:text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      }`}
                      disabled={isLoading}
                      onClick={handleVoiceInput}
                    >
                      <Mic size={16} />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full min-w-[48px] hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? <Loader2 size={18} /> : <Send size={18} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnhancedBackground>
  );
}
