"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Target,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  BookOpen,
  GitBranch,
  Zap,
  Flag,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react"

interface WorkflowStep {
  id: string
  title: string
  description: string
  status: "not-started" | "in-progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "critical"
  assignee?: string
  dueDate?: Date
  estimatedHours?: number
  actualHours?: number
  dependencies?: string[]
  resources?: string[]
  notes?: string
}

interface ResearchProject {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "on-hold" | "completed"
  progress: number
  startDate: Date
  targetDate: Date
  team: string[]
  budget?: number
  steps: WorkflowStep[]
}

export default function ResearchWorkflowManager() {
  const [selectedProject, setSelectedProject] = useState<string>("1")
  const [showAddStep, setShowAddStep] = useState(false)

  const projects: ResearchProject[] = [
    {
      id: "1",
      name: "Quantum Computing Error Correction",
      description: "Research project investigating novel approaches to quantum error correction using topological qubits",
      status: "active",
      progress: 65,
      startDate: new Date("2024-09-01"),
      targetDate: new Date("2025-03-01"),
      team: ["Dr. Sarah Chen", "Alex Rodriguez", "Jamie Park"],
      budget: 150000,
      steps: [
        {
          id: "step-1",
          title: "Literature Review",
          description: "Comprehensive review of current quantum error correction methods",
          status: "completed",
          priority: "high",
          assignee: "Alex Rodriguez",
          dueDate: new Date("2024-10-15"),
          estimatedHours: 40,
          actualHours: 45,
        },
        {
          id: "step-2",
          title: "Experimental Setup",
          description: "Design and implement experimental apparatus for testing",
          status: "completed",
          priority: "critical",
          assignee: "Dr. Sarah Chen",
          dueDate: new Date("2024-11-30"),
          estimatedHours: 80,
          actualHours: 75,
          dependencies: ["step-1"],
        },
        {
          id: "step-3",
          title: "Data Collection Phase 1",
          description: "Initial data collection and baseline measurements",
          status: "in-progress",
          priority: "high",
          assignee: "Jamie Park",
          dueDate: new Date("2024-12-31"),
          estimatedHours: 60,
          actualHours: 35,
          dependencies: ["step-2"],
        },
        {
          id: "step-4",
          title: "Algorithm Development",
          description: "Develop new error correction algorithms based on collected data",
          status: "not-started",
          priority: "critical",
          assignee: "Dr. Sarah Chen",
          dueDate: new Date("2025-01-31"),
          estimatedHours: 100,
          dependencies: ["step-3"],
        },
        {
          id: "step-5",
          title: "Performance Analysis",
          description: "Analyze algorithm performance and compare with existing methods",
          status: "not-started",
          priority: "medium",
          assignee: "Alex Rodriguez",
          dueDate: new Date("2025-02-28"),
          estimatedHours: 50,
          dependencies: ["step-4"],
        },
        {
          id: "step-6",
          title: "Paper Writing",
          description: "Write and submit research paper to top-tier journal",
          status: "not-started",
          priority: "high",
          dueDate: new Date("2025-03-31"),
          estimatedHours: 60,
          dependencies: ["step-5"],
        },
      ],
    },
  ]

  const currentProject = projects.find(p => p.id === selectedProject)

  const getStatusIcon = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
    }
  }

  const getPriorityColor = (priority: WorkflowStep["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: WorkflowStep["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "blocked":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (!currentProject) return null

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{currentProject.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{currentProject.description}</p>
            </div>
            <Badge variant={currentProject.status === "active" ? "default" : "secondary"}>
              {currentProject.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Progress</p>
              <div className="space-y-1">
                <Progress value={currentProject.progress} className="h-2" />
                <p className="text-sm font-semibold">{currentProject.progress}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Team Size</p>
              <p className="text-lg font-semibold">{currentProject.team.length} members</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Target Date</p>
              <p className="text-sm font-semibold">{currentProject.targetDate.toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Budget</p>
              <p className="text-lg font-semibold">${currentProject.budget?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Team:</span>
                <div className="flex space-x-1">
                  {currentProject.team.map((member, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start Timer
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Timeline */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Research Workflow</CardTitle>
            <Button size="sm" onClick={() => setShowAddStep(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentProject.steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Timeline connector */}
                {index < currentProject.steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                )}

                <div className="flex items-start space-x-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(step.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-foreground">{step.title}</h4>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(step.priority)}`}></div>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(step.status)}`}>
                          {step.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      {step.assignee && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{step.assignee}</span>
                        </div>
                      )}
                      {step.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{step.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}
                      {step.estimatedHours && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{step.actualHours || 0}/{step.estimatedHours}h</span>
                        </div>
                      )}
                      {step.priority && (
                        <div className="flex items-center space-x-1">
                          <Flag className="h-3 w-3 text-muted-foreground" />
                          <span className="capitalize">{step.priority}</span>
                        </div>
                      )}
                    </div>

                    {step.dependencies && step.dependencies.length > 0 && (
                      <div className="mt-2 flex items-center space-x-1">
                        <GitBranch className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Depends on: {step.dependencies.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold">Generate Report</h3>
                <p className="text-sm text-muted-foreground">Create progress report</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold">Schedule Review</h3>
                <p className="text-sm text-muted-foreground">Plan milestone review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold">Auto-optimize</h3>
                <p className="text-sm text-muted-foreground">AI-powered scheduling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}