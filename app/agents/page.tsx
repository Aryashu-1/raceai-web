"use client"

import { motion } from "framer-motion"
import { Plus, ArrowRight, Brain, Feather, BookOpen, Sigma, Search, Sparkles, Microscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import NavigationSidebar from "@/components/navigation-sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

const researchAgents = [
    {
        id: "deep-research",
        name: "Deep Researcher",
        description: "Autonomous web and archive scraping to compile comprehensive study reports.",
        icon: Search,
        category: "Discovery",
        color: "bg-blue-500",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        id: "lit-reviewer",
        name: "Literature Reviewer",
        description: "Synthesizes thousands of papers to identify gaps, trends, and key citations.",
        icon: BookOpen,
        category: "Analysis",
        color: "bg-purple-500",
        gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
        id: "data-scientist",
        name: "Data Scientist",
        description: "Advanced statistical modeling, hypothesis testing, and complex visualizations.",
        icon: Sigma,
        category: "Data",
        color: "bg-green-500",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        id: "lab-assistant",
        name: "Lab Assistant",
        description: "Manages experimental protocols, lab notes, and safety compliance checks.",
        icon: Microscope,
        category: "Operations",
        color: "bg-amber-500",
        gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
        id: "grant-writer",
        name: "Grant Writer",
        description: "Drafts compelling funding proposals and ensures alignment with agency requirements.",
        icon: Feather,
        category: "Writing",
        color: "bg-pink-500",
        gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
        id: "peer-reviewer",
        name: "Peer Reviewer",
        description: "Critiques methodology, logic, and citations to ensure publication readiness.",
        icon: Brain,
        category: "Quality",
        color: "bg-indigo-500",
        gradient: "from-indigo-500/20 to-violet-500/20"
    },
]

export default function AgentsPage() {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
            {/* Sidebar Integration */}
            <NavigationSidebar />

            <div className="flex-1 flex flex-col h-full relative z-10">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none" />
                
                <ScrollArea className="flex-1">
                    <div className="max-w-7xl mx-auto p-8 space-y-12">
                        
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                            <div>
                                <h1 className="text-5xl font-bold font-space-grotesk tracking-tight mb-3 text-foreground">
                                    Agent Marketplace
                                </h1>
                                <p className="text-muted-foreground text-lg max-w-2xl font-light">
                                    Deploy autonomous AI researchers to accelerate your scientific reviews, data analysis, and grant writing.
                                </p>
                            </div>
                            <Button className="rounded-full px-6 py-6 bg-card hover:bg-muted border border-border backdrop-blur-md transition-all group text-foreground">
                                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform text-primary" />
                                Create Custom Agent
                            </Button>
                        </div>

                        {/* Featured Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl group cursor-pointer hover:border-primary/20 transition-all duration-500">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="relative z-10 p-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-md mb-6">
                                            <Sparkles size={14} className="text-blue-400" />
                                            <span className="text-xs font-semibold tracking-wider uppercase text-blue-200">Featured Agent</span>
                                        </div>
                                        <h2 className="text-4xl font-bold font-space-grotesk mb-4 text-foreground">Thesis Architect 2.0</h2>
                                        <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">
                                            The ultimate companion for PhD candidates. Synthesizes literature, manages citations in real-time, and structures complex arguments for your dissertation.
                                        </p>
                                    </div>
                                    <Button className="w-fit mt-8 rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all font-semibold text-base shadow-xl shadow-primary/20">
                                            Deploy Agent <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                                
                                {/* 3D Abstract Elements (CSS) */}
                                <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-gradient-to-tl from-primary/20 to-cyan-500/20 blur-[80px] rounded-full translate-x-1/3 translate-y-1/3" />
                            </div>

                            <div className="rounded-[2rem] bg-card border border-border p-8 flex flex-col justify-between hover:bg-accent/5 transition-all hover:border-primary/20 group backdrop-blur-sm">
                                <div>
                                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                         <Brain className="w-7 h-7 text-primary" />
                                     </div>
                                     <h3 className="text-2xl font-bold font-space-grotesk mb-3 text-foreground">Fine-Tune</h3>
                                     <p className="text-muted-foreground text-base leading-relaxed">
                                        Train an agent specifically on your lab's previous publications and proprietary datasets.
                                     </p>
                                </div>
                                <Button variant="outline" className="w-full mt-6 py-6 rounded-xl border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground">
                                    Start Training
                                </Button>
                            </div>
                        </div>

                        {/* Agent Grid */}
                        <div className="pb-10">
                            <h3 className="text-2xl font-semibold font-space-grotesk mb-8 flex items-center gap-3">
                                Available Roles
                                <span className="text-sm font-normal text-muted-foreground px-3 py-1 bg-muted rounded-full border border-border">
                                    {researchAgents.length} Agents
                                </span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {researchAgents.map((agent, index) => (
                                    <motion.div 
                                        key={agent.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative bg-card border border-border rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 cursor-pointer overflow-hidden"
                                    >
                                        {/* Hover Gradient */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${agent.gradient}`} />
                                        
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`w-14 h-14 rounded-2xl ${agent.color} bg-opacity-10 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                                                    <agent.icon className={`w-7 h-7 ${agent.color.replace('bg-', 'text-')}`} />
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-medium tracking-wider uppercase text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    {agent.category}
                                                </div>
                                            </div>
                                            
                                            <h4 className="text-xl font-bold font-space-grotesk mb-2 text-foreground group-hover:text-primary transition-colors">{agent.name}</h4>
                                            
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-6 h-10 group-hover:text-foreground transition-colors">
                                                {agent.description}
                                            </p>

                                            <div className="flex items-center gap-3 pt-4 border-t border-border group-hover:border-primary/10">
                                                <Button size="sm" className="flex-1 bg-muted hover:bg-primary text-foreground hover:text-primary-foreground rounded-xl transition-all font-medium border border-border hover:border-transparent">
                                                    Deploy
                                                </Button>
                                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted text-muted-foreground hover:text-primary">
                                                    <ArrowRight size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
