"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  BookOpen,
  Quote,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  Users,
  Share,
  Download,
  Copy,
  RefreshCw,
  Eye,
  Edit,
  Search,
  Filter,
  SortAsc,
  Globe,
  Link,
  Star,
  Calendar,
  User,
  Settings,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react"

interface Citation {
  id: string
  type: "journal" | "book" | "conference" | "website" | "thesis"
  title: string
  authors: string[]
  journal?: string
  year: number
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  url?: string
  isbn?: string
  publisher?: string
  location?: string
}

interface WritingDocument {
  id: string
  title: string
  content: string
  wordCount: number
  lastModified: Date
  collaborators: string[]
  citations: string[]
  status: "draft" | "review" | "final"
}

interface GrammarSuggestion {
  id: string
  text: string
  suggestion: string
  type: "grammar" | "style" | "clarity" | "conciseness"
  confidence: number
  position: { start: number; end: number }
}

export default function WritingAssistant() {
  const [activeTab, setActiveTab] = useState("editor")
  const [selectedDocument, setSelectedDocument] = useState<string>("1")
  const [showCitationForm, setShowCitationForm] = useState(false)
  const [currentContent, setCurrentContent] = useState("")

  const documents: WritingDocument[] = [
    {
      id: "1",
      title: "Quantum Error Correction: A Comprehensive Review",
      content: "Quantum computing represents one of the most promising frontiers in computational science...",
      wordCount: 2847,
      lastModified: new Date(Date.now() - 3600000),
      collaborators: ["Dr. Sarah Chen", "Alex Rodriguez"],
      citations: ["cite-1", "cite-2", "cite-3"],
      status: "draft"
    },
    {
      id: "2",
      title: "Machine Learning Applications in Drug Discovery",
      content: "The pharmaceutical industry has increasingly turned to artificial intelligence...",
      wordCount: 1923,
      lastModified: new Date(Date.now() - 7200000),
      collaborators: ["Dr. Michael Kim"],
      citations: ["cite-4", "cite-5"],
      status: "review"
    }
  ]

  const citations: Citation[] = [
    {
      id: "cite-1",
      type: "journal",
      title: "Quantum Error Correction for Beginners",
      authors: ["Nielsen, M. A.", "Chuang, I. L."],
      journal: "Physical Review A",
      year: 2023,
      volume: "67",
      issue: "3",
      pages: "032301",
      doi: "10.1103/PhysRevA.67.032301"
    },
    {
      id: "cite-2",
      type: "conference",
      title: "Topological Quantum Error Correction",
      authors: ["Kitaev, A."],
      journal: "Proceedings of Quantum Computing Conference",
      year: 2024,
      pages: "145-162"
    },
    {
      id: "cite-3",
      type: "journal",
      title: "Surface Code Error Correction",
      authors: ["Fowler, A. G.", "Mariantoni, M.", "Martinis, J. M."],
      journal: "Nature",
      year: 2024,
      volume: "526",
      pages: "682-686",
      doi: "10.1038/nature15263"
    }
  ]

  const grammarSuggestions: GrammarSuggestion[] = [
    {
      id: "1",
      text: "This sentence could be more concise",
      suggestion: "Remove redundant words for better clarity",
      type: "conciseness",
      confidence: 0.89,
      position: { start: 45, end: 78 }
    },
    {
      id: "2",
      text: "Consider using active voice",
      suggestion: "Change to active voice for better readability",
      type: "style",
      confidence: 0.92,
      position: { start: 123, end: 156 }
    }
  ]

  const formatCitation = (citation: Citation, style: string = "APA") => {
    const authors = citation.authors.join(", ")

    switch (style) {
      case "APA":
        return `${authors} (${citation.year}). ${citation.title}. ${citation.journal}${citation.volume ? `, ${citation.volume}` : ""}${citation.pages ? `, ${citation.pages}` : ""}.${citation.doi ? ` https://doi.org/${citation.doi}` : ""}`
      case "MLA":
        return `${authors}. "${citation.title}." ${citation.journal}${citation.volume ? ` ${citation.volume}` : ""}${citation.issue ? `.${citation.issue}` : ""} (${citation.year})${citation.pages ? `: ${citation.pages}` : ""}.`
      case "Chicago":
        return `${authors}. "${citation.title}." ${citation.journal}${citation.volume ? ` ${citation.volume}` : ""}${citation.issue ? `, no. ${citation.issue}` : ""} (${citation.year})${citation.pages ? `: ${citation.pages}` : ""}.${citation.doi ? ` https://doi.org/${citation.doi}` : ""}`
      default:
        return `${authors} (${citation.year}). ${citation.title}. ${citation.journal}.`
    }
  }

  const currentDoc = documents.find(doc => doc.id === selectedDocument)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Writing Assistant</h2>
          <p className="text-muted-foreground">AI-powered writing tools with citation management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Document
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="citations">Citations</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="collaboration">Collaborate</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Document List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDocument === doc.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedDocument(doc.id)}
                  >
                    <h4 className="font-medium text-sm mb-1">{doc.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{doc.wordCount} words</span>
                      <Badge variant="outline" className="text-xs">
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Editor */}
            <div className="lg:col-span-3 space-y-4">
              {currentDoc && (
                <>
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{currentDoc.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{currentDoc.wordCount} words</Badge>
                          <Button size="sm" variant="outline">
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={currentContent || currentDoc.content}
                        onChange={(e) => setCurrentContent(e.target.value)}
                        placeholder="Start writing your research paper..."
                        className="min-h-[400px] text-sm leading-relaxed"
                      />
                    </CardContent>
                  </Card>

                  {/* Writing Tools */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Brain className="h-6 w-6 text-blue-500" />
                          <div>
                            <h3 className="font-semibold text-sm">AI Assistant</h3>
                            <p className="text-xs text-muted-foreground">Get writing suggestions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Quote className="h-6 w-6 text-green-500" />
                          <div>
                            <h3 className="font-semibold text-sm">Quick Cite</h3>
                            <p className="text-xs text-muted-foreground">Add citations instantly</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-purple-500" />
                          <div>
                            <h3 className="font-semibold text-sm">Grammar Check</h3>
                            <p className="text-xs text-muted-foreground">Real-time corrections</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="citations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Citation Library</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search Database
              </Button>
              <Button size="sm" onClick={() => setShowCitationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Citation
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Citation List */}
            <div className="space-y-4">
              {citations.map(citation => (
                <Card key={citation.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{citation.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {citation.authors.join(", ")} ({citation.year})
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {citation.type}
                        </Badge>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-3 w-3" />
                        </Button>
                        {citation.url && (
                          <Button size="sm" variant="ghost">
                            <Globe className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {citation.journal && (
                      <p className="text-xs text-muted-foreground">{citation.journal}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Citation Formatter */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Citation Formatter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Style</label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">APA</Button>
                    <Button variant="outline" size="sm">MLA</Button>
                    <Button variant="outline" size="sm">Chicago</Button>
                    <Button variant="outline" size="sm">IEEE</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Formatted Citation</label>
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                    {citations.length > 0 && formatCitation(citations[0])}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grammar" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Grammar & Style Assistant</h3>
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze Document
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggestions */}
            <div className="space-y-4">
              <h4 className="font-medium">Suggestions</h4>
              {grammarSuggestions.map(suggestion => (
                <Card key={suggestion.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(suggestion.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{suggestion.text}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.suggestion}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Writing Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Writing Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold">2,847</p>
                    <p className="text-xs text-muted-foreground">Words</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold">187</p>
                    <p className="text-xs text-muted-foreground">Sentences</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold">15.2</p>
                    <p className="text-xs text-muted-foreground">Avg Words/Sentence</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-lg font-bold">8.3</p>
                    <p className="text-xs text-muted-foreground">Reading Level</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Readability Score</span>
                    <span className="font-medium">Good</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: "75%"}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Collaboration Tools</h3>
            <Button size="sm">
              <Users className="h-4 w-4 mr-2" />
              Invite Collaborator
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Active Collaborators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentDoc?.collaborators.map((collaborator, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{collaborator}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Editor</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Version History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Current Version</p>
                      <p className="text-xs text-muted-foreground">Last modified 1 hour ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Draft v2.1</p>
                      <p className="text-xs text-muted-foreground">Modified 2 days ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Export & Publishing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Format Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Word Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  LaTeX
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  HTML
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Journal Submission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-3">
                  Prepare your paper for journal submission with proper formatting.
                </p>
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Find Journals
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Format for Journal
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Sharing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Link className="h-4 w-4 mr-2" />
                  Generate Share Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="h-4 w-4 mr-2" />
                  Email Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to Repository
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}