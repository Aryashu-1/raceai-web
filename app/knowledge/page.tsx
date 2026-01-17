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
  X,
  Share2,
  Bookmark,
  Quote
} from "lucide-react";
import NavigationSidebar from "@/components/navigation-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";


import PDFViewer from "@/components/pdfviewer";
import { useUser } from "../context/UserContext";

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
  const [selectedItem, setSelectedItem] = useState<ResearchItem | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const { user, updateUser } = useUser();

  const handleSavePaper = (item: ResearchItem) => {
    // Simple verification check/toast logic could go here
    // For now we assume we just added it to the context
    // In a real app we'd call an API
    console.log("Saving paper:", item.title);
    
    // Simulate updating user context with Saved Papers
    // Note: The User type might need to be extended to hold this, 
    // but for now we'll just log or use local storage as persistence shim if needed
    // or assume the user context has a general 'metadata' field. 
    // Let's create a local storage entry for 'saved_papers' to share with dashboard
    
    const saved = JSON.parse(localStorage.getItem("saved_papers") || "[]");
    if (!saved.find((p: any) => p.id === item.id)) {
        saved.push(item);
        localStorage.setItem("saved_papers", JSON.stringify(saved));
        alert("Paper saved to library!"); 
    } else {
        alert("Paper already in library.");
    }
  };


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
    // Search is reactive now, but we can keep this for explicit actions if needed
    console.log("Searching for:", searchQuery);
  };

  // Filter logic
  const allResearchItems = Object.values(researchData).flat();
  const filteredData = searchQuery.trim() 
    ? allResearchItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (researchData[selectedCategory] || []);

  const displayTitle = searchQuery.trim() 
    ? `Search Results for "${searchQuery}"`
    : fieldCategories.find((c) => c.id === selectedCategory)?.label || "Research";


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
                {displayTitle}
              </h2>

              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-6 pr-2">
                  {filteredData.map((item) => (
                    <div key={item.id} className="group" onClick={() => setSelectedItem(item)}>
                      <Card className="card-default hover:border-primary transition-normal cursor-pointer hover:shadow-md">
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
                          <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">
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
                                <span className="text-warning font-mono">{item.citations}</span>
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
      {/* Detailed View Sheet */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent side="right" className="w-[600px] sm:w-[800px] sm:max-w-[90vw] overflow-y-auto bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-[100]">
           {selectedItem && (
             <div className="space-y-8 py-6">
                <SheetHeader className="space-y-4">
                   <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-primary border-primary/20">
                         {selectedItem.category}
                      </Badge>
                      {selectedItem.date && (
                        <span className="text-sm text-muted-foreground font-mono">
                           {new Date(selectedItem.date).toLocaleDateString()}
                        </span>
                      )}
                   </div>
                   <SheetTitle className="text-3xl font-bold leading-tight">
                      {selectedItem.title}
                   </SheetTitle>
                   <div className="flex items-center gap-6 text-sm text-muted-foreground border-b pb-6 border-white/5">
                      {selectedItem.author && (
                        <div className="flex items-center gap-2">
                           <Users size={16} />
                           <span className="text-foreground">{selectedItem.author}</span>
                        </div>
                      )}
                      {selectedItem.citations && (
                          <div className="flex items-center gap-2 text-warning">
                             <Star size={16} />
                             <span>{selectedItem.citations} citations</span>
                          </div>
                      )}
                   </div>
                </SheetHeader>

                <div className="space-y-6">
                   <div className="p-6 rounded-2xl bg-muted/30 border border-white/5">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                         <Sparkles size={18} className="text-primary" />
                         Abstract
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                         {selectedItem.description}
                         <span className="text-muted-foreground/50 ml-1">
                            (Full abstract content would be populated here in a production environment, pulling from the actual paper source or API.)
                         </span>
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-white/5 bg-background">
                         <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Concepts</h4>
                         <div className="flex flex-wrap gap-2">
                            {["Neural Networks", "Optimization", "Algorithms", "Data Efficiency"].map(tag => (
                               <Badge key={tag} variant="secondary" className="bg-secondary/50">
                                  {tag}
                               </Badge>
                            ))}
                         </div>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-background">
                         <h4 className="font-medium text-sm text-muted-foreground mb-2">Funding Source</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <DollarSign size={16} className="text-green-500" />
                              <span>National Science Foundation</span>
                           </div>
                      </div>
                   </div>

                   <div className="flex gap-3 pt-4">
                      <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={() => setShowPDFViewer(true)}>
                         <BookOpen size={16} className="mr-2" /> 
                         Read Full Paper
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleSavePaper(selectedItem)}>
                         <Bookmark size={16} className="mr-2" />
                         Save to Library
                      </Button>
                      <Button variant="ghost" size="icon">
                         <Share2 size={18} />
                      </Button>
                      <Button variant="ghost" size="icon">
                         <Quote size={18} />
                      </Button>
                   </div>
                </div>
             </div>
           )}
        </SheetContent>
      </Sheet>

      {/* PDF Viewer Overlay */}
      {showPDFViewer && selectedItem && (
        <div className="fixed inset-0 z-[200] bg-background">
            <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">{selectedItem.title}</h3>
                <Button variant="ghost" onClick={() => setShowPDFViewer(false)}>Close</Button>
            </div>
            <div className="h-[calc(100vh-64px)]">
               <PDFViewer fileUrl={selectedItem.url || "https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf"} />
            </div>
        </div>
      )}
    </div>
  );
}
