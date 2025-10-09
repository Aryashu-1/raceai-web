"use client"

import React, { useState } from "react"
import NavigationSidebar from "@/components/navigation-sidebar"
import AnimatedHeroBackground from "@/components/animated-hero-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Folder,
  Calendar,
  Users,
  FileText,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Share,
  Edit3,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "archived"
  progress: number
  dueDate: string
  team: string[]
  documents: number
  starred: boolean
  color: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Neural Network Research",
      description: "Developing novel architectures for image recognition",
      status: "active",
      progress: 65,
      dueDate: "2024-03-15",
      team: ["John Doe", "Jane Smith", "+2"],
      documents: 24,
      starred: true,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "NLP Literature Review",
      description: "Comprehensive analysis of recent transformer models",
      status: "active",
      progress: 40,
      dueDate: "2024-04-01",
      team: ["Alice Brown", "Bob Wilson"],
      documents: 18,
      starred: false,
      color: "bg-green-500",
    },
    {
      id: "3",
      name: "Quantum Computing Paper",
      description: "Exploring quantum algorithms for optimization problems",
      status: "completed",
      progress: 100,
      dueDate: "2024-02-28",
      team: ["Charlie Davis"],
      documents: 32,
      starred: false,
      color: "bg-[#0052CC]",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "archived">("all")
  const [showProjectMenu, setShowProjectMenu] = useState<string | null>(null)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const toggleStar = (projectId: string) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, starred: !p.starred } : p
    ))
  }

  const handleProjectAction = (action: string, projectId: string) => {
    switch(action) {
      case "archive":
        setProjects(projects.map(p =>
          p.id === projectId ? { ...p, status: "archived" } : p
        ))
        break
      case "delete":
        if (confirm("Are you sure you want to delete this project?")) {
          setProjects(projects.filter(p => p.id !== projectId))
        }
        break
    }
    setShowProjectMenu(null)
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <AnimatedHeroBackground />
      <NavigationSidebar />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                  Projects
                </h1>
                <p className="text-white/80 mt-1">Manage your research projects</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                <Plus size={18} />
                <span>New Project</span>
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={18} />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                />
              </div>
              <div className="flex gap-2">
                {(["all", "active", "completed", "archived"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    onClick={() => setFilterStatus(status)}
                    className={`rounded-xl capitalize ${
                      filterStatus === status
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border-white/20 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-2xl transition-all duration-300 border-white/20 bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden hover:bg-white/15"
              >
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${project.color}`} />
                      <CardTitle className="text-lg font-semibold text-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                        {project.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-white/20"
                        onClick={() => toggleStar(project.id)}
                      >
                        <Star
                          size={16}
                          className={project.starred ? "fill-yellow-400 text-yellow-400" : "text-white/60"}
                        />
                      </Button>
                      <div className="relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-white/20"
                          onClick={() => setShowProjectMenu(showProjectMenu === project.id ? null : project.id)}
                        >
                          <MoreVertical size={16} className="text-white/60" />
                        </Button>
                        {showProjectMenu === project.id && (
                          <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden">
                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                              <Edit3 size={14} className="text-slate-500" />
                              <span>Edit</span>
                            </button>
                            <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                              <Share size={14} className="text-slate-500" />
                              <span>Share</span>
                            </button>
                            <button
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                              onClick={() => handleProjectAction("archive", project.id)}
                            >
                              <Archive size={14} className="text-slate-500" />
                              <span>Archive</span>
                            </button>
                            <div className="border-t border-slate-200 dark:border-slate-700" />
                            <button
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
                              onClick={() => handleProjectAction("delete", project.id)}
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-white/80 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Progress</span>
                      <span className="font-medium text-white">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar size={14} />
                      <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <FileText size={14} />
                      <span>{project.documents} docs</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-xs font-medium text-white"
                        >
                          {member.startsWith("+") ? member : member.split(" ").map(n => n[0]).join("")}
                        </div>
                      ))}
                    </div>
                    <Badge
                      variant={project.status === "active" ? "default" : project.status === "completed" ? "secondary" : "outline"}
                      className="capitalize bg-primary/80 text-white border-white/20"
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}