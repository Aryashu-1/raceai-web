"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Project, ProjectNode, ProjectStatus } from "../types/project";
import { mockProjects } from "../data/mockProjects";

interface ProjectContextState {
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;

  // Actions
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectStar: (id: string) => void;

  // File System Actions
  addNode: (projectId: string, parentId: string, node: ProjectNode) => void;
}

const ProjectContext = createContext<ProjectContextState | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Load initial data
  useEffect(() => {
    // In a real app, fetch from API. For now, use mock data.
    setProjects(mockProjects);
  }, []);

  const addProject = (project: Project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    // Also update active if it's the one being modified
    if (activeProject && activeProject.id === id) {
      setActiveProject((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
  };

  const toggleProjectStar = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isStarred: !p.isStarred } : p))
    );
  };

  // Simplified Node Addition (Need complex recursion for real tree update)
  const addNode = (projectId: string, parentId: string, node: ProjectNode) => {
    // Recursive function to find parent and add node
    const addNodeRecursive = (current: ProjectNode, targetParentId: string, newNode: ProjectNode): boolean => {
      if (current.id === targetParentId) {
        if (!current.children) current.children = [];
        current.children.push(newNode);
        return true;
      }
      if (current.children) {
        for (const child of current.children) {
          if (addNodeRecursive(child, targetParentId, newNode)) return true;
        }
      }
      return false;
    };

    setProjects((prev) =>
      prev.map((project) => {
        if (project.id === projectId) {
          // Deep clone rootNode to avoid mutation issues
          const newRoot = JSON.parse(JSON.stringify(project.rootNode));

          // Try adding to root first (if root is target) or traverse
          if (newRoot.id === parentId) {
            if (!newRoot.children) newRoot.children = [];
            newRoot.children.push(node);
            return { ...project, rootNode: newRoot };
          }

          if (addNodeRecursive(newRoot, parentId, node)) {
            return { ...project, rootNode: newRoot };
          }
        }
        return project;
      })
    );
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      setActiveProject,
      addProject,
      updateProject,
      deleteProject,
      toggleProjectStar,
      addNode
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used inside ProjectProvider");
  return ctx;
};
