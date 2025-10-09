"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeometricBackground from "@/components/geometric-background";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  PinOff,
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
  Monitor,
  Presentation,
  Map,
  BookOpen,
  Sparkles,
  FileText,
  MessageSquare,
} from "lucide-react";
import Logo2D from "@/components/logo-2d";
import ModernLogo from "@/components/modern-logo";
import NavigationSidebar from "@/components/navigation-sidebar";
import { LLM_PROVIDERS, getModelById } from "@/lib/llm-providers";
import { useRouter } from "next/navigation";
import { SimpleThemeToggle } from "@/components/theme-toggle";

const CleanBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">{children}</div>
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
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  createdAt: Date;
  isPinned?: boolean;
  category: "recent" | "pinned" | "project";
  projectName?: string;
  topic?: string;
}

interface FilterState {
  searchText: string;
  dateRange: { from: Date | null; to: Date | null };
  category: string;
  topic: string;
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
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [activeTab, setActiveTab] = useState<
    "recent" | "pinned" | "project" | "shared"
  >("recent");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchText: "",
    dateRange: { from: null, to: null },
    category: "",
    topic: "",
  });

  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [showChatActions, setShowChatActions] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [chatTitles, setChatTitles] = useState<Record<string, string>>({});
  const [deletedChats, setDeletedChats] = useState<string[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("1");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
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
  ]);

  const router = useRouter();

  const getFilteredSessions = () => {
    return chatSessions.filter((session) => {
      // Filter out deleted chats
      if (deletedChats.includes(session.id)) {
        return false;
      }

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

      // Category filter
      if (
        filters.category &&
        !session.category.toLowerCase().includes(filters.category.toLowerCase())
      ) {
        return false;
      }

      // Topic filter
      if (
        filters.topic &&
        session.topic &&
        !session.topic.toLowerCase().includes(filters.topic.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const handleNewChat = () => {
    // Create a new chat session
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      preview: "Start a new conversation...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date(),
      category: "recent",
    };

    // Add new session to the beginning of the list
    setChatSessions([newSession, ...chatSessions]);

    // Set as current session
    setCurrentSessionId(newSessionId);

    // Reset messages
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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatTitle = (userMessage: string): string => {
    // Generate a concise title based on the first user message
    const words = userMessage.split(" ").slice(0, 5).join(" ");
    return words.length > 40 ? words.substring(0, 40) + "..." : words;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    const isFirstUserMessage = messages.length === 1; // Only welcome message
    const userMessageContent = inputMessage;

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setUploadedFiles([]); // Clear uploaded files after sending message
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

      // Update chat title if this is the first message in a new chat
      if (isFirstUserMessage) {
        const newTitle = generateChatTitle(userMessageContent);
        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === currentSessionId
              ? { ...session, title: newTitle, preview: userMessageContent }
              : session
          )
        );
      }
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredSessions = getFilteredSessions().filter((session) => {
    if (activeTab === "pinned") {
      return pinnedChats.includes(session.id) || session.isPinned;
    }
    if (activeTab === "recent") {
      return true; // Show all sessions including pinned ones
    }
    if (activeTab === "shared") {
      return false; // TODO: Implement shared sessions filtering
    }
    return session.category === activeTab;
  });

  const allModels = LLM_PROVIDERS.flatMap((provider) =>
    provider.models.map((model) => ({
      ...model,
      providerName: provider.name,
      fullId: model.id,
    }))
  );

  const selectedModelInfo = getModelById(selectedModel);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      console.log(
        "Files selected:",
        newFiles.map((f) => f.name)
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).filter((file) => {
        // Accept images and common document formats
        const validTypes = [
          "image/",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
          "text/markdown",
        ];
        return validTypes.some((type) => file.type.startsWith(type));
      });
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      console.log(
        "Files dropped:",
        newFiles.map((f) => f.name)
      );
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
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
        const chat = chatSessions.find((c) => c.id === action.chatId);
        if (chat) {
          setEditingChatId(action.chatId);
          setEditingTitle(chatTitles[action.chatId] || chat.title);
        }
        break;
      case "share":
        setShowShareModal(action.chatId);
        break;
      case "save":
        setShowSaveModal(action.chatId);
        break;
      case "delete":
        console.log("Deleting chat:", action.chatId);
        // Remove chat from state
        break;
    }
    setShowChatActions(null);
  };

  const handleInlineRename = (chatId: string) => {
    if (editingTitle.trim()) {
      setChatTitles((prev) => ({
        ...prev,
        [chatId]: editingTitle,
      }));
      setEditingChatId(null);
      setEditingTitle("");
    }
  };

  const togglePin = (chatId: string) => {
    setPinnedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleDeleteChat = (chatId: string) => {
    setDeletedChats((prev) => [...prev, chatId]);
    setShowDeleteModal(null);
  };

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setIsScreenSharing(true);

      // When user stops sharing
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setIsScreenSharing(false);
      });

      console.log("Screen sharing started", stream);
      // You can now use this stream to display or send to backend
    } catch (err) {
      console.error("Error sharing screen:", err);
      alert(
        "Failed to share screen. Please ensure you have granted screen sharing permissions."
      );
    }
  };

  const handleWhiteboard = () => {
    // Open Excalidraw (open-source whiteboard alternative) in new window
    window.open("https://excalidraw.com/", "_blank", "width=1200,height=800");
  };

  const handleShare = (chatId: string, options: ShareOptions) => {
    if (options.type === "external") {
      const shareLink = `${window.location.origin}/shared/${chatId}`;
      navigator.clipboard.writeText(shareLink);
      console.log("Created external share link:", shareLink);

      // Show notification inside modal
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 3000);

      // Don't close modal immediately - let user see the notification
    } else if (options.type === "collaborator") {
      const email = prompt("Enter collaborator email:");
      if (email) {
        console.log("Sharing with collaborator:", email);
        // Move to shared folder with collaborator indicator
      }
      setShowShareModal(null);
    }
  };

  return (
    <div className="h-screen flex bg-background dark:bg-gradient-to-br dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-900 relative overflow-hidden">
      <div className="dark:block hidden">
        <GeometricBackground variant="mobius" />
      </div>

      <NavigationSidebar />

      {/* Chat Sidebar */}
      <div className="hidden md:flex md:w-80 lg:w-96 border-r border-border bg-background flex-col relative z-10">
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
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
                  size={16}
                />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 pr-3 h-10"
                  value={filters.searchText}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      searchText: e.target.value,
                    }))
                  }
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
              <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
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
                  <label className="text-xs text-muted-foreground mb-1 block">
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

                {/* Category Filter - Text Input */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Category
                  </label>
                  <Input
                    placeholder="Enter category..."
                    className="text-xs"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Topic Filter - Text Input */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Topic
                  </label>
                  <Input
                    placeholder="Enter topic..."
                    className="text-xs"
                    value={filters.topic}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, topic: e.target.value }))
                    }
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
            <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
              {[
                { key: "recent", label: "Recent" },
                { key: "pinned", label: "Pinned" },
                { key: "project", label: "Projects" },
                { key: "shared", label: "Shared" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 py-2 px-2 rounded-md text-xs font-medium hover:cursor-pointer transition-all ${
                    activeTab === tab.key
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Sessions */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-5">
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
                          className="group p-4 bg-background cursor-pointer transition-all border border-border/30 rounded-lg hover:border-primary/50 hover:bg-gradient-to-r hover:from-accent/40 hover:to-transparent backdrop-blur-sm"
                          onClick={() => setCurrentSessionId(session.id)}
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            {editingChatId === session.id ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onBlur={() => handleInlineRename(session.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleInlineRename(session.id);
                                  } else if (e.key === "Escape") {
                                    setEditingChatId(null);
                                    setEditingTitle("");
                                  }
                                }}
                                className="h-6 text-sm flex-1 mr-2"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <h4 className="font-medium text-foreground text-sm truncate flex-1">
                                {chatTitles[session.id] || session.title}
                              </h4>
                            )}
                            <div className="flex items-center space-x-1">
                              {/* Pin button - visible on hover or when pinned (blue) */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-5 w-5 p-0 transition-all ${
                                  pinnedChats.includes(session.id)
                                    ? "opacity-100 bg-primary/10"
                                    : hoveredChat === session.id
                                    ? "hover:bg-primary/10 opacity-100"
                                    : "opacity-0"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(session.id);
                                }}
                              >
                                {pinnedChats.includes(session.id) &&
                                hoveredChat === session.id ? (
                                  <PinOff size={12} className="text-primary" />
                                ) : (
                                  <Pin
                                    size={12}
                                    className={
                                      pinnedChats.includes(session.id)
                                        ? "text-primary fill-primary"
                                        : "text-muted-foreground"
                                    }
                                  />
                                )}
                              </Button>
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "rename",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "share",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Share size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "save",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Save size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 hover:text-destructive transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowDeleteModal(session.id);
                                    }}
                                  >
                                    <Trash2 size={10} />
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
                      <h3 className="text-sm font-medium text-foreground dark:text-white">
                        Previous 7 Days
                      </h3>
                      <span className="text-xs text-muted-foreground dark:text-white/60">
                        {previousWeekSessions.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {previousWeekSessions.map((session) => (
                        <div
                          key={session.id}
                          className="group relative p-4 bg-background cursor-pointer transition-all border border-border/30 rounded-lg hover:border-primary/50 hover:bg-gradient-to-r hover:from-accent/40 hover:to-transparent backdrop-blur-sm"
                          onClick={() => setCurrentSessionId(session.id)}
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            {editingChatId === session.id ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onBlur={() => handleInlineRename(session.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleInlineRename(session.id);
                                  } else if (e.key === "Escape") {
                                    setEditingChatId(null);
                                    setEditingTitle("");
                                  }
                                }}
                                className="h-6 text-sm flex-1 mr-2"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <h4 className="font-medium text-foreground text-sm truncate flex-1">
                                {chatTitles[session.id] || session.title}
                              </h4>
                            )}
                            <div className="flex items-center space-x-1">
                              {/* Pin button - visible on hover or when pinned (blue) */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-5 w-5 p-0 transition-all ${
                                  pinnedChats.includes(session.id)
                                    ? "opacity-100 bg-primary/10"
                                    : hoveredChat === session.id
                                    ? "hover:bg-primary/10 opacity-100"
                                    : "opacity-0"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(session.id);
                                }}
                              >
                                {pinnedChats.includes(session.id) &&
                                hoveredChat === session.id ? (
                                  <PinOff size={12} className="text-primary" />
                                ) : (
                                  <Pin
                                    size={12}
                                    className={
                                      pinnedChats.includes(session.id)
                                        ? "text-primary fill-primary"
                                        : "text-muted-foreground"
                                    }
                                  />
                                )}
                              </Button>
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "rename",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "share",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Share size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "save",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Save size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 hover:text-destructive transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowDeleteModal(session.id);
                                    }}
                                  >
                                    <Trash2 size={10} />
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
                      <h3 className="text-sm font-medium text-foreground dark:text-white">
                        Older
                      </h3>
                      <span className="text-xs text-muted-foreground dark:text-white/60">
                        {olderSessions.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {olderSessions.map((session) => (
                        <div
                          key={session.id}
                          className="group relative p-4 bg-background cursor-pointer transition-all border border-border/30 rounded-lg hover:border-primary/50 hover:bg-gradient-to-r hover:from-accent/40 hover:to-transparent backdrop-blur-sm"
                          onClick={() => setCurrentSessionId(session.id)}
                          onMouseEnter={() => setHoveredChat(session.id)}
                          onMouseLeave={() => setHoveredChat(null)}
                        >
                          <div className="flex items-start justify-between mb-1">
                            {editingChatId === session.id ? (
                              <Input
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onBlur={() => handleInlineRename(session.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleInlineRename(session.id);
                                  } else if (e.key === "Escape") {
                                    setEditingChatId(null);
                                    setEditingTitle("");
                                  }
                                }}
                                className="h-6 text-sm flex-1 mr-2"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <h4 className="font-medium text-foreground text-sm truncate flex-1">
                                {chatTitles[session.id] || session.title}
                              </h4>
                            )}
                            <div className="flex items-center space-x-1">
                              {/* Pin button - visible on hover or when pinned (blue) */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className={`h-5 w-5 p-0 transition-all ${
                                  pinnedChats.includes(session.id)
                                    ? "opacity-100 bg-primary/10"
                                    : hoveredChat === session.id
                                    ? "hover:bg-primary/10 opacity-100"
                                    : "opacity-0"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(session.id);
                                }}
                              >
                                {pinnedChats.includes(session.id) &&
                                hoveredChat === session.id ? (
                                  <PinOff size={12} className="text-primary" />
                                ) : (
                                  <Pin
                                    size={12}
                                    className={
                                      pinnedChats.includes(session.id)
                                        ? "text-primary fill-primary"
                                        : "text-muted-foreground"
                                    }
                                  />
                                )}
                              </Button>
                              {hoveredChat === session.id && (
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "rename",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Edit3 size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "share",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Share size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleChatAction({
                                        type: "save",
                                        chatId: session.id,
                                      });
                                    }}
                                  >
                                    <Save size={10} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-5 w-5 p-0 hover:scale-125 hover:text-destructive transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowDeleteModal(session.id);
                                    }}
                                  >
                                    <Trash2 size={10} />
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

          {/* Share Modal */}
          {showShareModal && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => {
                setShowShareModal(null);
                setShowCopiedNotification(false);
              }}
            >
              <div
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Share Chat
                </h3>

                {/* Inline Copied Notification */}
                {showCopiedNotification && (
                  <div className="mb-4 bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-medium text-sm">
                      Link copied to clipboard
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-accent"
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
                    className="w-full justify-start bg-transparent hover:bg-accent"
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
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowShareModal(null);
                      setShowCopiedNotification(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Save Modal */}
          {showSaveModal && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowSaveModal(null)}
            >
              <div
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Save to Project
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Project Name
                    </label>
                    <Input placeholder="Enter project name..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Folder (Optional)
                    </label>
                    <Input placeholder="Enter folder name..." />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveModal(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("Saving chat:", showSaveModal);
                      setShowSaveModal(null);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowDeleteModal(null)}
            >
              <div
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600 dark:text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Delete Chat?
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="font-semibold text-foreground">
                    "
                    {chatTitles[showDeleteModal] ||
                      chatSessions.find((s) => s.id === showDeleteModal)
                        ?.title ||
                      "this chat"}
                    "
                  </span>{" "}
                  and all its messages.
                </p>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(null)}
                    className="border-2 border-primary text-primary hover:bg-primary/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (showDeleteModal) {
                        handleDeleteChat(showDeleteModal);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background relative z-10">
        {/* Chat Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <ModernLogo size={40} showText={false} />
                <div className="flex items-center space-x-2">
                  <div>
                    <h2 className="font-semibold text-foreground">
                      JARVIS RACE Research Assistant
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedModelInfo
                        ? `${selectedModelInfo.provider.name} • ${selectedModelInfo.model.name}`
                        : "Powered by AI"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-full sm:w-[240px] md:w-[280px] h-auto min-h-[36px] text-xs">
                    <div className="flex hover:cursor-pointer items-center gap-2.5 py-1">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="flex flex-col items-start flex-1">
                        <span className="font-medium text-sm">
                          {selectedModelInfo?.model.name || "GPT-4o"}
                        </span>
                        {selectedModel && (
                          <span className="text-[10px] text-muted-foreground line-clamp-1">
                            {selectedModel === "gpt-4o" &&
                              "Best for complex reasoning and analysis"}
                            {selectedModel === "gpt-4o-mini" &&
                              "Fast, efficient for simple tasks"}
                            {selectedModel === "o1-preview" &&
                              "Advanced reasoning with chain-of-thought"}
                            {selectedModel === "o1-mini" &&
                              "Lightweight reasoning model"}
                            {selectedModel === "claude-3-5-sonnet" &&
                              "Best for creative and nuanced content"}
                            {selectedModel === "claude-3-5-haiku" &&
                              "Fast Claude model for quick tasks"}
                            {selectedModel === "claude-3-opus" &&
                              "Most capable Claude for complex work"}
                            {selectedModel === "gemini-1.5-pro" &&
                              "Google's best for multimodal tasks"}
                            {selectedModel === "gemini-1.5-flash" &&
                              "Fast Google model for quick responses"}
                            {selectedModel === "gemini-2.0-flash-exp" &&
                              "Experimental features and capabilities"}
                            {selectedModel === "llama-3.1-sonar-large" &&
                              "Open-source with web search"}
                            {selectedModel === "llama-3.1-sonar-small" &&
                              "Lightweight with web search"}
                            {selectedModel === "llama-3.1-sonar-huge" &&
                              "Most powerful open-source option"}
                            {selectedModel === "grok-2-1212" &&
                              "Latest Grok with real-time knowledge"}
                            {selectedModel === "grok-2-vision-1212" &&
                              "Grok with image understanding"}
                            {selectedModel === "deepseek-r1" &&
                              "Specialized for research tasks"}
                            {selectedModel ===
                              "deepseek-r1-distill-llama-70b" &&
                              "Research-focused, large model"}
                            {selectedModel === "mixtral-8x7b" &&
                              "Efficient mixture of experts model"}
                            {selectedModel === "mixtral-8x22b" &&
                              "Large MoE for complex tasks"}
                            {selectedModel === "mistral-large" &&
                              "Mistral's flagship model"}
                            {selectedModel === "mistral-nemo" &&
                              "Balanced performance model"}
                            {selectedModel === "nemotron-70b" &&
                              "NVIDIA's large language model"}
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="w-[320px]">
                    {LLM_PROVIDERS.map((provider) => (
                      <SelectGroup key={provider.id}>
                        <SelectLabel className="text-xs font-semibold">
                          {provider.name}
                        </SelectLabel>
                        {provider.models.map((model) => (
                          <SelectItem
                            key={model.id}
                            value={model.id}
                            className="text-xs hover:cursor-pointer py-3"
                          >
                            <div className="flex flex-col gap-1 hover:cursor-pointer">
                              <div className="flex items-center gap-2 ">
                                <span className="font-medium">
                                  {model.name}
                                </span>
                                {model.isPro && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs h-4 px-1"
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
                                  "Fast Claude model for quick tasks"}
                                {model.id === "claude-3-opus" &&
                                  "Most capable Claude for complex work"}
                                {model.id === "gemini-1.5-pro" &&
                                  "Google's best for multimodal tasks"}
                                {model.id === "gemini-1.5-flash" &&
                                  "Fast Google model for quick responses"}
                                {model.id === "gemini-2.0-flash-exp" &&
                                  "Experimental features and capabilities"}
                                {model.id === "llama-3.1-sonar-large" &&
                                  "Open-source with web search"}
                                {model.id === "llama-3.1-sonar-small" &&
                                  "Lightweight with web search"}
                                {model.id === "llama-3.1-sonar-huge" &&
                                  "Most powerful open-source option"}
                                {model.id === "grok-2-1212" &&
                                  "Latest Grok with real-time knowledge"}
                                {model.id === "grok-2-vision-1212" &&
                                  "Grok with image understanding"}
                                {model.id === "deepseek-r1" &&
                                  "Specialized for research tasks"}
                                {model.id === "deepseek-r1-distill-llama-70b" &&
                                  "Research-focused, large model"}
                                {model.id === "mixtral-8x7b" &&
                                  "Efficient mixture of experts model"}
                                {model.id === "mixtral-8x22b" &&
                                  "Large MoE for complex tasks"}
                                {model.id === "mistral-large" &&
                                  "Mistral's flagship model"}
                                {model.id === "mistral-nemo" &&
                                  "Balanced performance model"}
                                {model.id === "nemotron-70b" &&
                                  "NVIDIA's large language model"}
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
                  className="text-muted-foreground hover:cursor-pointer"
                >
                  <Settings size={16} />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:cursor-pointer"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 bg-background">
            <div className="max-w-5xl mx-auto space-y-6 px-3 sm:px-4 md:px-6 pt-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[85%] md:max-w-[80%] p-4 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-card-foreground border-l-2 border-primary"
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
                            className="bg-muted/30 p-4 rounded-xl border border-border"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-3">
                                <h4 className="text-sm font-medium text-foreground mb-2">
                                  {resource.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
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
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
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
          <div className="w-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
              {/* Sample Prompts - Show only when no messages */}
              {messages.length === 1 && (
                <div className="mb-6">
                  <div className="flex flex-wrap md:flex-nowrap items-center gap-2 justify-center">
                    {[
                      { text: "Summarize research paper", icon: FileText },
                      { text: "Explain topic simply", icon: MessageSquare },
                      { text: "Get research roadmap", icon: Map },
                      { text: "Literature survey", icon: BookOpen },
                      { text: "Research process", icon: Sparkles },
                    ].map((prompt, idx) => {
                      const PromptIcon = prompt.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => setInputMessage(prompt.text)}
                          className="px-2.5 py-1.5 bg-muted/30 hover:bg-primary border border-border rounded-lg text-left transition-all hover:border-primary hover:shadow-md group whitespace-nowrap"
                        >
                          <div className="flex items-center gap-1.5">
                            <PromptIcon
                              size={12}
                              className="text-muted-foreground group-hover:text-primary-foreground flex-shrink-0"
                            />
                            <span className="text-xs font-medium text-foreground group-hover:text-primary-foreground">
                              {prompt.text}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="mb-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="p-3 bg-muted/30 border border-border rounded-xl flex items-center justify-between hover:border-primary transition-fast"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span className="text-sm text-foreground font-medium">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive p-1 h-6 w-6"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Container */}
              <div
                className={`w-full flex items-end gap-3 transition-all relative ${
                  isDragging
                    ? "ring-2 ring-primary ring-offset-2 rounded-[32px]"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isDragging && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-[32px] flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-primary font-semibold text-lg flex items-center gap-2">
                      <Paperclip size={20} />
                      Drop files here
                    </div>
                  </div>
                )}

                <div className="flex-1 relative min-w-0">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about your project..."
                    className="w-full h-14 md:h-16 pl-5 pr-28 text-base md:text-lg rounded-2xl focus:border-primary transition-all"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.md,image/*"
                      multiple
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-lg hover:bg-accent"
                      disabled={isLoading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip size={20} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-muted-foreground hover:text-foreground h-10 w-10 rounded-lg hover:bg-accent ${
                        isRecording ? "text-destructive animate-pulse" : ""
                      }`}
                      disabled={isLoading}
                      onClick={handleVoiceInput}
                    >
                      <Mic size={20} />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-14 md:h-16 w-14 md:w-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex-shrink-0 transition-all hover:scale-105"
                >
                  {isLoading ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <Send size={22} />
                  )}
                </Button>
              </div>

              {/* Tools Row */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`${
                    isScreenSharing
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  } hover:text-foreground hover:bg-accent px-3 py-2 h-9 rounded-lg flex items-center gap-2`}
                  onClick={handleShareScreen}
                >
                  <Monitor size={16} />
                  <span className="text-xs font-medium">
                    {isScreenSharing ? "Sharing..." : "Share Screen"}
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-2 h-9 rounded-lg flex items-center gap-2"
                  onClick={handleWhiteboard}
                >
                  <Presentation size={16} />
                  <span className="text-xs font-medium">Whiteboard</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
