"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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
  Users,
  Clock,
  StickyNote,
  ArrowLeft,
  Plus,
  UserCircle,
  Circle,
} from "lucide-react"
import NavigationSidebar from "@/components/navigation-sidebar"
import GeometricBackground from "@/components/geometric-background"

interface ProjectFolder {
  id: string
  name: string
  type: "folder" | "file"
  children?: ProjectFolder[]
  fileType?: string
  size?: string
  lastModified?: string
  content?: string
  description?: string
  collaborators?: Collaborator[]
  associatedChats?: ChatSession[]
  notes?: Note[]
}

interface Collaborator {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  status: "online" | "offline" | "away"
}

interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: string
}

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  participants: string[]
  messageCount: number
}

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export default function ResearchCollaborationPage() {
  const [selectedFile, setSelectedFile] = useState<ProjectFolder | null>(null)
  const [selectedFolder, setSelectedFolder] = useState<ProjectFolder | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "folder" | "file">("overview")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1", "2"]))
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hello! I'm your research assistant. Select a folder or upload a paper and I can help organize your research and create summaries.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false)
  const [podcastUrl, setPodcastUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const projectStructure: ProjectFolder[] = [
    {
      id: "1",
      name: "University of Southern California",
      type: "folder",
      description: "Main university research projects and collaborations",
      collaborators: [
        { id: "1", name: "Dr. Sarah Chen", email: "schen@usc.edu", role: "Principal Investigator", status: "online" },
        { id: "2", name: "Alex Rodriguez", email: "arodriguez@usc.edu", role: "Graduate Student", status: "away" },
      ],
      associatedChats: [
        { id: "chat-1", title: "Project Planning Discussion", lastMessage: "Let's review the research timeline", timestamp: new Date(Date.now() - 3600000), participants: ["Dr. Sarah Chen", "Alex Rodriguez"], messageCount: 15 },
      ],
      children: [
        {
          id: "1-1",
          name: "Labs",
          type: "folder",
          description: "Research laboratory projects and collaborations",
          children: [
            {
              id: "1-1-1",
              name: "CompBIO Lab",
              type: "folder",
              description: "Computational Biology research projects",
              collaborators: [
                { id: "3", name: "Dr. Michael Kim", email: "mkim@usc.edu", role: "Lab Director", status: "online" },
                { id: "4", name: "Emily Watson", email: "ewatson@usc.edu", role: "Postdoc", status: "offline" },
              ],
              associatedChats: [
                { id: "chat-2", title: "Weekly Lab Meeting", lastMessage: "Next meeting Tuesday at 2 PM", timestamp: new Date(Date.now() - 7200000), participants: ["Dr. Michael Kim", "Emily Watson"], messageCount: 8 },
                { id: "chat-3", title: "Research Progress", lastMessage: "Submitted the latest findings", timestamp: new Date(Date.now() - 86400000), participants: ["Emily Watson"], messageCount: 23 },
              ],
              notes: [
                { id: "note-1", title: "Experiment Protocol", content: "Updated protocol for RNA sequencing analysis", createdAt: new Date(Date.now() - 172800000), updatedAt: new Date(Date.now() - 86400000), author: "Emily Watson" },
                { id: "note-2", title: "Literature Review", content: "Key papers on computational methods", createdAt: new Date(Date.now() - 259200000), updatedAt: new Date(Date.now() - 172800000), author: "Dr. Michael Kim" },
              ],
              children: [
                {
                  id: "1-1-1-1",
                  name: "Reference paper.pdf",
                  type: "file",
                  fileType: "pdf",
                  size: "2.4 MB",
                  lastModified: "2 days ago",
                  content: "This is a comprehensive research paper on computational biology methods and their applications in modern genomics research...",
                },
              ],
            },
            {
              id: "1-1-2",
              name: "Neuro Lab",
              type: "folder",
              description: "Neuroscience research and brain imaging studies",
              collaborators: [
                { id: "5", name: "Dr. Lisa Chang", email: "lchang@usc.edu", role: "Lab Director", status: "away" },
              ],
              associatedChats: [
                { id: "chat-4", title: "Brain Imaging Project", lastMessage: "MRI data analysis complete", timestamp: new Date(Date.now() - 14400000), participants: ["Dr. Lisa Chang"], messageCount: 12 },
              ],
            },
            {
              id: "1-1-3",
              name: "Levenson-Falk Lab",
              type: "folder",
              description: "Quantum computing and memory systems research",
              collaborators: [
                { id: "6", name: "Dr. Daniel Levenson-Falk", email: "dlevenson@usc.edu", role: "Principal Investigator", status: "online" },
                { id: "7", name: "Jamie Park", email: "jpark@usc.edu", role: "PhD Student", status: "online" },
              ],
              associatedChats: [
                { id: "chat-5", title: "Quantum Memory Research", lastMessage: "New results on CMOS integration", timestamp: new Date(Date.now() - 1800000), participants: ["Dr. Daniel Levenson-Falk", "Jamie Park"], messageCount: 31 },
              ],
              children: [
                {
                  id: "1-1-3-1",
                  name: "CMOS memory",
                  type: "folder",
                  description: "CMOS-based quantum memory systems",
                  collaborators: [
                    { id: "8", name: "Taylor Kim", email: "tkim@usc.edu", role: "Research Assistant", status: "offline" },
                  ],
                  associatedChats: [
                    { id: "chat-6", title: "CMOS Design Review", lastMessage: "Layout optimization completed", timestamp: new Date(Date.now() - 3600000), participants: ["Jamie Park", "Taylor Kim"], messageCount: 19 },
                  ],
                  notes: [
                    { id: "note-3", title: "Design Specifications", content: "CMOS memory cell design parameters and constraints", createdAt: new Date(Date.now() - 432000000), updatedAt: new Date(Date.now() - 86400000), author: "Jamie Park" },
                  ],
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
          description: "Future Quantum Information Science program",
          collaborators: [
            { id: "9", name: "Dr. Maria Gonzalez", email: "mgonzalez@usc.edu", role: "Program Director", status: "online" },
          ],
          associatedChats: [
            { id: "chat-7", title: "FQuIS Program Updates", lastMessage: "Grant proposal submitted", timestamp: new Date(Date.now() - 21600000), participants: ["Dr. Maria Gonzalez"], messageCount: 7 },
          ],
        },
      ],
    },
  ]

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleFileSelect = (file: ProjectFolder) => {
    if (file.type === "file") {
      setSelectedFile(file)
      setSelectedFolder(null)
      setViewMode("file")
    }
  }

  const handleFolderSelect = (folder: ProjectFolder) => {
    if (folder.type === "folder") {
      setSelectedFolder(folder)
      setSelectedFile(null)
      setViewMode("folder")
      // Update chat messages for folder context
      setChatMessages([
        {
          id: "folder-welcome",
          content: `Welcome to ${folder.name}! I can help you organize research, manage collaborators, and analyze documents in this project folder.`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleBackToOverview = () => {
    setSelectedFolder(null)
    setSelectedFile(null)
    setViewMode("overview")
    setChatMessages([
      {
        id: "overview-welcome",
        content: "Hello! I'm your research assistant. Select a folder or upload a paper and I can help organize your research and create summaries.",
        sender: "assistant",
        timestamp: new Date(),
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      sender: "user",
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

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
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: data.message.id,
        content: data.message.content,
        sender: "assistant",
        timestamp: new Date(data.message.timestamp),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleGeneratePodcast = async () => {
    if (!selectedFile) return

    setIsGeneratingPodcast(true)

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
      })

      if (!response.ok) {
        throw new Error("Failed to generate podcast")
      }

      const data = await response.json()

      setPodcastUrl(data.audioUrl)

      const podcastMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `I've generated a podcast explanation of "${selectedFile.name}". You can listen to it using the audio player above. Here's the script I created:\n\n${data.script}`,
        sender: "assistant",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, podcastMessage])
    } catch (error) {
      console.error("Error generating podcast:", error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: "I encountered an error while generating the podcast. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsGeneratingPodcast(false)
    }
  }

  const renderProjectTree = (items: ProjectFolder[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} style={{ marginLeft: `${depth * 16}px` }}>
        <div
          className={`flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer ${
            selectedFile?.id === item.id ? "bg-primary/10 text-primary" : ""
          }`}
          onClick={() => {
            if (item.type === "folder") {
              // Double-click or special click to enter folder, single click to expand
              toggleFolder(item.id)
            } else {
              handleFileSelect(item)
            }
          }}
          onDoubleClick={() => {
            if (item.type === "folder") {
              handleFolderSelect(item)
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
        {item.type === "folder" && expandedFolders.has(item.id) && item.children && (
          <div>{renderProjectTree(item.children, depth + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-100 via-blue-50 to-violet-50/20 dark:from-slate-950 dark:via-blue-950/40 dark:to-slate-900 relative">
      <GeometricBackground variant="mobius" />
      <NavigationSidebar />

      <div className="flex-1 flex">
        {/* Project Structure Sidebar */}
        <div className="w-80 border-r border-border/50 glass-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border/50">
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
            <div className="space-y-1">{renderProjectTree(projectStructure)}</div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {viewMode !== "overview" && (
                  <Button variant="ghost" size="sm" onClick={handleBackToOverview}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {viewMode === "folder" && selectedFolder ? selectedFolder.name :
                     viewMode === "file" && selectedFile ? selectedFile.name :
                     "Research and Collaboration"}
                  </h1>
                  <p className="text-muted-foreground">
                    {viewMode === "folder" && selectedFolder ? selectedFolder.description :
                     viewMode === "file" ? "Document viewer and analysis" :
                     "Manage your research projects and collaborate with AI"}
                  </p>
                </div>
              </div>
              {(selectedFile || selectedFolder) && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="atlassian-card border-border/50 hover:border-primary/50 transition-all duration-200">
                    <Download size={16} className="mr-2" />
                    {selectedFile ? "Download" : "Export"}
                  </Button>
                  <Button variant="outline" size="sm" className="atlassian-card border-border/50 hover:border-primary/50 transition-all duration-200">
                    <Share size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Content based on view mode */}
          <div className="flex-1 p-6">
            {viewMode === "folder" && selectedFolder ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Collaborators */}
                <div className="atlassian-card h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <Users size={18} className="mr-2" />
                      Collaborators ({selectedFolder.collaborators?.length || 0})
                    </h3>
                    <Button size="sm" variant="ghost">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedFolder.collaborators?.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <UserCircle size={32} className="text-muted-foreground" />
                            <Circle
                              size={8}
                              className={`absolute -bottom-1 -right-1 ${
                                collaborator.status === "online" ? "text-green-500 fill-green-500" :
                                collaborator.status === "away" ? "text-yellow-500 fill-yellow-500" :
                                "text-gray-400 fill-gray-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{collaborator.name}</p>
                            <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                          </div>
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No collaborators added yet</p>}
                  </div>
                </div>

                {/* Recent Chats */}
                <div className="atlassian-card h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <MessageSquare size={18} className="mr-2" />
                      Recent Chats ({selectedFolder.associatedChats?.length || 0})
                    </h3>
                    <Button size="sm" variant="ghost">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedFolder.associatedChats?.map((chat) => (
                      <div key={chat.id} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{chat.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{chat.lastMessage}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Clock size={12} className="text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {chat.timestamp.toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {chat.messageCount} messages
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No chats available</p>}
                  </div>
                </div>

                {/* Notes */}
                <div className="atlassian-card h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <StickyNote size={18} className="mr-2" />
                      Notes ({selectedFolder.notes?.length || 0})
                    </h3>
                    <Button size="sm" variant="ghost">
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedFolder.notes?.map((note) => (
                      <div key={note.id} className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                        <p className="font-medium text-foreground text-sm">{note.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          By {note.author} • Updated {note.updatedAt.toLocaleDateString()}
                        </p>
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No notes available</p>}
                  </div>
                </div>

                {/* Files and Resources */}
                <div className="atlassian-card h-fit">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center">
                      <FileText size={18} className="mr-2" />
                      Files ({selectedFolder.children?.filter(c => c.type === "file").length || 0})
                    </h3>
                    <Button size="sm" variant="ghost">
                      <Upload size={16} />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {selectedFolder.children?.filter(c => c.type === "file").map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleFileSelect(file)}
                      >
                        <div className="flex items-center space-x-3">
                          <File size={16} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size} • {file.lastModified}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {file.fileType?.toUpperCase()}
                        </Badge>
                      </div>
                    )) || <p className="text-muted-foreground text-sm">No files in this folder</p>}
                  </div>
                </div>
              </div>
            ) : viewMode === "file" && selectedFile ? (
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl blur opacity-75 transition duration-300" />
                <Card className="relative atlassian-card h-full border-border/50">
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
                    <Badge variant="secondary">{selectedFile.fileType?.toUpperCase()}</Badge>
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
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Folder size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Research Hub</h3>
                  <p className="text-muted-foreground mb-4">
                    Double-click on a folder to explore its contents, collaborators, and associated chats
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Single-click files to view them, or use the AI assistant for help
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="w-96 border-l border-border/50 glass-card flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Race Chat</h3>
                  <p className="text-xs text-muted-foreground">AI Research Assistant</p>
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
                  <span className="text-sm font-medium">Podcast Explanation</span>
                  <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
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
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg"
                        : "glass-card border border-border/50 text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
                    className="pr-10 glass-card border-border/50 focus:border-primary/50 transition-all duration-200"
                    disabled={isChatLoading}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
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
                  className="btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isChatLoading || !chatInput.trim()}
                >
                  {isChatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={isChatLoading}>
                  <BookOpen size={14} className="mr-1" />
                  Summarize
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" disabled={isChatLoading}>
                  <MessageSquare size={14} className="mr-1" />
                  Explain
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
