"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Block } from "@/app/types/blocks";


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
  ArrowUpRight,
} from "lucide-react";
import Logo2D from "@/components/logo-2d";
import ModernLogo from "@/components/modern-logo";
import NavigationSidebar from "@/components/navigation-sidebar";
import { LLM_PROVIDERS, getModelById } from "@/lib/llm-providers";
import { useRouter } from "next/navigation";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import Markdown from "@/components/Markdown";
import { useProjects } from "@/app/context/ProjectContext";
import BlockRenderer from "@/components/BlockRenderer";
import Whiteboard from "@/components/Whiteboard";
import ScreenShareOverlay from "@/components/ScreenShareOverlay";
import { ChatProvider } from "../context/ChatContext";
import { useChatContext, ChatSession as ContextChatSession } from "../context/ChatContext";
import { useToast } from "@/components/ui/use-toast";

const CleanBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-aurora">{children}</div>
);



interface Message {
  id: string;
  content?: string;
  sender: "user" | "assistant";
  timestamp: Date;
  resources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  blocks?: Block[];
}

interface LocalChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  createdAt: Date;
  updatedAt?: Date | string;
  isPinned?: boolean;
  category: "recent" | "pinned" | "project";
  projectName?: string;
  topic?: string;
  messages?: any[];
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
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // Init empty for hydration match
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
  const { toast } = useToast();
  const [showCollaboratorInput, setShowCollaboratorInput] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const { setIsGenerating } = useChatContext();

  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  // Sync loading state to global context for logo animation
  useEffect(() => {
    setIsGenerating(isLoading);
  }, [isLoading, setIsGenerating]);

  useEffect(() => {
    setIsMounted(true);
    // Initial welcome message removed for "New Chat" empty state experience
  }, []);

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
  const { chatSessions, setChatSessions } = useChatContext();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const mapContextMessageToLocal = (msg: any): Message => ({
    id: msg.id,
    content: msg.content,
    sender: (msg.role === "USER" || msg.role === "user") ? "user" : "assistant",
    timestamp: new Date(msg.createdAt),
    blocks: [{ type: "paragraph", text: msg.content }],
  });

  const mapContextSessionToLocal = (session: ContextChatSession): LocalChatSession => {
    let preview = "No messages";
    if (session.messages?.length > 0) {
      const rawContent = session.messages[session.messages.length - 1].content || "";
      // Clean Markdown
      const cleanContent = rawContent.replace(/[#*`]/g, "").trim();
      // Replace newlines with hyphen
      const oneLine = cleanContent.replace(/\n+/g, " - ");
      // Capitalize
      preview = oneLine.charAt(0).toUpperCase() + oneLine.slice(1);
      // Truncate
      if (preview.length > 100) preview = preview.slice(0, 100) + "...";
    }

    return {
      id: session.id,
      title: session.title || "New Chat",
      preview: preview,
      timestamp: new Date(session.updatedAt || session.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt || session.createdAt),
      isPinned: session.isPinned,
      category: session.isPinned ? "pinned" : "recent", // Simple logic for now
      projectName: session.projectId, // Optional
    };
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      const mappedMessages = session.messages?.map(mapContextMessageToLocal) || [];
      setMessages(mappedMessages);
      // Reset input content and attachments
      setInputMessage("");
      setUploadedFiles([]);
    }
  };

  const router = useRouter();

  const getFilteredSessions = () => {
    const localSessions = chatSessions.map(mapContextSessionToLocal);
    return localSessions.filter((session: LocalChatSession) => {
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
    const welcomeMessage = {
      id: "1",
      content: "Welcome to JARVIS Chat! How can I assist with your research today?",
      sender: "assistant",
      timestamp: new Date(),
      role: "ASSISTANT", // For context compatibility
      createdAt: new Date().toISOString(),
    };

    const newSession: LocalChatSession = {
      id: newSessionId,
      title: "New Chat",
      preview: "Start a new conversation...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: new Date(),
      category: "recent",
      messages: [welcomeMessage], // Initialize with welcome message
    };

    // Add new session to the beginning of the list
    setChatSessions([newSession as unknown as ContextChatSession, ...chatSessions]);

    // Set as current session
    setCurrentSessionId(newSessionId);

    // Reset messages
    setMessages([welcomeMessage as unknown as Message]);
    setInputMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatTitle = (userMessage: string): string => {
    // Heuristic: Remove conversational filler and extract topic
    const stopWords = new Set([
      "hey", "hi", "hello", "jarvis", "please", "can", "could", "would", "you",
      "write", "explain", "tell", "me", "about", "what", "how", "why", "is", "a", "an", "the",
      "help", "with", "create", "make", "generate", "code"
    ]);

    const cleanMessage = userMessage.trim().replace(/[^\w\s]/gi, ''); // Remove punctuation
    const words = cleanMessage.split(/\s+/);

    // Filter out stop words (case insensitive)
    const topicWords = words.filter(w => !stopWords.has(w.toLowerCase()));

    // Sort of overly aggressive? If nothing is left (e.g. "Hi how are you"), use original words.
    // If we have some topic words, use the first 3-4 of them.
    const finalWords = topicWords.length > 0 ? topicWords.slice(0, 4) : words.slice(0, 4);

    // Title Case
    const title = finalWords
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    return title.length > 30 ? title.substring(0, 30) + "..." : title;
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && uploadedFiles.length === 0) || isLoading) return;

    // Process files
    const processedFiles = await Promise.all(uploadedFiles.map(async (file) => {
      return new Promise<{ type: 'image' | 'text', content: string, mime: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (file.type.startsWith('image/')) {
            resolve({ type: 'image', content: result, mime: file.type });
          } else if (file.type.startsWith('audio/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
            // Read as Data URL for playback/preview
            resolve({ type: 'text', content: result, mime: file.type }); // We use 'text' as a carrier for the dataURL string in this simplified promise return, but handle it by mime later
          } else {
            // Check if text-readable
            if (file.type.startsWith('text/') || file.name.match(/\.(md|json|js|ts|tsx|csv|txt)$/)) {
              resolve({ type: 'text', content: result, mime: file.type });
            } else {
              resolve({ type: 'text', content: `[Attached File: ${file.name}]`, mime: file.type });
            }
          }
        };

        if (file.type.startsWith('image/') || file.type.startsWith('audio/') || file.type.startsWith('video/') || file.type === 'application/pdf') {
          reader.readAsDataURL(file);
        } else if (file.type.startsWith('text/') || file.name.match(/\.(md|json|js|ts|tsx|csv|txt)$/)) {
          reader.readAsText(file);
        } else {
          resolve({ type: 'text', content: `[Attached File: ${file.name}]`, mime: file.type });
        }
      });
    }));

    // Local UI Message
    const userMessage: Message = {
      id: Date.now().toString(),
      blocks: [
        { type: "paragraph", text: inputMessage },
        // Blocks will be populated by processedFiles loop below
      ],
      sender: "user",
      timestamp: new Date(),
    };

    // Check for user messages specifically to ignore welcome messages
    const isFirstUserMessage = messages.filter(m => m.sender === "user").length === 0;
    const userMessageContent = inputMessage;

    // Add Multimedia Blocks locally
    processedFiles.forEach(f => {
      if (f.type === 'image') {
        userMessage.blocks!.push({ type: "image", url: f.content, alt: "User Upload" });
      } else if (f.mime.startsWith('audio/')) {
        userMessage.blocks!.push({ type: "audio", url: f.content });
      } else if (f.mime.startsWith('video/')) {
        userMessage.blocks!.push({ type: "video", url: f.content });
      } else if (f.mime.startsWith('application/pdf') || f.type === 'text') {
        // If we have content (text), we might display it differently, but for now treating PDF as file download
        // For text files we read, we don't necessarily need a 'file' block if we injected logic, 
        // but user might want to see the file icon.
        const filename = uploadedFiles.find(uf => uf.type === f.mime || (f.mime === 'text/plain' && uf.name.endsWith('.txt')))?.name || "Attached File";
        userMessage.blocks!.push({ type: "file", url: f.content, name: filename, size: "File" });
      }
    });

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      // Construct API Content - Multimodal
      const apiContent: any[] = [];

      // 1. Add Text
      if (inputMessage) apiContent.push({ type: "text", text: inputMessage });

      // 2. Add processed files
      processedFiles.forEach(f => {
        if (f.type === 'image') {
          apiContent.push({ type: "image", image: f.content });
        } else if (f.type === 'text') {
          apiContent.push({ type: "text", text: `\n\n--- File: ${f.content.startsWith('[Attached') ? '' : 'Attached content'} ---\n${f.content}\n--- End File ---\n` });
        }
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              sender: msg.sender,
              content:
                msg.sender === "user"
                  ? (msg.blocks?.[0] as any)?.text || msg.content || ""
                  : msg.content || ""
            })),
            {
              sender: "user",
              content: apiContent // Send array!
            }
          ],
          model: selectedModel,
          includeResources: true
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const assistantMessage: Message = {
        id: data.message.id,
        blocks: data.message.blocks, // <-- blocks structure returned from API
        sender: "assistant",
        timestamp: new Date(),
        resources: data.message.resources,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update ChatSessions with new messages and title (if applicable)
      setChatSessions((prev) => {
        const sessionExists = prev.some(s => s.id === currentSessionId);

        // Define updated messages list shared by both paths
        const updatedMessagesList = [
          ...messages,
          userMessage,
          assistantMessage
        ].map(msg => {
          let content = msg.content || "";
          if (!content && msg.blocks && msg.blocks.length > 0) {
            content = msg.blocks
              .map(block => {
                if ("text" in block) return block.text;
                if ("code" in block) return `\`\`\`${block.language || ''}\n${block.code}\n\`\`\``;
                if ("items" in block) return block.items.map(item => `- ${item}`).join('\n');
                return "";
              })
              .filter(Boolean)
              .join('\n\n');
          }
          return {
            id: msg.id,
            sessionId: currentSessionId,
            senderId: msg.sender === 'user' ? 'USER' : 'ASSISTANT',
            content: content,
            createdAt: msg.timestamp.toISOString(),
            isEdited: false,
            editedAt: "",
            role: (msg.sender === 'user' ? 'USER' : 'ASSISTANT') as "USER" | "ASSISTANT"
          };
        });

        const previewText = userMessageContent.slice(0, 100) + (userMessageContent.length > 100 ? "..." : "");
        const formattedPreview = previewText.charAt(0).toUpperCase() + previewText.slice(1);

        if (sessionExists) {
          return prev.map((session) => {
            if (session.id === currentSessionId) {
              // Extract Title from Assistant Response (Priority 1)
              let extractedTitle = "";
              const fullAssistText = assistantMessage.content || assistantMessage.blocks?.map(b => (b as any).text || (b as any).content || "").join("\n") || "";

              // Regex to find Markdown Headings (# Header) or Strong Headers (**Header**)
              const headerMatch = fullAssistText.match(/^\s*#{1,6}\s+(.+?)\s*$/m);
              const boldMatch = fullAssistText.match(/^\s*(\*\*|__)(.+?)(\*\*|__)\s*$/m);

              if (headerMatch) extractedTitle = headerMatch[1];
              else if (boldMatch) extractedTitle = boldMatch[2];

              // Clean up extracted title if found
              if (extractedTitle) {
                extractedTitle = extractedTitle.trim().replace(/[:.]/g, ''); // Remove trailing colons/periods
                if (extractedTitle.length > 40) extractedTitle = ""; // Ignore if too long (likely a paragraph)
              }

              // Force title update if it's the first message OR if title is still generic
              const isGenericTitle = session.title === "New Chat" || session.title === "New Session" || session.title === "Hello API";

              const newTitle = (isFirstUserMessage || isGenericTitle)
                ? (extractedTitle || generateChatTitle(userMessageContent))
                : session.title;

              return {
                ...session,
                messages: updatedMessagesList,
                title: newTitle,
                preview: formattedPreview,
                updatedAt: new Date()
              };
            }
            return session;
          });
        } else {
          // Create New Session (Check-Or-Create Pattern)
          let extractedTitle = "";
          const fullAssistText = assistantMessage.content || assistantMessage.blocks?.map(b => (b as any).text || (b as any).content || "").join("\n") || "";

          const headerMatch = fullAssistText.match(/^\s*#{1,6}\s+(.+?)\s*$/m);
          const boldMatch = fullAssistText.match(/^\s*(\*\*|__)(.+?)(\*\*|__)\s*$/m);

          if (headerMatch) extractedTitle = headerMatch[1];
          else if (boldMatch) extractedTitle = boldMatch[2];

          if (extractedTitle) {
            extractedTitle = extractedTitle.trim().replace(/[:.]/g, '');
            if (extractedTitle.length > 40) extractedTitle = "";
          }

          const newTitle = extractedTitle || generateChatTitle(userMessageContent);

          const newSession: ChatSession = {
            id: currentSessionId,
            title: newTitle,
            preview: formattedPreview,
            date: "Today",
            messages: updatedMessagesList,
            model: selectedModel,
            updatedAt: new Date(),
            createdAt: new Date(),
            projectId: null
          };
          return [newSession, ...prev];
        }
      });

      // //post that assistant response to backend
      // await fetch("http://localhost:5000/chat/message", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     sessionId: currentSessionId,
      //     senderId: "ASSISTANT",
      //     role: "ASSISTANT",
      //     content: assistantMessage.blocks?.[0]?.text || assistantMessage.content || "",
      //   }),
      // });

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        blocks: [
          {
            type: "paragraph",
            text: "I apologize, but I'm having trouble connecting right now. Please try again later."
          }
        ],
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
      // Update local state
      setChatTitles((prev) => ({
        ...prev,
        [chatId]: editingTitle,
      }));

      // Update global context so filtering works
      setChatSessions((prev) => prev.map(s =>
        s.id === chatId ? { ...s, title: editingTitle } : s
      ));

      setEditingChatId(null);
      setEditingTitle("");
      toast({ title: "Renamed", description: "Chat title updated." });
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

  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      setScreenStream(stream);
      setIsScreenSharing(true);
    } catch (err) {
      console.error("Error sharing screen:", err);
      // User cancelled or ignored
    }
  };

  const handleAttachmentFromTool = (file: File) => {
    setUploadedFiles(prev => [...prev, file]);
    toast({
      title: "captured content added",
      description: `${file.name} attached.`
    });
  };

  const handleWhiteboard = () => {
    setShowWhiteboard(true);
  };

  const handleShare = (chatId: string, options: ShareOptions) => {
    if (options.type === "external") {
      const shareLink = `${window.location.origin}/shared/${chatId}`;
      navigator.clipboard.writeText(shareLink);
      console.log("Created external share link:", shareLink);

      // Show toast notification
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard.",
      });
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 3000);

    } else if (options.type === "collaborator") {
      // Toggle input view in modal
      setShowCollaboratorInput(true);
    }
  };

  const handleInviteCollaborator = () => {
    if (collaboratorEmail.trim()) {
      console.log("Sharing with collaborator:", collaboratorEmail);
      toast({
        title: "Invitation Sent",
        description: `Shared chat with ${collaboratorEmail}`,
      });
      setShowShareModal(null);
      setShowCollaboratorInput(false);
      setCollaboratorEmail("");
    }
  };

  return (
    <div
      className="h-screen flex bg-background dark:bg-gradient-to-br dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-900 relative overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="dark:block hidden">
        <GeometricBackground variant="orb" />
      </div>

      {isDragging && (
        <div className="absolute inset-0 z-[100] bg-primary/20 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-primary m-4 rounded-xl pointer-events-none">
          <div className="text-3xl font-bold text-primary flex items-center gap-4 bg-background/80 p-8 rounded-2xl shadow-2xl">
            <Paperclip size={48} />
            Drop files to attach
          </div>
        </div>
      )}

      <NavigationSidebar />

      {/* Chat Sidebar */}
      <div className="hidden md:flex md:w-80 lg:w-96 bg-background/50 backdrop-blur-sm flex-col relative z-10">
        {/* Sidebar Header */}
        <div className="p-4">
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
          <div className="mb-4 w-full border-border">
            <div
              className="
                  flex items-center gap-3 
                  h-10 px-4 
                  rounded-lg
                  focus-within:outline-none
                  focus-within:ring-0
                  focus-within:border-gray-600
                  bg-transparent 
                  border border-gray-600
                "
            >
              <Search className="w-4 h-4 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search conversations..."
                className="
                    w-full 
                    bg-transparent 
                    focus:outline-none
                    focus:ring-0
                    focus-visible:outline-none
                    focus-visible:ring-0
                    outline-none 
                    border-none
                    text-foreground
                    placeholder:text-muted-foreground
                  "
                style={{
                  boxShadow: "none",
                  WebkitBoxShadow: "none",
                  outline: "none",
                  border: "none",
                }}
                value={filters.searchText}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchText: e.target.value,
                  }))
                }
              />
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
                      ? `${filters.dateRange.from?.toLocaleDateString() ||
                      "Start"
                      } - ${filters.dateRange.to?.toLocaleDateString() || "End"
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
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold hover:cursor-pointer transition-all duration-200 ${activeTab === tab.key
                  ? "active-nav-minimal"
                  : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/5 hover:text-foreground"
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
            {!isMounted ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* Time-Based Grouping Section */}
                {isMounted && (activeTab === 'recent' || activeTab === 'pinned') && (
                  (() => {
                    const now = new Date();
                    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    const yesterdayStart = new Date(todayStart);
                    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

                    const todaySessions: LocalChatSession[] = [];
                    const yesterdaySessions: LocalChatSession[] = [];
                    const olderSessions: LocalChatSession[] = [];

                    filteredSessions.forEach(session => {
                      // Use UpdatedAt for sorting/grouping, falling back to CreatedAt
                      const date = session.updatedAt ? new Date(session.updatedAt) : new Date(session.createdAt);
                      if (date >= todayStart) {
                        todaySessions.push(session);
                      } else if (date >= yesterdayStart) {
                        yesterdaySessions.push(session);
                      } else {
                        olderSessions.push(session);
                      }
                    });

                    const renderSessionCard = (session: LocalChatSession) => (
                      <div
                        key={session.id}
                        className={`group relative p-4 cursor-pointer transition-all border rounded-xl mb-2 backdrop-blur-sm ${currentSessionId === session.id
                          ? 'active-chat-border bg-accent/20 shadow-lg'
                          : 'bg-background border-border/30 hover:border-primary/50 hover:bg-gradient-to-r hover:from-accent/40 hover:to-transparent'
                          }`}
                        onClick={() => handleSelectSession(session.id)}
                        onMouseEnter={() => setHoveredChat(session.id)}
                        onMouseLeave={() => setHoveredChat(null)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          {editingChatId === session.id ? (
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
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
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-5 w-5 p-0 transition-all hover:scale-125 ${pinnedChats.includes(session.id)
                                ? "opacity-100 bg-blue-50 text-blue-700 dark:bg-white/10 dark:text-blue-400"
                                : hoveredChat === session.id
                                  ? "hover:bg-blue-50 hover:text-blue-700 opacity-100 dark:hover:bg-white/10 dark:hover:text-blue-400"
                                  : "opacity-0"
                                } cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(session.id);
                              }}
                            >
                              {pinnedChats.includes(session.id) && hoveredChat === session.id ? (
                                <PinOff size={12} className="text-blue-700 dark:text-blue-400" />
                              ) : (
                                <Pin
                                  size={12}
                                  className={
                                    pinnedChats.includes(session.id)
                                      ? "text-blue-700 fill-blue-700 dark:text-blue-400 dark:fill-blue-400"
                                      : "text-muted-foreground hover:text-blue-700 dark:text-muted-foreground dark:hover:text-blue-400"
                                  }
                                />
                              )}
                            </Button>
                            {hoveredChat === session.id && (
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 hover:scale-125 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-white/10 dark:hover:text-blue-400 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChatAction({ type: "rename", chatId: session.id });
                                  }}
                                >
                                  <Edit3 size={10} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 hover:scale-125 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-white/10 dark:hover:text-blue-400 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChatAction({ type: "share", chatId: session.id });
                                  }}
                                >
                                  <Share size={10} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 hover:scale-125 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-white/10 dark:hover:text-blue-400 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChatAction({ type: "save", chatId: session.id });
                                  }}
                                >
                                  <Save size={10} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-5 w-5 p-0 hover:scale-125 transition-all duration-200 hover:bg-red-50 hover:text-destructive dark:hover:bg-red-900/10 dark:hover:text-red-400 cursor-pointer"
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
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                              {session.projectName}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );

                    return (
                      <div className="space-y-6">
                        {/* Today Items */}
                        {todaySessions.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3 px-2">
                              <h3 className="text-sm font-medium text-foreground">Today</h3>
                              <span className="text-xs text-muted-foreground">{todaySessions.length}</span>
                            </div>
                            <div className="space-y-2">
                              {todaySessions.map(renderSessionCard)}
                            </div>
                          </div>
                        )}

                        {/* Yesterday Items */}
                        {yesterdaySessions.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3 px-2">
                              <h3 className="text-sm font-medium text-foreground">Yesterday</h3>
                              <span className="text-xs text-muted-foreground">{yesterdaySessions.length}</span>
                            </div>
                            <div className="space-y-2">
                              {yesterdaySessions.map(renderSessionCard)}
                            </div>
                          </div>
                        )}

                        {/* Older Items */}
                        {olderSessions.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-3 px-2">
                              <h3 className="text-sm font-medium text-foreground">Older</h3>
                              <span className="text-xs text-muted-foreground">{olderSessions.length}</span>
                            </div>
                            <div className="space-y-2">
                              {olderSessions.map(renderSessionCard)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}

                {/* Projects View */}
                {isMounted && activeTab === 'project' && (
                  <div className="space-y-6">
                    {/* Mock Projects for now - ideally comes from ProjectContext */}
                    {['Research Alpha', 'Project Beta', 'Thesis 2024'].map(project => {
                      const projectSessions = filteredSessions.filter(s => s.projectName === project);
                      if (projectSessions.length === 0) return null;

                      return (
                        <div key={project}>
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <div className="p-1 bg-primary/10 rounded">
                              <BookOpen size={12} className="text-primary" />
                            </div>
                            <h3 className="text-sm font-medium text-foreground">{project}</h3>
                            <span className="text-xs text-muted-foreground ml-auto">{projectSessions.length}</span>
                          </div>
                          <div className="space-y-2 pl-2 border-l border-border/50 ml-3">
                            {projectSessions.map(session => (
                              <div
                                key={session.id}
                                className={`group p-3 rounded-xl cursor-pointer transition-all duration-300 mb-2 border ${currentSessionId === session.id
                                  ? 'active-chat-border bg-accent/20 dark:bg-accent/10 shadow-lg'
                                  : 'border-transparent hover:bg-accent/50 hover:border-border/50'
                                  }`}
                                onClick={() => handleSelectSession(session.id)}
                              >
                                <h4 className="font-medium text-sm truncate mb-0.5">{session.title}</h4>
                                <p className="text-xs text-muted-foreground truncate">{session.preview}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                    {/* Uncategorized / Others */}
                    {(() => {
                      const uncategorized = filteredSessions.filter(s => !s.projectName || !['Research Alpha', 'Project Beta', 'Thesis 2024'].includes(s.projectName));
                      if (uncategorized.length === 0) return null;
                      return (
                        <div>
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Uncategorized</h3>
                            <span className="text-xs text-muted-foreground ml-auto">{uncategorized.length}</span>
                          </div>
                          <div className="space-y-2 pl-2 border-l border-border/50 ml-3">
                            {uncategorized.map(session => (
                              <div
                                key={session.id}
                                className={`group p-3 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-accent/50 ${currentSessionId === session.id ? 'bg-accent border-border shadow-sm' : ''}`}
                                onClick={() => handleSelectSession(session.id)}
                              >
                                <h4 className="font-medium text-sm truncate mb-0.5">{session.title}</h4>
                                <p className="text-xs text-muted-foreground truncate">{session.preview}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Shared View */}
                {isMounted && activeTab === 'shared' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                      <div className="flex items-center gap-2 text-blue-500 mb-1">
                        <Users size={16} />
                        <h3 className="font-semibold text-sm">Shared with Teammates</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Chats you've shared with collaborators or the team.
                      </p>
                    </div>

                    {/* Mock Shared List - defaulting to showing all for demo purposes or strictly shared if property exists */}
                    {filteredSessions.map(session => (
                      <div
                        key={session.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer border border-transparent hover:border-border transition-all"
                        onClick={() => handleSelectSession(session.id)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          TM
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4 className="font-medium text-sm truncate">{session.title}</h4>
                            <span className="text-[10px] text-muted-foreground">{session.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-1.5">{session.preview}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                              Shared
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">by You</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </>
            )}
          </div>
        </ScrollArea>

        {/* Share Modal */}
        {showShareModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999]"
            style={{ pointerEvents: 'auto', backdropFilter: 'blur(8px)' }}
            onClick={() => {
              setShowShareModal(null);
              setShowCopiedNotification(false);
              setShowCollaboratorInput(false);
              setCollaboratorEmail("");
            }}
          >
            <div
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4 relative z-[10000]"
              style={{ pointerEvents: 'auto' }}
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

              {!showCollaboratorInput ? (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-accent cursor-pointer h-12"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() =>
                      handleShare(showShareModal, { type: "external" })
                    }
                  >
                    <Link size={18} className="mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Copy Link</span>
                      <span className="text-xs text-muted-foreground">Anyone with link can view</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      External
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent hover:bg-accent cursor-pointer h-12"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() =>
                      handleShare(showShareModal, { type: "collaborator" })
                    }
                  >
                    <Users size={18} className="mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">Invite Collaborators</span>
                      <span className="text-xs text-muted-foreground">Share securely with team</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Internal
                    </Badge>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block text-foreground">
                      Collaborator Email
                    </label>
                    <Input
                      placeholder="colleague@example.com"
                      className="bg-background"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInviteCollaborator()}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      They will receive a notification to join this chat.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="w-full"
                      onClick={handleInviteCollaborator}
                      disabled={!collaboratorEmail.trim()}
                    >
                      Send Invite
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowCollaboratorInput(false)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}

              {!showCollaboratorInput && (
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() => {
                      setShowShareModal(null);
                      setShowCopiedNotification(false);
                    }}
                  >
                    Done
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999]"
            style={{ pointerEvents: 'auto', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowSaveModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4 relative z-[10000]"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Save to Project
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Project / Organization Name
                  </label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="w-full" style={{ pointerEvents: 'auto' }}>
                      <SelectValue placeholder="Select a project..." />
                    </SelectTrigger>
                    <SelectContent className="z-[10001]"> {/* High z-index for modal */}
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Chat will be saved to the <strong>Chats</strong> folder of this project.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setShowSaveModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  disabled={!selectedProjectId}
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => {
                    const project = projects.find(p => p.id === selectedProjectId);
                    console.log(`Saving chat ${showSaveModal} to Project: ${project?.name}`);
                    toast({
                      title: "Chat Saved",
                      description: `Saved to 'Chats' folder in Project: ${project?.name}`
                    });
                    // Logic to actually move the chat would go here (e.g. update projectId in chatSession)
                    // setChatSessions(prev => prev.map(c => c.id === showSaveModal ? { ...c, projectId: selectedProjectId } : c))
                    setShowSaveModal(null);
                    setSelectedProjectId("");
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
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[9999]"
            style={{ pointerEvents: 'auto', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowDeleteModal(null)}
          >
            <div
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-md w-full mx-4 relative z-[10000]"
              style={{ pointerEvents: 'auto' }}
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
                  className="border-2 border-primary text-primary hover:bg-primary/10 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setShowDeleteModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700 cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => {
                    if (showDeleteModal) {
                      handleDeleteChat(showDeleteModal);
                    }
                  }}
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
                <SelectContent className="w-[320px] bg-popover/95 backdrop-blur-xl border border-border shadow-2xl">
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
          <div className="max-w-5xl mx-auto space-y-6 px-3 sm:px-4 md:px-6 pt-6 min-h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="mb-8 p-4 bg-primary/5 rounded-full">
                  <ModernLogo size={64} showText={false} />
                </div>
                <h2 className="text-3xl font-bold font-space-grotesk mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-white dark:to-gray-300">
                  How can I help with your research?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Ask questions, analyze papers, or get help with your writing.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl">
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => setInputMessage("Summarize research paper")}
                  >
                    <FileText size={16} className="text-primary" />
                    <span>Summarize research paper</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => setInputMessage("Explain topic simply")}
                  >
                    <MessageSquare size={16} className="text-primary" />
                    <span>Explain topic simply</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => setInputMessage("Get research roadmap")}
                  >
                    <Map size={16} className="text-primary" />
                    <span>Get research roadmap</span>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-3 max-w-2xl">
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => setInputMessage("Literature survey")}
                  >
                    <BookOpen size={16} className="text-primary" />
                    <span>Literature survey</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => setInputMessage("Research process")}
                  >
                    <Sparkles size={16} className="text-primary" />
                    <span>Research process</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[95%] sm:max-w-[85%] md:max-w-[80%] p-4 ${message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-card-foreground border-l-2 border-primary"
                        }`}
                    >
                      <div className="message-bubble">
                        {message.blocks?.map((block, i) => (
                          <BlockRenderer key={i} block={block} />
                        ))}
                      </div>



                      {message.resources && message.resources.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <div className="text-xs font-medium text-muted-foreground mb-3">
                            <ul className="space-y-1">
                              {message.resources.map((resource, index) => (
                                <li
                                  key={index}
                                  onClick={() => window.open(resource.url, "_blank")}
                                  className="group flex items-center justify-between p-2 rounded-lg border border-border/40 hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                  <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                        {resource.title}
                                      </h4>
                                      <span className="text-[10px] text-muted-foreground opacity-50">•</span>
                                      <span className="text-[10px] text-muted-foreground truncate opacity-70">
                                        {new URL(resource.url).hostname.replace('www.', '')}
                                      </span>
                                    </div>
                                  </div>
                                  <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary opacity-50 group-hover:opacity-100 transition-all" />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <p
                        className={`text-xs mt-3 ${message.sender === "user"
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
                    <div className="bg-background/80 backdrop-blur-sm p-4 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="relative flex items-center justify-center animate-pulse-scale">
                          <div className="absolute inset-0 bg-blue-500/40 blur-xl rounded-full" />
                          <div className="relative drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                            <ModernLogo size={32} animated={true} showText={false} />
                          </div>
                        </div>
                        <span className="text-sm font-medium animate-text-wave bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                          JARVIS is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </>
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
                        className="px-2.5 py-1.5 bg-muted/30 border border-primary/20 rounded-lg text-left transition-all hover:bg-primary/5 hover:border-primary hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] hover:scale-[1.02] duration-300 cursor-pointer group whitespace-nowrap"
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
                    className="p-2 bg-muted/40 border border-border rounded-xl flex items-center justify-between hover:border-primary/50 transition-all group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                          <Paperclip size={14} />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-foreground font-medium truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
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
              className={`w-full flex items-end gap-3 transition-all relative ${isDragging
                ? "ring-2 ring-primary ring-offset-2 rounded-[32px]"
                : ""
                }`}
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
                    accept=".pdf,.doc,.docx,.txt,.md,.json,.js,.ts,.tsx,image/*,audio/*,video/*"
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
                    className={`text-muted-foreground hover:text-foreground h-10 w-10 rounded-lg hover:bg-accent ${isRecording ? "text-destructive animate-pulse" : ""
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
                className={`${isScreenSharing
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
                  } hover:text-foreground hover:bg-accent px-3 py-2 h-9 rounded-lg flex items-center gap-2`}
                onClick={handleScreenShare}
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
      </div >
      {/* Share Modal - Global Placement */}
      {
        showShareModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999]"
            style={{ pointerEvents: 'auto' }}
            onClick={() => {
              setShowShareModal(null);
              setShowCopiedNotification(false);
              setShowCollaboratorInput(false);
              setCollaboratorEmail("");
            }}
          >
            <div
              className="bg-background/95 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full mx-4 relative z-[10000] overflow-hidden"
              style={{ pointerEvents: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground font-space-grotesk tracking-tight">
                  Share Chat
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white/10"
                  onClick={() => setShowShareModal(null)}
                >
                  <X size={16} />
                </Button>
              </div>

              {/* Inline Copied Notification */}
              {showCopiedNotification && (
                <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-medium text-sm">
                    Link copied to clipboard
                  </span>
                </div>
              )}

              {!showCollaboratorInput ? (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-card/50 hover:bg-primary/5 hover:border-primary/30 cursor-pointer h-16 border-white/5 transition-all group"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() =>
                      handleShare(showShareModal, { type: "external" })
                    }
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                      <Link size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-foreground">Copy Link</span>
                      <span className="text-xs text-muted-foreground">Anyone with link can view</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-[10px] bg-white/5">
                      External
                    </Badge>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-card/50 hover:bg-primary/5 hover:border-primary/30 cursor-pointer h-16 border-white/5 transition-all group"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() =>
                      handleShare(showShareModal, { type: "collaborator" })
                    }
                  >
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-4 group-hover:bg-purple-500/20 transition-colors">
                      <Users size={18} className="text-purple-500" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-foreground">Invite Collaborators</span>
                      <span className="text-xs text-muted-foreground">Share securely with team</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-[10px] bg-white/5">
                      Internal
                    </Badge>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-foreground">
                      Collaborator Email
                    </label>
                    <Input
                      placeholder="colleague@example.com"
                      className="bg-black/20 border-white/10 h-10"
                      value={collaboratorEmail}
                      onChange={(e) => setCollaboratorEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInviteCollaborator()}
                      autoFocus
                    />
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                      <Users size={12} />
                      They will receive a notification to join this chat.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleInviteCollaborator}
                      disabled={!collaboratorEmail.trim()}
                    >
                      Send Invite
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowCollaboratorInput(false)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Save Modal - Global Placement */}
      {
        showSaveModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999]"
            style={{ pointerEvents: 'auto' }}
            onClick={() => setShowSaveModal(null)}
          >
            <div
              className="bg-background/95 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl max-w-md w-full mx-4 relative z-[10000] overflow-hidden"
              style={{ pointerEvents: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground font-space-grotesk tracking-tight">
                  Save to Project
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-white/10"
                  onClick={() => setShowSaveModal(null)}
                >
                  <X size={16} />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Project Name
                  </label>
                  <Input placeholder="Enter project name..." className="bg-black/20 border-white/10" style={{ pointerEvents: 'auto' }} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Folder (Optional)
                  </label>
                  <Input placeholder="Enter folder name..." className="bg-black/20 border-white/10" style={{ pointerEvents: 'auto' }} />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setShowSaveModal(null)}
                >
                  Cancel
                </Button>
                <Button className="cursor-pointer bg-primary hover:bg-primary/90" style={{ pointerEvents: 'auto' }}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )
      }

      {/* Integrated Creativity Tools */}
      {showWhiteboard && (
        <Whiteboard
          onClose={() => setShowWhiteboard(false)}
          onAttach={handleAttachmentFromTool}
        />
      )}

      {screenStream && (
        <ScreenShareOverlay
          stream={screenStream}
          onStop={() => {
            setScreenStream(null);
            setIsScreenSharing(false);
          }}
          onAttach={handleAttachmentFromTool}
        />
      )}
    </div >
  );
}
