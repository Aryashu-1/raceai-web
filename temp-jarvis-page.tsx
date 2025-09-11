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
  Search,
  Filter,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Logo2D from "@/components/logo-2d";
import NavigationSidebar from "@/components/navigation-sidebar";
import { LLM_PROVIDERS, getModelById } from "@/lib/llm-providers";

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
}

export default function JarvisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Welcome to Quantum Chat! How can I assist with your research today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [activeTab, setActiveTab] = useState<"recent" | "pinned" | "project">(
    "recent"
  );
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatSessions: ChatSession[] = [
    {
      id: "1",
      title: "Quantum Research 1",
      preview: "Latest findings on quantum entanglement",
      timestamp: "Today, 2:45 PM",
      createdAt: new Date(), //today
      category: "recent",
    },
    {
      id: "2",
      title: "Quantum Research 2",
      preview: "Latest findings on quantum entanglement",
      timestamp: "Today, 2:45 PM",
      createdAt: new Date(), //today
      category: "recent",
    },
    {
      id: "3",
      title: "Quantum Research 3",
      preview: "Latest findings on quantum entanglement",
      timestamp: "Today, 2:45 PM",
      createdAt: new Date(), //today
      category: "recent",
    },
    {
      id: "4",
      title: "Important Research",
      preview: "Critical findings for the project",
      timestamp: "Yesterday, 4:20 PM",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: "pinned",
      isPinned: true,
    },
    {
      id: "5",
      title: "Project Alpha Discussion",
      preview: "Team collaboration on AI models",
      timestamp: "2 days ago",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: "project",
      projectName: "Project Alpha",
    },
  ];

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
          includeResources: true, // Enable resource fetching
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
        resources: data.message.resources, // Include resources from API
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

  const filteredSessions = chatSessions.filter(
    (session) => session.category === activeTab
  );

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
      // You can process the file here - upload to server, extract text, etc.
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

        // Here you would implement actual voice recording logic
        // For now, just simulate recording for 3 seconds
        setTimeout(() => {
          setIsRecording(false);
          stream.getTracks().forEach((track) => track.stop());
          // Process the recorded audio here
          console.log("Voice recording completed");
        }, 3000);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="h-screen flex bg-background">
      <NavigationSidebar />

      {/* Chat Sidebar */}
      <div className="w-80 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Logo2D size="sm" />
              <span className="font-semibold text-foreground">Chats</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus size={16} />
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Filter size={14} />
            </Button>
          </div>

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
                className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
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
                        className="p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-all border border-border hover:border-primary/50"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate flex-1">
                            {session.title}
                          </h4>
                          {session.isPinned && (
                            <Pin
                              size={12}
                              className="text-primary ml-2 flex-shrink-0"
                            />
                          )}
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
                        className="p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-all border border-border hover:border-primary/50"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate flex-1">
                            {session.title}
                          </h4>
                          {session.isPinned && (
                            <Pin
                              size={12}
                              className="text-primary ml-2 flex-shrink-0"
                            />
                          )}
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
                        className="p-3 rounded-lg bg-card hover:bg-accent cursor-pointer transition-all border border-border hover:border-primary/50"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-foreground text-sm truncate flex-1">
                            {session.title}
                          </h4>
                          {session.isPinned && (
                            <Pin
                              size={12}
                              className="text-primary ml-2 flex-shrink-0"
                            />
                          )}
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
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Quick Actions</span>
          </div>
          <div className="text-xs text-muted-foreground">Jul 22, 2025</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card/50 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">
                    JARVIS Research Assistant
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedModelInfo
                      ? `${selectedModelInfo.provider.name} • ${selectedModelInfo.model.name}`
                      : "Powered by AI"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <SelectValue>
                      {selectedModelInfo?.model.name || "GPT-4o"}
                    </SelectValue>
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
                          className="text-xs py-3"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{model.name}</span>
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
                className="text-muted-foreground"
              >
                <Settings size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                <Download size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                <Share size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                <RefreshCw size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6 px-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] p-5 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
                      : "bg-card text-card-foreground border border-border shadow-sm"
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
                          className="bg-muted/50 p-4 rounded-xl border border-border/50"
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
                <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
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
        <div className="p-6 border-t border-border bg-card/50 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4">
            {selectedFile && (
              <div className="mb-4 p-3 bg-muted/50 rounded-xl border border-border/50 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Paperclip size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground font-medium">
                    {selectedFile.name}
                  </span>
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
            )}

            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask JARVIS anything about your research..."
                  className="pr-24 py-4 bg-input border-border text-foreground placeholder-muted-foreground rounded-2xl text-base"
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
                    className="text-muted-foreground hover:text-foreground p-2 h-8 w-8"
                    disabled={isLoading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip size={16} />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className={`text-muted-foreground hover:text-foreground p-2 h-8 w-8 ${
                      isRecording ? "text-destructive animate-pulse" : ""
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-2xl min-w-[48px]"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
