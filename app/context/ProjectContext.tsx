"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { ProjectNode } from "../types/project";

interface ProjectContextState {
  projects: ProjectNode[];
  setProjects: (p: ProjectNode[]) => void;
}

const ProjectContext = createContext<ProjectContextState | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectNode[]>([]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectProvider");
  return ctx;
};
