"use client";

import { useState, useEffect } from "react";
import { RaceGeometricLogo } from "./race-geometric-logo";

const timelineData = [
  {
    id: 1,
    title: "Discover",
    description:
      "AI-powered research discovery that finds relevant papers, datasets, and insights tailored to your field of study.",
    icon: "🔍",
    color: "from-blue-500 to-blue-600",
    delay: 0,
  },
  {
    id: 2,
    title: "Analyze",
    description:
      "Advanced natural language processing breaks down complex research papers into digestible insights and key findings.",
    icon: "🧠",
    color: "from-indigo-500 to-indigo-600",
    delay: 200,
  },
  {
    id: 3,
    title: "Collaborate",
    description:
      "Real-time collaboration tools that connect researchers worldwide, enabling seamless knowledge sharing and teamwork.",
    icon: "🤝",
    color: "from-purple-500 to-purple-600",
    delay: 400,
  },
  {
    id: 4,
    title: "Accelerate",
    description:
      "Streamlined research workflows and intelligent project management that accelerates your path to breakthrough discoveries.",
    icon: "🚀",
    color: "from-pink-500 to-pink-600",
    delay: 600,
  },
];

export function TimelineSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(
              entry.target.getAttribute("data-index") || "0"
            );
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = document.querySelectorAll("[data-timeline-item]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <RaceGeometricLogo size={32} variant="primary" showText={false} />
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
              How RACE AI Works
            </h2>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of research with our AI-powered platform that
            transforms how you discover, analyze, and collaborate on
            groundbreaking research.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-indigo-300 to-purple-200 dark:from-blue-800 dark:via-indigo-700 dark:to-purple-800 rounded-full" />

          {/* Timeline Items */}
          <div className="space-y-24">
            {timelineData.map((item, index) => (
              <div
                key={item.id}
                data-timeline-item
                data-index={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } flex-col lg:gap-16 gap-8`}
              >
                {/* Content Card */}
                <div
                  className={`flex-1 transform transition-all duration-700 ${
                    visibleItems.includes(index)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <div
                    className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 ${
                      index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                    } text-center`}
                  >
                    <div
                      className={`inline-flex items-center gap-3 mb-4 ${
                        index % 2 === 0 ? "lg:flex-row-reverse" : "lg:flex-row"
                      } flex-row`}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Central Circle */}
                <div className="relative z-20 flex-shrink-0">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${
                      item.color
                    } rounded-full flex items-center justify-center text-white text-2xl shadow-xl transform transition-all duration-700 ${
                      visibleItems.includes(index)
                        ? "scale-100 rotate-0"
                        : "scale-75 rotate-45"
                    }`}
                    style={{ transitionDelay: `${item.delay + 200}ms` }}
                  >
                    {item.icon}
                  </div>
                  {/* Pulse Animation */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      item.color
                    } rounded-full animate-ping opacity-20 ${
                      visibleItems.includes(index) ? "block" : "hidden"
                    }`}
                    style={{ animationDelay: `${item.delay + 400}ms` }}
                  />
                </div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Transform Your Research?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              Join thousands of researchers who are already accelerating their
              discoveries with RACE AI.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-full transition-all duration-200 hover:scale-105 shadow-lg">
              Start Your Research Journey
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
