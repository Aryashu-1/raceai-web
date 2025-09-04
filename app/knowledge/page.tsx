"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Mic,
  Edit3,
  TrendingUp,
  Users,
  Map,
  Newspaper,
  DollarSign,
  BookOpen,
  ChevronRight,
  Star,
  Calendar,
  ExternalLink,
} from "lucide-react"
import NavigationSidebar from "@/components/navigation-sidebar"

interface ResearchItem {
  id: string
  title: string
  description: string
  category: string
  date?: string
  author?: string
  citations?: number
  funding?: string
  url?: string
}

export default function KnowledgeDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("artificial-intelligence")

  const fieldCategories = [
    { id: "artificial-intelligence", label: "Artificial Intelligence", icon: Star, color: "bg-blue-500" },
    { id: "machine-learning", label: "Machine Learning", icon: TrendingUp, color: "bg-green-500" },
    { id: "quantum-computing", label: "Quantum Computing", icon: BookOpen, color: "bg-purple-500" },
    { id: "biotechnology", label: "Biotechnology", icon: Users, color: "bg-orange-500" },
    { id: "materials-science", label: "Materials Science", icon: Map, color: "bg-indigo-500" },
    { id: "energy", label: "Energy", icon: Newspaper, color: "bg-red-500" },
    { id: "healthcare", label: "Healthcare", icon: DollarSign, color: "bg-yellow-500" },
  ]

  const sidebarCategories = [
    { id: "state-of-art", label: "State of the art research", icon: Star, color: "bg-blue-500" },
    { id: "topics-to-research", label: "Topics to research", icon: BookOpen, color: "bg-green-500" },
    { id: "recent-groundbreaks", label: "Recent groundbreaks", icon: TrendingUp, color: "bg-purple-500" },
    { id: "top-researchers", label: "Top Researchers", icon: Users, color: "bg-orange-500" },
    { id: "roadmap", label: "Roadmap", icon: Map, color: "bg-indigo-500" },
    { id: "news", label: "News", icon: Newspaper, color: "bg-red-500" },
    { id: "funding", label: "Funding", icon: DollarSign, color: "bg-yellow-500" },
  ]

  const researchData: Record<string, ResearchItem[]> = {
    "artificial-intelligence": [
      {
        id: "1",
        title: "AGI Milestone Achievement",
        description: "First AI system to pass comprehensive general intelligence tests",
        category: "Artificial Intelligence",
        date: "2024-12-18",
        author: "Dr. Yann LeCun",
        citations: 312,
      },
      {
        id: "2",
        title: "Neural Architecture Search Optimization",
        description: "Advanced techniques for automated neural network design",
        category: "Machine Learning",
        date: "2024-12-10",
        author: "Prof. Michael Rodriguez",
        citations: 189,
      },
      {
        id: "3",
        title: "Large Language Model Efficiency",
        description: "Breakthrough in reducing computational costs for LLM training",
        category: "Natural Language Processing",
        date: "2024-12-15",
        author: "Dr. Sarah Chen",
        citations: 245,
      },
    ],
    "machine-learning": [
      {
        id: "4",
        title: "Federated Learning Privacy",
        description: "Enhanced privacy-preserving techniques in distributed ML",
        category: "Privacy Technology",
        date: "2024-12-12",
        author: "Prof. Lisa Wang",
        citations: 156,
      },
      {
        id: "5",
        title: "AutoML for Edge Devices",
        description: "Automated machine learning optimization for mobile and IoT devices",
        category: "Edge Computing",
        date: "2024-12-08",
        author: "Dr. James Park",
        citations: 203,
      },
    ],
    "quantum-computing": [
      {
        id: "6",
        title: "Quantum Error Correction Breakthrough",
        description: "Revolutionary approach to quantum error correction using topological qubits",
        category: "Quantum Computing",
        date: "2024-12-15",
        author: "Dr. Sarah Chen",
        citations: 245,
      },
      {
        id: "7",
        title: "Quantum Internet Protocols",
        description: "Development of secure quantum communication networks",
        category: "Quantum Networking",
        date: "2024-12-10",
        author: "Prof. Michael Zhang",
        citations: 178,
      },
    ],
    biotechnology: [
      {
        id: "8",
        title: "CRISPR Gene Editing Precision",
        description: "Enhanced precision in gene editing with minimal off-target effects",
        category: "Gene Editing",
        date: "2024-12-08",
        author: "Dr. Emily Watson",
        citations: 312,
      },
      {
        id: "9",
        title: "Personalized Medicine AI",
        description: "AI-driven approaches to individualized treatment plans",
        category: "Healthcare AI",
        date: "2024-12-05",
        author: "Dr. Jennifer Doudna",
        citations: 267,
      },
    ],
    "materials-science": [
      {
        id: "10",
        title: "Room Temperature Superconductor",
        description: "Discovery of materials exhibiting superconductivity at ambient conditions",
        category: "Superconductors",
        date: "2024-12-20",
        author: "Dr. Alex Kumar",
        citations: 445,
      },
      {
        id: "11",
        title: "Self-Healing Materials",
        description: "Advanced polymers that can repair themselves autonomously",
        category: "Smart Materials",
        date: "2024-12-14",
        author: "Prof. Maria Santos",
        citations: 189,
      },
    ],
    energy: [
      {
        id: "12",
        title: "Fusion Energy Breakthrough",
        description: "Scientists achieve net energy gain in nuclear fusion reaction",
        category: "Nuclear Fusion",
        date: "2024-12-22",
        author: "Dr. Robert Kim",
        citations: 523,
      },
      {
        id: "13",
        title: "Perovskite Solar Cell Efficiency",
        description: "Record-breaking efficiency in next-generation solar cells",
        category: "Solar Energy",
        date: "2024-12-18",
        author: "Prof. Anna Lee",
        citations: 298,
      },
    ],
    healthcare: [
      {
        id: "14",
        title: "Alzheimer's Treatment Breakthrough",
        description: "Clinical trials demonstrate significant cognitive improvement",
        category: "Neurology",
        date: "2024-12-21",
        author: "Dr. Michael Brown",
        citations: 356,
      },
      {
        id: "15",
        title: "Cancer Immunotherapy Advances",
        description: "Novel approaches to enhancing immune system response to cancer",
        category: "Oncology",
        date: "2024-12-16",
        author: "Dr. Rachel Green",
        citations: 412,
      },
    ],
  }

  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching for:", searchQuery)
  }

  const selectedCategoryData = researchData[selectedCategory] || []

  return (
    <div className="h-screen flex bg-background">
      <NavigationSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2">KNOWLEDGE DISCOVERY</h1>
          <p className="text-muted-foreground">Explore the latest research and discoveries in your field</p>
        </div>

        <div className="flex-1 flex">
          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {fieldCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon size={16} />
                    <span>{category.label}</span>
                  </Button>
                )
              })}
              <Button variant="outline" className="ml-auto bg-transparent">
                <ChevronRight size={16} />
              </Button>
            </div>

            {/* Content Display */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 capitalize">
                {fieldCategories.find((c) => c.id === selectedCategory)?.label}
              </h2>

              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {selectedCategoryData.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold text-foreground">{item.title}</CardTitle>
                          {item.url && (
                            <Button size="sm" variant="ghost">
                              <ExternalLink size={16} />
                            </Button>
                          )}
                        </div>
                        {item.category && (
                          <Badge variant="secondary" className="w-fit">
                            {item.category}
                          </Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            {item.author && (
                              <div className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>{item.author}</span>
                              </div>
                            )}
                            {item.date && (
                              <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {item.funding && (
                              <div className="flex items-center space-x-1">
                                <DollarSign size={14} />
                                <span>{item.funding}</span>
                              </div>
                            )}
                          </div>
                          {item.citations && (
                            <div className="flex items-center space-x-1">
                              <Star size={14} />
                              <span>{item.citations} citations</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Sidebar - Category Navigation */}
          <div className="w-80 border-l border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <div className="space-y-2">
              {sidebarCategories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors research-option ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                    <Icon size={16} />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-6 border-t border-border bg-card">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">NEW TOPIC</p>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Let's research together...What's on your mind?"
                  className="pr-20 py-3 text-base"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Mic size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                    <Edit3 size={16} />
                  </Button>
                </div>
              </div>
              <Button onClick={handleSearch} className="gradient-race-primary text-white px-6">
                <Search size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
