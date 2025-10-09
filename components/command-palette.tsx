"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Folder,
  MessageSquare,
  Settings,
  User,
  Book,
  Target,
  Sparkles,
  Home,
  BarChart,
  Calendar,
  Upload,
  Clock,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type CommandAction = {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  category: 'navigation' | 'actions' | 'recent' | 'projects' | 'search';
  keywords: string[];
  action: () => void;
  badge?: string;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Define all available commands
  const commands = useMemo<CommandAction[]>(() => [
    // Navigation
    {
      id: 'nav-home',
      title: 'Go to Home',
      description: 'Navigate to home page',
      icon: <Home className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['home', 'dashboard', 'main'],
      action: () => { router.push('/'); setIsOpen(false); },
    },
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      description: 'View your research dashboard',
      icon: <BarChart className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['dashboard', 'overview', 'stats'],
      action: () => { router.push('/dashboard'); setIsOpen(false); },
    },
    {
      id: 'nav-jarvis',
      title: 'Open JARVIS',
      description: 'Chat with AI research assistant',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['jarvis', 'ai', 'chat', 'assistant'],
      action: () => { router.push('/jarvis'); setIsOpen(false); },
      badge: 'AI',
    },
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      description: 'Manage your research projects',
      icon: <Folder className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['projects', 'research', 'manage'],
      action: () => { router.push('/projects'); setIsOpen(false); },
    },
    {
      id: 'nav-knowledge',
      title: 'Go to Knowledge Base',
      description: 'Explore papers and resources',
      icon: <Book className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['knowledge', 'papers', 'library', 'resources'],
      action: () => { router.push('/knowledge'); setIsOpen(false); },
    },
    {
      id: 'nav-problems',
      title: 'Go to Problems & Funding',
      description: 'Find research problems and funding',
      icon: <Target className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['problems', 'funding', 'grants', 'opportunities'],
      action: () => { router.push('/problems'); setIsOpen(false); },
    },
    {
      id: 'nav-research',
      title: 'Go to Research Chat',
      description: 'Research-focused conversations',
      icon: <MessageSquare className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['research', 'chat', 'discussion'],
      action: () => { router.push('/research'); setIsOpen(false); },
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      description: 'Manage your preferences',
      icon: <Settings className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['settings', 'preferences', 'config'],
      action: () => { router.push('/settings'); setIsOpen(false); },
    },
    {
      id: 'nav-profile',
      title: 'Go to Profile',
      description: 'View and edit your profile',
      icon: <User className="h-4 w-4" />,
      category: 'navigation',
      keywords: ['profile', 'account', 'user'],
      action: () => { router.push('/profile'); setIsOpen(false); },
    },

    // Quick Actions
    {
      id: 'action-new-project',
      title: 'Create New Project',
      description: 'Start a new research project',
      icon: <Folder className="h-4 w-4" />,
      category: 'actions',
      keywords: ['create', 'new', 'project', 'start'],
      action: () => { router.push('/projects?new=true'); setIsOpen(false); },
    },
    {
      id: 'action-upload-paper',
      title: 'Upload Paper',
      description: 'Upload a research paper',
      icon: <Upload className="h-4 w-4" />,
      category: 'actions',
      keywords: ['upload', 'paper', 'document', 'pdf'],
      action: () => { router.push('/knowledge?upload=true'); setIsOpen(false); },
    },
    {
      id: 'action-new-chat',
      title: 'Start New Chat',
      description: 'Begin a new conversation with JARVIS',
      icon: <MessageSquare className="h-4 w-4" />,
      category: 'actions',
      keywords: ['chat', 'new', 'conversation', 'jarvis'],
      action: () => { router.push('/jarvis'); setIsOpen(false); },
    },
  ], [router]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) {
      return commands.filter((cmd) => cmd.category === 'navigation' || cmd.category === 'actions');
    }

    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      const matchesTitle = cmd.title.toLowerCase().includes(searchLower);
      const matchesDescription = cmd.description?.toLowerCase().includes(searchLower);
      const matchesKeywords = cmd.keywords.some((kw) => kw.includes(searchLower));
      return matchesTitle || matchesDescription || matchesKeywords;
    });
  }, [search, commands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {
      navigation: [],
      actions: [],
      recent: [],
      projects: [],
      search: [],
    };

    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });

    return groups;
  }, [filteredCommands]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      // Arrow navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      // Enter to execute
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'navigation': return 'Navigation';
      case 'actions': return 'Quick Actions';
      case 'recent': return 'Recent';
      case 'projects': return 'Projects';
      case 'search': return 'Search Results';
      default: return category;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            placeholder="Search or type a command... (⌘K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-14"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <ScrollArea className="max-h-[400px]">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No results found for "{search}"
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedCommands).map(([category, cmds]) => {
                if (cmds.length === 0) return null;

                return (
                  <div key={category} className="mb-4 last:mb-0">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {getCategoryLabel(category)}
                    </div>
                    {cmds.map((cmd, idx) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;

                      return (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted/50'
                          )}
                        >
                          <div className={cn(
                            'flex-shrink-0',
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          )}>
                            {cmd.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{cmd.title}</span>
                              {cmd.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {cmd.badge}
                                </Badge>
                              )}
                            </div>
                            {cmd.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {cmd.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                              ↵
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground bg-muted/30">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                ↵
              </kbd>
              Select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono font-medium">
                ESC
              </kbd>
              Close
            </span>
          </div>
          <span>{filteredCommands.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
