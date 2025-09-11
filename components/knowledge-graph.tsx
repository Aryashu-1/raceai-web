"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Users, PenTool, Brain } from "lucide-react";

const KnowledgeGraph = ({ isBackground = false }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    {
      id: 1,
      x: 20,
      y: 30,
      label: "Literature Review",
      icon: BookOpen,
      description: "AI-powered paper analysis and summarization",
    },
    {
      id: 2,
      x: 80,
      y: 20,
      label: "Data Analysis",
      icon: BarChart3,
      description: "Advanced statistical and ML analysis tools",
    },
    {
      id: 3,
      x: 70,
      y: 70,
      label: "Collaboration",
      icon: Users,
      description: "Real-time peer collaboration and sharing",
    },
    {
      id: 4,
      x: 30,
      y: 80,
      label: "Research Writing",
      icon: PenTool,
      description: "AI-assisted research paper writing",
    },
    {
      id: 5,
      x: 50,
      y: 50,
      label: "AI Summary",
      icon: Brain,
      description: "Intelligent research insights and summaries",
    },
  ];

  const connections = [
    { from: 1, to: 5 },
    { from: 2, to: 5 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 1 },
  ];

  return (
    <div
      className={`relative w-full ${
        isBackground
          ? "h-full opacity-60 dark:opacity-40"
          : "h-[600px] bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900 rounded-3xl"
      } overflow-hidden`}
    >
      <div
        className={`absolute inset-0 ${
          isBackground ? "opacity-60" : "opacity-20"
        }`}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#0052CC"
                strokeWidth={isBackground ? "0.8" : "1"}
                opacity={isBackground ? "0.4" : "0.5"}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => {
          const fromNode = nodes.find((n) => n.id === connection.from);
          const toNode = nodes.find((n) => n.id === connection.to);
          const isHighlighted =
            hoveredNode === connection.from || hoveredNode === connection.to;

          return (
            <motion.line
              key={index}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke={isHighlighted ? "#3B82F6" : "#0052CC"}
              strokeWidth={isHighlighted ? "3" : "2"}
              opacity={isBackground ? "0.5" : isHighlighted ? "1" : "0.6"}
              className="transition-all duration-300"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 12,
                delay: index * 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                repeatDelay: 4,
              }}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const IconComponent = node.icon;
        return (
          <motion.div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => !isBackground && setHoveredNode(node.id)}
            onMouseLeave={() => !isBackground && setHoveredNode(null)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: 1,
            }}
            transition={{
              scale: {
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: node.id * 0.8,
              },
              opacity: { duration: 0.8, delay: node.id * 0.2 },
            }}
            whileHover={{ scale: isBackground ? 1 : 1.2 }}
          >
            <div
              className={`relative ${
                isBackground ? "w-14 h-14" : "w-16 h-16"
              } rounded-xl ${
                isBackground
                  ? "bg-blue-500/30 dark:bg-blue-400/20 border border-blue-400/40 dark:border-blue-300/30"
                  : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-blue-400/50"
              } flex items-center justify-center transition-all duration-300 ${
                hoveredNode === node.id
                  ? "bg-blue-500/30 border-blue-300 shadow-lg shadow-blue-500/25"
                  : ""
              }`}
            >
              <IconComponent
                className={`${
                  isBackground ? "w-5 h-5" : "w-6 h-6"
                } text-blue-600 dark:text-blue-400`}
              />

              {!isBackground && hoveredNode === node.id && (
                <motion.div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl rounded-lg px-3 py-2 shadow-xl border border-blue-200/20 min-w-[160px] z-10"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <h3 className="font-medium text-white text-sm mb-1">
                    {node.label}
                  </h3>
                  <p className="text-xs text-slate-300">{node.description}</p>
                </motion.div>
              )}
            </div>

            {!isBackground && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white dark:text-white whitespace-nowrap">
                {node.label}
              </div>
            )}
          </motion.div>
        );
      })}

      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          isBackground ? "w-40 h-40" : "w-24 h-24"
        } bg-blue-500/15 dark:bg-blue-400/10 rounded-full blur-3xl`}
      />
    </div>
  );
};

export default KnowledgeGraph;
