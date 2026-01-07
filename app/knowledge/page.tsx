"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import GeometricBackground from "@/components/geometric-background";
import {
  Search,
  Mic,
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
  Sparkles,
  Zap,
  Atom,
  Beaker,
  Brain,
} from "lucide-react";
import NavigationSidebar from "@/components/navigation-sidebar";

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date?: string;
  author?: string;
  citations?: number;
  funding?: string;
  url?: string;
}

export default function KnowledgeDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("state-of-art");

  const fieldCategories = [
    {
      id: "artificial-intelligence",
      label: "Artificial Intelligence",
      icon: Brain,
    },
    { id: "machine-learning", label: "Machine Learning", icon: TrendingUp },
    { id: "quantum-computing", label: "Quantum Computing", icon: Atom },
    { id: "biotechnology", label: "Biotechnology", icon: Beaker },
    { id: "materials-science", label: "Materials Science", icon: Zap },
    { id: "energy", label: "Energy", icon: Star },
    { id: "healthcare", label: "Healthcare", icon: Users },
  ];

  const sidebarCategories = [
    {
      id: "state-of-art",
      label: "State of the Art",
      icon: Sparkles,
      color: "bg-blue-500/20",
      dotColor: "bg-blue-500",
    },
    {
      id: "topics-to-research",
      label: "Topics to Research",
      icon: BookOpen,
      color: "bg-emerald-500/20",
      dotColor: "bg-emerald-500",
    },
    {
      id: "recent-groundbreaks",
      label: "Recent Breakthroughs",
      icon: TrendingUp,
      color: "bg-[#4C9AFF]/20",
      dotColor: "bg-[#4C9AFF]",
    },
    {
      id: "top-researchers",
      label: "Top Researchers",
      icon: Users,
      color: "bg-orange-500/20",
      dotColor: "bg-orange-500",
    },
    {
      id: "roadmap",
      label: "Research Roadmap",
      icon: Map,
      color: "bg-indigo-500/20",
      dotColor: "bg-indigo-500",
    },
    {
      id: "news",
      label: "Latest News",
      icon: Newspaper,
      color: "bg-red-500/20",
      dotColor: "bg-red-500",
    },
    {
      id: "funding",
      label: "Funding Opportunities",
      icon: DollarSign,
      color: "bg-yellow-500/20",
      dotColor: "bg-yellow-500",
    },
  ];

  const researchData: Record<string, ResearchItem[]> = {
    "state-of-art": [
      {
        id: "sota-1",
        title: "Quantum-Neural Hybrid Computing Breakthrough",
        description:
          "Revolutionary integration of quantum and neural computing achieving unprecedented computational efficiency",
        category: "Quantum AI",
        date: "2024-12-25",
        author: "Dr. Elena Vasquez",
        citations: 892,
      },
      {
        id: "sota-2",
        title: "Room-Temperature Nuclear Fusion Achievement",
        description:
          "First successful controlled nuclear fusion reaction at ambient temperature using novel catalysts",
        category: "Energy Physics",
        date: "2024-12-23",
        author: "Prof. Hiroshi Tanaka",
        citations: 1247,
      },
      {
        id: "sota-3",
        title: "AGI Consciousness Emergence",
        description:
          "Documentation of the first artificial general intelligence displaying measurable consciousness patterns",
        category: "Cognitive AI",
        date: "2024-12-22",
        author: "Dr. Amelia Richardson",
        citations: 1689,
      },
      {
        id: "sota-4",
        title: "Biological Age Reversal Protocol",
        description:
          "Comprehensive protocol demonstrating cellular age reversal in human trials",
        category: "Longevity Science",
        date: "2024-12-20",
        author: "Dr. Marcus Chen",
        citations: 1456,
      },
      {
        id: "sota-5",
        title: "Universal Cancer Cure Discovery",
        description:
          "Breakthrough treatment showing 100% success rate across all cancer types in phase III trials",
        category: "Medical Breakthrough",
        date: "2024-12-18",
        author: "Dr. Sarah Martinez",
        citations: 2103,
      },
    ],
    "artificial-intelligence": [
      {
        id: "1",
        title: "AGI Milestone Achievement",
        description:
          "First AI system to pass comprehensive general intelligence tests",
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
        description:
          "Breakthrough in reducing computational costs for LLM training",
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
        description:
          "Automated machine learning optimization for mobile and IoT devices",
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
        description:
          "Revolutionary approach to quantum error correction using topological qubits",
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
        description:
          "Enhanced precision in gene editing with minimal off-target effects",
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
        description:
          "Discovery of materials exhibiting superconductivity at ambient conditions",
        category: "Superconductors",
        date: "2024-12-20",
        author: "Dr. Alex Kumar",
        citations: 445,
      },
      {
        id: "11",
        title: "Self-Healing Materials",
        description:
          "Advanced polymers that can repair themselves autonomously",
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
        description:
          "Scientists achieve net energy gain in nuclear fusion reaction",
        category: "Nuclear Fusion",
        date: "2024-12-22",
        author: "Dr. Robert Kim",
        citations: 523,
      },
      {
        id: "13",
        title: "Perovskite Solar Cell Efficiency",
        description:
          "Record-breaking efficiency in next-generation solar cells",
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
        description:
          "Clinical trials demonstrate significant cognitive improvement",
        category: "Neurology",
        date: "2024-12-21",
        author: "Dr. Michael Brown",
        citations: 356,
      },
      {
        id: "15",
        title: "Cancer Immunotherapy Advances",
        description:
          "Novel approaches to enhancing immune system response to cancer",
        category: "Oncology",
        date: "2024-12-16",
        author: "Dr. Rachel Green",
        citations: 412,
      },
    ],
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Filter research data across all categories based on search query
    const allResearchItems = Object.values(researchData).flat();
    const filteredItems = allResearchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log("Search results:", filteredItems);
    // For now, just log the results. In a real app, you'd update state to show filtered results
  };

  const selectedCategoryData = researchData[selectedCategory] || [];

  return (
    <div className="h-screen overflow-y-hidden flex relative">
      <div className="dark:block hidden">
        <GeometricBackground variant="torus" />
      </div>
      <NavigationSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-6 bg-background border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
                Knowledge Discovery
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore cutting-edge research and breakthrough discoveries
              </p>
            </div>
          </div>

          {/* Search Bar */}
          {/* <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search research papers, topics, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-12 pr-14 py-4 text-base bg-input border-border transition-fast"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                onClick={handleSearch}
                className="btn-ghost text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              >
                <Mic className="h-4 w-4 text-black" />
              </button>
            </div>
          </div> */}
          <div className="max-w-2xl w-full h-12 px-4 flex items-center gap-3 rounded-lg border border-border bg-input">

            {/* Left Search Icon */}
            <Search className="h-5 w-5 text-muted-foreground" />

            {/* Input */}
            <input
              type="text"
              placeholder="Search research papers, topics, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="
                flex-1
                bg-transparent
                outline-none
                border-none
                text-base
                placeholder:text-muted-foreground
              "
              style={{
                boxShadow: "none",
                WebkitBoxShadow: "none",
                outline: "none",
                border: "none",
              }}

            />

            {/* Right Mic Button */}
            <button
              onClick={handleSearch}
              className="h-8 w-8 flex items-center justify-center hover:text-foreground text-muted-foreground"
            >
              <Mic className="h-4 w-4 text-black" />
            </button>
          </div>

        </div>

        <div className="flex-1 flex">
          {/* Main Content Area */}
          <div className="flex-1 px-8 py-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {fieldCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-3 px-4 py-3 transition-fast focus-ring ${isSelected ? "btn-primary" : "btn-secondary"
                      }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isSelected
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }
                    />
                    <span className="font-medium text-sm">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content Display */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {fieldCategories.find((c) => c.id === selectedCategory)?.label}
              </h2>

              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-6 pr-2">
                  {selectedCategoryData.map((item) => (
                    <div key={item.id} className="group">
                      <Card className="card-default hover:border-primary transition-normal">
                        <CardHeader className="pb-4 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl font-semibold text-foreground mb-3 leading-tight group-hover:text-primary transition-fast">
                                {item.title}
                              </CardTitle>
                              {item.category && (
                                <Badge
                                  variant="secondary"
                                  className="px-3 py-1 rounded-lg font-medium"
                                >
                                  {item.category}
                                </Badge>
                              )}
                            </div>
                            {item.url && (
                              <button className="btn-ghost text-muted-foreground hover:text-primary h-8 w-8 p-0 rounded-lg">
                                <ExternalLink size={16} />
                              </button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              {item.author && (
                                <div className="flex items-center gap-2">
                                  <Users
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                  <span className="font-medium">
                                    {item.author}
                                  </span>
                                </div>
                              )}
                              {item.date && (
                                <div className="flex items-center gap-2">
                                  <Calendar
                                    size={14}
                                    className="text-muted-foreground"
                                  />
                                  <span>
                                    {new Date(item.date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            {item.citations && (
                              <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-lg text-sm font-medium">
                                <Star size={14} className="text-warning" />
                                <span>{item.citations}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right Sidebar - Category Navigation */}
          <div className="w-80 bg-card/50 backdrop-blur-sm border-l border-border/50 p-8 relative z-10">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Research Categories
            </h3>
            <div className="space-y-2">
              {sidebarCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all duration-200 group ${isSelected
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "bg-card/50 hover:bg-card hover:border-primary/20 text-foreground border border-transparent"
                      }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-primary-foreground' : category.dotColor} flex-shrink-0`}
                    ></div>
                    <Icon
                      size={18}
                      className={
                        isSelected
                          ? "text-primary-foreground"
                          : "text-primary"
                      }
                    />
                    <span className="font-medium text-sm flex-1">
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
