"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MessageSquare, Search, Lightbulb, FolderKanban, Users, ArrowRight, Book, Atom, Network, FileText, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const steps = [
  {
    id: 1,
    title: "Ask & Inquire",
    description: "Start with a question. Jarvis breaks it down and guides your initial exploration.",
    icon: <MessageSquare className="w-5 h-5" />,
    dataShape: <Book className="w-4 h-4 text-blue-200" />, // Initial State: A Book/Question
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Discover Sources",
    description: "Your query transforms into a deep search across millions of papers and datasets.",
    icon: <Search className="w-5 h-5" />,
    dataShape: <FileText className="w-4 h-4 text-purple-200" />, // State: Documents
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Connect Concepts",
    description: "Synthesize findings. Connect disparate ideas into a coherent graph of knowledge.",
    icon: <Lightbulb className="w-5 h-5" />,
    dataShape: <Atom className="w-4 h-4 text-amber-200" />, // State: Atom/Idea
    color: "bg-amber-500",
  },
  {
    id: 4,
    title: "Structure Work",
    description: "Organize insights into actionable projects and tasks automatically.",
    icon: <FolderKanban className="w-5 h-5" />,
    dataShape: <Network className="w-4 h-4 text-green-200" />, // State: Network/Structure
    color: "bg-green-500",
  },
  {
    id: 5,
    title: "Collaborate",
    description: "Share your structured knowledge with peers to accelerate breakthroughs.",
    icon: <Users className="w-5 h-5" />,
    dataShape: <Sparkles className="w-4 h-4 text-pink-200" />, // Final State: Magic/Product
    color: "bg-pink-500",
  }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through steps for the "Data Point" simulation if user doesn't scroll specifically? 
  // actually let's make it a constant flow loop.
  
  useEffect(() => {
    const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000); // Change step every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto py-24 px-6 overflow-hidden">
      
      {/* 1. Restored Quote Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-5xl mx-auto relative mb-32 pt-10"
      >
         {/* Decorative quotes */}
         <span className="absolute -top-8 left-0 md:left-12 text-7xl md:text-9xl text-primary/20 font-serif font-black -z-10 select-none">“</span>
         <span className="absolute -bottom-8 right-0 md:right-12 text-7xl md:text-9xl text-primary/20 font-serif font-black -z-10 select-none">”</span>
         
         <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-primary dark:text-foreground px-8">
            Just you, your ideas, and an AI companion built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">every kind of researcher, by researchers.</span>
         </h2>
      </motion.div>


      {/* 2. Side-by-Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24" ref={containerRef}>
         
         {/* Left Column: Title & Description (Sticky) */}
         <div className="lg:col-span-4 relative">
             <div className="sticky top-32">
                <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                      From <span className="text-blue-500">Curiosity</span> to <span className="text-purple-500">Breakthrough</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                      See how your research evolves from a simple question into a powerful collaborative project.
                    </p>
                    
                    {/* Call to Action moved here for better flow */}
                    <button 
                        onClick={() => {
                        const element = document.getElementById('get-started');
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                        }}
                        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10">Start Your Journey</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                </motion.div>
             </div>
         </div>

         {/* Right Column: Steps (Vertical Timeline) */}
         <div className="lg:col-span-8 relative">
             
             {/* Vertical Connecting Line */}
             <div className="absolute left-[28px] top-4 bottom-12 w-1 bg-secondary rounded-full overflow-hidden">
                 <motion.div 
                   className="w-full bg-gradient-to-b from-transparent via-blue-500 to-transparent h-1/3 blur-sm"
                   animate={{ y: ["-100%", "400%"] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                 />
             </div>

             <div className="flex flex-col gap-12">
                {steps.map((step, index) => {
                    const isActive = activeStep === index;
                    
                    return (
                      <motion.div 
                        key={step.id}
                        className="relative flex items-start gap-8 group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                          {/* Node Point */}
                          <div className="relative shrink-0">
                              {/* Outer Glow Ring */}
                              <motion.div 
                                animate={{ scale: isActive ? [1, 1.2, 1] : 1, opacity: isActive ? 0.5 : 0 }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`absolute inset-0 rounded-full blur-md ${step.color}`} 
                              />
                              
                              {/* The Node Circle */}
                              <div className={`w-14 h-14 rounded-full border-4 border-background flex items-center justify-center relative z-10 transition-colors duration-500 ${isActive ? step.color : 'bg-muted/50'}`}>
                                  {/* Inner Icon */}
                                  <motion.div
                                    key={isActive ? 'active' : 'inactive'}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-white"
                                  >
                                      {isActive ? step.dataShape : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                                  </motion.div>
                              </div>

                               {/* Floating Source Particle */}
                               {isActive && (
                                  <motion.div
                                    layoutId="traveling-particle-v"
                                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${step.color} border border-white shadow-lg z-20`}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  />
                              )}
                          </div>

                          {/* Content Card */}
                          <div className={`flex-1 p-6 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-card border-primary/20 shadow-lg translate-x-2' : 'bg-card/30 border-transparent hover:bg-card/50'}`}>
                              <h3 className={`font-semibold text-xl mb-2 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {step.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                 {step.description}
                              </p>
                          </div>
                      </motion.div>
                    )
                })}
             </div>
         </div>

      </div>

    </section>
  );
}
