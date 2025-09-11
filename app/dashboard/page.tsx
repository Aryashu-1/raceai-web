"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Settings,
  User,
  BookOpen,
  TrendingUp,
  Users,
  Star,
  Plus,
  Filter,
  Calendar,
  Clock,
  Brain,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";
import { CursiveRLogo } from "@/components/cursive-r-logo";

const StatsCard = ({ icon: Icon, title, value, change, trend }) => (
  <div className="group relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
    <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {value}
          </p>
          <div
            className={`flex items-center text-sm ${
              trend === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <TrendingUp
              size={14}
              className={trend === "down" ? "rotate-180" : ""}
            />
            <span className="ml-1">{change}</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
);

const PaperCard = ({ title, authors, journal, date, status, progress }) => (
  <div className="group relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
    <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
            {authors}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {journal} • {date}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "completed"
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : status === "in-progress"
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400"
          }`}
        >
          {status}
        </div>
      </div>

      {progress && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
          Continue Reading
        </button>
        <button className="py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-all duration-200">
          <Star size={16} />
        </button>
      </div>
    </div>
  </div>
);

const TaskItem = ({ title, type, dueDate, priority }) => (
  <div className="flex items-center gap-4 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200">
    <div
      className={`w-3 h-3 rounded-full shadow-sm ${
        priority === "high"
          ? "bg-red-500"
          : priority === "medium"
          ? "bg-amber-500"
          : "bg-emerald-500"
      }`}
    />
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
        {title}
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        {type} • Due {dueDate}
      </p>
    </div>
    <Clock className="w-4 h-4 text-slate-400" />
  </div>
);

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userData] = useState({
    name: "Meghana",
    role: "Researcher",
    institution: "USC",
    researchFocus: "Machine Learning",
    completedOnboarding: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <CursiveRLogo size={36} />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RACE.AI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Research Dashboard
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300" />
                <div className="relative flex items-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus-within:border-blue-300 dark:focus-within:border-blue-500">
                  <Search className="w-4 h-4 text-slate-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search papers, topics, or authors..."
                    className="flex-1 py-3 px-3 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200">
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <button className="flex items-center gap-3 p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {userData.name}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {userData.name}!
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Here's your research progress and what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={BookOpen}
            title="Papers Read"
            value="47"
            change="+12% this week"
            trend="up"
          />
          <StatsCard
            icon={Target}
            title="Research Goals"
            value="8/12"
            change="3 completed"
            trend="up"
          />
          <StatsCard
            icon={Users}
            title="Collaborations"
            value="5"
            change="2 new invites"
            trend="up"
          />
          <StatsCard
            icon={BarChart3}
            title="Citations"
            value="324"
            change="+8% this month"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Papers */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Recent Papers
                </h3>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all duration-200">
                    <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Paper
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <PaperCard
                  title="Neural Architecture Search for Transformer Models in Natural Language Processing"
                  authors="Smith, J. et al."
                  journal="Nature Machine Intelligence"
                  date="2024"
                  status="in-progress"
                  progress={65}
                />
                <PaperCard
                  title="Attention Mechanisms in Computer Vision: A Comprehensive Survey"
                  authors="Johnson, A. & Brown, M."
                  journal="IEEE TPAMI"
                  date="2024"
                  status="completed"
                  progress={100}
                />
                <PaperCard
                  title="Federated Learning with Differential Privacy in Healthcare Applications"
                  authors="Davis, K. et al."
                  journal="JMIR Med Inform"
                  date="2024"
                  status="saved"
                  progress={0}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tasks */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Today's Tasks
                </h3>
                <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-3">
                <TaskItem
                  title="Review Chapter 3 Draft"
                  type="Writing"
                  dueDate="Today"
                  priority="high"
                />
                <TaskItem
                  title="Data Analysis Meeting"
                  type="Meeting"
                  dueDate="2:00 PM"
                  priority="medium"
                />
                <TaskItem
                  title="Submit Conference Paper"
                  type="Submission"
                  dueDate="Tomorrow"
                  priority="high"
                />
              </div>
            </div>

            {/* JARVIS Assistant */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  JARVIS Insights
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-blue-800 dark:text-blue-300 font-medium text-sm">
                      New papers in your field
                    </p>
                  </div>
                  <p className="text-blue-700 dark:text-blue-400 text-xs">
                    3 papers on neural architecture search published this week
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <p className="text-purple-800 dark:text-purple-300 font-medium text-sm">
                      Collaboration opportunity
                    </p>
                  </div>
                  <p className="text-purple-700 dark:text-purple-400 text-xs">
                    Dr. Smith wants to collaborate on transformer research
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
