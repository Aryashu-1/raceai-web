"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  FolderPlus,
  FileText,
  Upload,
  Download,
  Share,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Send,
  Mic,
  Play,
  Pause,
  Volume2,
  MessageSquare,
  Sparkles,
  BookOpen,
  Loader2,
} from "lucide-react";
import NavigationSidebar from "@/components/navigation-sidebar";

interface ProjectFolder {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: ProjectFolder[];
  fileType?: string;
  size?: string;
  lastModified?: string;
  content?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ResearchCollaborationPage() {
  const [selectedFile, setSelectedFile] = useState<ProjectFolder | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["1", "2"])
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hello! I'm your research assistant. Upload a paper and I can help summarize it or create a podcast explanation.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [podcastUrl, setPodcastUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const projectStructure: ProjectFolder[] = [
    {
      id: "1",
      name: "University of Southern California",
      type: "folder",
      children: [
        {
          id: "1-1",
          name: "Labs",
          type: "folder",
          children: [
            {
              id: "1-1-1",
              name: "CompBIO Lab",
              type: "folder",
              children: [
                {
                  id: "1-1-1-1",
                  name: "Reference paper.pdf",
                  type: "file",
                  fileType: "pdf",
                  size: "2.4 MB",
                  lastModified: "2 days ago",
                  content:
                    "This is a comprehensive research paper on computational biology methods...",
                },
              ],
            },
            {
              id: "1-1-2",
              name: "Neuro Lab",
              type: "folder",
            },
            {
              id: "1-1-3",
              name: "Levenson-Falk Lab",
              type: "folder",
              children: [
                {
                  id: "1-1-3-1",
                  name: "CMOS memory",
                  type: "folder",
                  children: [
                    {
                      id: "1-1-3-1-1",
                      name: "Merge-mon qu...",
                      type: "file",
                      fileType: "pdf",
                      size: "1.8 MB",
                      lastModified: "1 week ago",
                    },
                    {
                      id: "1-1-3-1-2",
                      name: "Exciton Qubit...",
                      type: "file",
                      fileType: "pdf",
                      size: "3.2 MB",
                      lastModified: "3 days ago",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "1-2",
          name: "FQuIS",
          type: "folder",
        },
      ],
    },
  ];

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = (file: ProjectFolder) => {
    if (file.type === "file") {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/research-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          selectedFile: selectedFile,
          model: "gpt-4o",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: data.message.id,
        content: data.message.content,
        sender: "assistant",
        timestamp: new Date(data.message.timestamp),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGeneratePodcast = async () => {
    if (!selectedFile) return;

    setIsGeneratingPodcast(true);

    try {
      const response = await fetch("/api/generate-podcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedFile: selectedFile,
          model: "gpt-4o",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate podcast");
      }

      const data = await response.json();

      setPodcastUrl(data.audioUrl);

      const podcastMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `I've generated a podcast explanation of "${selectedFile.name}". You can listen to it using the audio player above. Here's the script I created:\n\n${data.script}`,
        sender: "assistant",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, podcastMessage]);
    } catch (error) {
      console.error("Error generating podcast:", error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content:
          "I encountered an error while generating the podcast. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGeneratingPodcast(false);
    }
  };

  const renderProjectTree = (items: ProjectFolder[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className={`flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer ${
            selectedFile?.id === item.id ? "bg-primary/10 text-primary" : ""
          }`}
          onClick={() => {
            if (item.type === "folder") {
              toggleFolder(item.id);
            } else {
              handleFileSelect(item);
            }
          }}
        >
          {item.type === "folder" ? (
            <>
              {expandedFolders.has(item.id) ? (
                <ChevronDown size={16} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={16} className="text-muted-foreground" />
              )}
              <Folder size={16} className="text-blue-500" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <File size={16} className="text-gray-500" />
            </>
          )}
          <span className="text-sm font-medium truncate">{item.name}</span>
        </div>
        {item.type === "folder" &&
          expandedFolders.has(item.id) &&
          item.children && (
            <div>{renderProjectTree(item.children, depth + 1)}</div>
          )}
      </div>
    ));
  };

  return (
    <div className="h-screen flex bg-background">
      <NavigationSidebar />

      <div className="flex-1 flex">
        {/* Project Structure Sidebar */}
        <div className="w-80 border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Projects</h2>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost">
                  <FolderPlus size={16} />
                </Button>
                <Button size="sm" variant="ghost">
                  <Upload size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Project Tree */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
              {renderProjectTree(projectStructure)}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Research and Collaboration
                </h1>
                <p className="text-muted-foreground">
                  Manage your research projects and collaborate with AI
                </p>
              </div>
              {selectedFile && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Document Viewer */}
          <div className="flex-1 p-6">
            {selectedFile ? (
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText size={20} />
                      <span>{selectedFile.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{selectedFile.size}</span>
                      <span>{selectedFile.lastModified}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="outline">Research Paper</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-6 rounded-lg h-96 overflow-y-auto">
                    <p className="text-foreground leading-relaxed">
                      {selectedFile.content ||
                        `This is the content of ${selectedFile.name}. The document contains detailed research findings, methodologies, and conclusions. You can use the AI assistant on the right to get summaries, explanations, or generate podcast versions of this content.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <FileText
                    size={48}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Document Selected
                  </h3>
                  <p className="text-muted-foreground">
                    Select a research paper from the project structure to view
                    it here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="w-96 border-l border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Race Chat</h3>
                  <p className="text-xs text-muted-foreground">
                    AI Research Assistant
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGeneratePodcast}
                disabled={!selectedFile || isGeneratingPodcast}
              >
                {isGeneratingPodcast ? (
                  <>
                    <Loader2 size={14} className="mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Podcast"
                )}
              </Button>
            </div>

            {/* Podcast Player */}
            {podcastUrl && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Podcast Explanation
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 h-1 bg-muted rounded-full">
                    <div className="h-1 bg-primary rounded-full w-1/3"></div>
                  </div>
                  <Volume2 size={14} className="text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
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

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">NEW TOPIC</p>
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Let's research together...What's on your mind?"
                    className="pr-10"
                    disabled={isChatLoading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    disabled={isChatLoading}
                  >
                    <Mic size={14} />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="gradient-race-primary text-white"
                  disabled={isChatLoading || !chatInput.trim()}
                >
                  {isChatLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  disabled={isChatLoading}
                >
                  <BookOpen size={14} className="mr-1" />
                  Summarize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  disabled={isChatLoading}
                >
                  <MessageSquare size={14} className="mr-1" />
                  Explain
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
