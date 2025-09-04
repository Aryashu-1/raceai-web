"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  Settings,
  User,
  BookOpen,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  CheckCircle,
  Circle,
  BookmarkPlus,
  Code,
  StickyNote,
  Lightbulb,
  SearchIcon,
} from "lucide-react"
import { CursiveRLogo } from "@/components/cursive-r-logo"

const ResearchProcessCard = ({ title, description, progress, tasks, icon: Icon, color }) => (
  <div className="group relative mb-8">
    {/* Paper-like styling with subtle shadow */}
    <div className="bg-white dark:bg-slate-50 rounded-none shadow-sm border-l-4 border-slate-200 dark:border-slate-300 hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-300 transform hover:translate-x-1">
      <div className="p-8">
        {/* Header with academic paper styling */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shadow-sm`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-800 mb-1">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-700 font-light leading-relaxed">{description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-900">{progress}%</div>
            <div className="text-xs text-slate-500 dark:text-slate-600 uppercase tracking-wide">Complete</div>
          </div>
        </div>

        {/* Progress bar with academic styling */}
        <div className="mb-6">
          <div className="w-full bg-slate-100 dark:bg-slate-200 h-1 rounded-none">
            <div
              className={`h-1 rounded-none transition-all duration-1000 ease-out ${color.replace("bg-", "bg-")}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Tasks list with paper-like formatting */}
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-200 last:border-b-0"
            >
              {task.completed ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400" />
              )}
              <span
                className={`text-sm font-light ${task.completed ? "text-slate-500 line-through" : "text-slate-700 dark:text-slate-800"}`}
              >
                {task.title}
              </span>
              {task.dueDate && (
                <span className="ml-auto text-xs text-slate-500 dark:text-slate-600 italic">{task.dueDate}</span>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons with academic styling */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-200">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-900 text-white text-sm font-medium rounded-none hover:bg-slate-700 dark:hover:bg-slate-800 transition-colors">
            <StickyNote className="w-4 h-4" />
            Add Note
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-400 text-slate-700 dark:text-slate-800 text-sm font-medium rounded-none hover:bg-slate-50 dark:hover:bg-slate-100 transition-colors">
            <BookmarkPlus className="w-4 h-4" />
            Bookmark
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-400 text-slate-700 dark:text-slate-800 text-sm font-medium rounded-none hover:bg-slate-50 dark:hover:bg-slate-100 transition-colors">
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>
      </div>
    </div>
  </div>
)

const StatsCard = ({ icon: Icon, title, value, change, trend }) => (
  <div className="bg-white dark:bg-slate-50 shadow-sm border-l-2 border-slate-200 dark:border-slate-300 hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-300">
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-700 mb-1 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-800 mb-2">{value}</p>
          <div className={`flex items-center text-sm ${trend === "up" ? "text-emerald-700" : "text-red-700"}`}>
            <TrendingUp size={14} className={trend === "down" ? "rotate-180" : ""} />
            <span className="ml-1 font-light">{change}</span>
          </div>
        </div>
        <div className="w-10 h-10 bg-slate-800 dark:bg-slate-900 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  </div>
)

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const [userData] = useState({
    name: "Meghana",
    role: "Researcher",
    institution: "USC",
    researchFocus: "Machine Learning",
    completedOnboarding: true,
  })

  const researchProcesses = [
    {
      title: "Research Questions & Requirements",
      description: "Define research objectives, hypotheses, and methodological requirements for the study.",
      progress: 85,
      icon: Lightbulb,
      color: "bg-blue-600",
      tasks: [
        { title: "Define primary research question", completed: true },
        { title: "Identify secondary research questions", completed: true },
        { title: "Establish success metrics", completed: true },
        { title: "Review ethical considerations", completed: false, dueDate: "Dec 15" },
      ],
    },
    {
      title: "Literature Review & Analysis",
      description: "Comprehensive review of existing research, theoretical frameworks, and methodological approaches.",
      progress: 65,
      icon: BookOpen,
      color: "bg-emerald-600",
      tasks: [
        { title: "Systematic literature search", completed: true },
        { title: "Review 50+ relevant papers", completed: true },
        { title: "Synthesize theoretical framework", completed: false, dueDate: "Dec 20" },
        { title: "Identify research gaps", completed: false, dueDate: "Dec 22" },
      ],
    },
    {
      title: "Methodology & Implementation",
      description: "Design and implement research methodology, data collection, and analysis procedures.",
      progress: 40,
      icon: Target,
      color: "bg-purple-600",
      tasks: [
        { title: "Design experimental framework", completed: true },
        { title: "Prepare data collection tools", completed: false, dueDate: "Jan 5" },
        { title: "Implement analysis pipeline", completed: false, dueDate: "Jan 15" },
        { title: "Conduct pilot study", completed: false, dueDate: "Jan 20" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-100">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-300">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <CursiveRLogo size={32} />
              <div>
                <h1 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-800">
                  RACE Research Dashboard
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-700 font-light">
                  Academic Research Management System
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search research papers, notes, or topics..."
                  className="w-full py-2 pl-10 pr-4 bg-slate-50 dark:bg-slate-100 border border-slate-200 dark:border-slate-300 rounded-none text-sm text-slate-900 dark:text-slate-800 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-600 dark:text-slate-700 hover:text-slate-800 dark:hover:text-slate-900 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-600 dark:text-slate-700 hover:text-slate-800 dark:hover:text-slate-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-200 rounded-full">
                <div className="w-6 h-6 bg-slate-800 dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-800">{userData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="text-center mb-16" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
          <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-slate-800 mb-4 leading-tight">
            Research Progress Dashboard
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-700 font-light max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of ongoing research activities, literature review progress, and methodological
            development for {userData.name}'s {userData.researchFocus} research.
          </p>
          <div className="mt-6 text-sm text-slate-500 dark:text-slate-600">
            <span className="font-medium">{userData.institution}</span> •{" "}
            <span className="italic">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-800 mb-8 text-center">
            Research Metrics & Progress Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard icon={BookOpen} title="Papers Reviewed" value="47" change="+12 this week" trend="up" />
            <StatsCard icon={Target} title="Research Milestones" value="8/12" change="3 completed" trend="up" />
            <StatsCard icon={Users} title="Collaborations" value="5" change="2 new invites" trend="up" />
            <StatsCard icon={BarChart3} title="Citations Tracked" value="324" change="+8% this month" trend="up" />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-800 mb-8 text-center">
            Research Process Framework
          </h2>
          <div style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
            {researchProcesses.map((process, index) => (
              <ResearchProcessCard key={index} {...process} />
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-300 pt-8 mt-16">
          <div className="text-center text-sm text-slate-500 dark:text-slate-600">
            <p className="font-light">
              This dashboard provides a comprehensive overview of research activities and progress tracking.
            </p>
            <p className="mt-2 italic">Generated by RACE Research Management System • {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
