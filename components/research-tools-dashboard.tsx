"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  BarChart3,
  Search,
  BookOpen,
  Clock,
  Target,
  Users,
  Download,
  Upload,
  Zap,
  Brain,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileBarChart,
  PieChart,
  LineChart,
  Database,
  GitBranch,
  Bookmark,
  Quote,
  Globe,
  Microscope,
  FlaskConical,
  Calculator,
  FileSpreadsheet,
  Link,
  Tag,
  Filter,
  SortAsc,
  Eye,
  Share,
  Star,
  ChevronRight,
  Plus,
  Settings,
  RefreshCw,
  Edit,
  Trash2,
  Copy,
} from "lucide-react"

interface ResearchTool {
  id: string
  name: string
  description: string
  category: string
  icon: any
  status: "active" | "beta" | "coming-soon"
  features: string[]
}

interface Citation {
  id: string
  title: string
  authors: string[]
  journal: string
  year: number
  doi?: string
  url?: string
  notes?: string
}

interface AnalysisResult {
  id: string
  fileName: string
  type: "pdf" | "data" | "image"
  summary: string
  keyFindings: string[]
  confidence: number
  timestamp: Date
}

export default function ResearchToolsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const researchTools: ResearchTool[] = [
    {
      id: "pdf-analyzer",
      name: "PDF Document Analyzer",
      description: "AI-powered analysis of research papers with summarization and key findings extraction",
      category: "Document Analysis",
      icon: FileText,
      status: "active",
      features: ["Auto-summarization", "Key findings extraction", "Citation analysis", "Methodology identification"]
    },
    {
      id: "data-visualizer",
      name: "Data Visualization Suite",
      description: "Create interactive charts, graphs, and statistical visualizations from research data",
      category: "Data Analysis",
      icon: BarChart3,
      status: "active",
      features: ["Interactive charts", "Statistical analysis", "Custom dashboards", "Export capabilities"]
    },
    {
      id: "citation-manager",
      name: "Smart Citation Manager",
      description: "Organize, format, and manage citations with automatic metadata extraction",
      category: "Writing & Publishing",
      icon: BookOpen,
      status: "active",
      features: ["Auto-format citations", "Reference extraction", "Style guides", "Collaboration"]
    },
    {
      id: "literature-search",
      name: "Advanced Literature Search",
      description: "Cross-platform search across multiple academic databases and repositories",
      category: "Discovery",
      icon: Search,
      status: "active",
      features: ["Multi-database search", "Relevance ranking", "Alert system", "Full-text access"]
    },
    {
      id: "research-timeline",
      name: "Research Timeline Manager",
      description: "Plan, track, and manage research projects with milestone tracking",
      category: "Productivity",
      icon: Calendar,
      status: "active",
      features: ["Project timelines", "Milestone tracking", "Deadline alerts", "Progress visualization"]
    },
    {
      id: "collaboration-hub",
      name: "Collaboration Hub",
      description: "Real-time collaboration tools for research teams and peer review",
      category: "Collaboration",
      icon: Users,
      status: "active",
      features: ["Real-time editing", "Comment system", "Version control", "Peer review"]
    },
    {
      id: "data-extraction",
      name: "Data Extraction AI",
      description: "Automatically extract tables, figures, and data from research papers",
      category: "Data Analysis",
      icon: Database,
      status: "beta",
      features: ["Table extraction", "Figure analysis", "Data parsing", "Format conversion"]
    },
    {
      id: "hypothesis-generator",
      name: "Hypothesis Generator",
      description: "AI-assisted hypothesis generation based on literature analysis",
      category: "Discovery",
      icon: Brain,
      status: "beta",
      features: ["Literature analysis", "Gap identification", "Hypothesis suggestions", "Experimental design"]
    },
    {
      id: "methodology-advisor",
      name: "Methodology Advisor",
      description: "Get recommendations for research methodologies and experimental design",
      category: "Research Design",
      icon: FlaskConical,
      status: "coming-soon",
      features: ["Method recommendations", "Sample size calculation", "Protocol optimization", "Ethics guidance"]
    }
  ]

  const recentAnalyses: AnalysisResult[] = [
    {
      id: "1",
      fileName: "quantum_computing_survey_2024.pdf",
      type: "pdf",
      summary: "Comprehensive survey of quantum computing advances in 2024, focusing on error correction and scalability",
      keyFindings: ["50% improvement in error rates", "New topological qubit designs", "Commercial viability approaching"],
      confidence: 0.94,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "2",
      fileName: "experimental_data_batch_1.csv",
      type: "data",
      summary: "Statistical analysis of experimental results showing significant correlation between variables X and Y",
      keyFindings: ["p-value < 0.001", "Effect size = 0.7", "95% confidence interval established"],
      confidence: 0.89,
      timestamp: new Date(Date.now() - 7200000)
    }
  ]

  const citations: Citation[] = [
    {
      id: "1",
      title: "Quantum Error Correction in the NISQ Era",
      authors: ["Chen, L.", "Rodriguez, M.", "Wang, S."],
      journal: "Nature Quantum Information",
      year: 2024,
      doi: "10.1038/s41534-024-00123-4"
    },
    {
      id: "2",
      title: "Machine Learning Approaches to Drug Discovery",
      authors: ["Thompson, R.", "Lee, K.", "Patel, A."],
      journal: "Cell",
      year: 2024,
      doi: "10.1016/j.cell.2024.01.023"
    }
  ]

  const getToolsByCategory = (category: string) => {
    return researchTools.filter(tool => tool.category === category)
  }

  const categories = [...new Set(researchTools.map(tool => tool.category))]

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Research Tools Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive suite of AI-powered research tools</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Tool
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="data">Data Analysis</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="collaboration">Collaborate</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Documents Analyzed</p>
                    <p className="text-2xl font-bold">127</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Data Sets</p>
                    <p className="text-2xl font-bold">43</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Citations</p>
                    <p className="text-2xl font-bold">312</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Collaborators</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Tools */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Available Research Tools</h3>
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getToolsByCategory(category).map(tool => {
                      const Icon = tool.icon
                      return (
                        <Card key={tool.id} className="glass-card hover:border-primary/50 transition-all duration-200 cursor-pointer" onClick={() => setSelectedTool(tool.id)}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-2">
                                <Icon className="h-5 w-5 text-primary" />
                                <CardTitle className="text-sm">{tool.name}</CardTitle>
                              </div>
                              <Badge variant={tool.status === "active" ? "default" : tool.status === "beta" ? "secondary" : "outline"} className="text-xs">
                                {tool.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground mb-3">{tool.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {tool.features.slice(0, 2).map(feature => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                              {tool.features.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{tool.features.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Analysis Results</h3>
            <div className="space-y-3">
              {recentAnalyses.map(analysis => (
                <Card key={analysis.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{analysis.fileName}</span>
                          <Badge variant="outline" className="text-xs">
                            {analysis.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{analysis.summary}</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.keyFindings.map((finding, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {finding}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Document Analysis Tools</h3>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>PDF Analyzer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Upload PDFs for AI-powered analysis, summarization, and key findings extraction.</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="h-4 w-4 mr-2" />
                    Deep Analysis
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Compare Documents
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Smart Annotations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">AI-assisted annotation and highlighting with context-aware suggestions.</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Tag className="h-4 w-4 mr-2" />
                    Auto-Tag Content
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Smart Bookmarks
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Quote className="h-4 w-4 mr-2" />
                    Extract Quotes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Data Analysis & Visualization</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Chart Builder</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Create interactive charts and graphs from your research data.</p>
                <Button variant="outline" className="w-full">
                  <LineChart className="h-4 w-4 mr-2" />
                  Create Chart
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Statistical Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Perform statistical tests and analysis on your datasets.</p>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Data Explorer</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Explore and visualize complex datasets with AI assistance.</p>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Explore Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="citations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Citation Management</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Citation
            </Button>
          </div>

          <div className="space-y-4">
            {citations.map(citation => (
              <Card key={citation.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{citation.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {citation.authors.join(", ")} ({citation.year}) • {citation.journal}
                      </p>
                      {citation.doi && (
                        <p className="text-xs text-muted-foreground">DOI: {citation.doi}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Collaboration Tools</h3>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Invite Collaborator
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Real-time Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Work together on documents and analyses in real-time.</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Active Sessions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="h-4 w-4 mr-2" />
                    Share Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Peer Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Get feedback and reviews from your research network.</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Request Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Queue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}