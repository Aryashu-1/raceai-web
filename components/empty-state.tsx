"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      {illustration || (
        <div className="mb-6 rounded-full bg-muted p-6">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <Button onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick} variant="outline" size="lg">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

// Specialized Empty States
import {
  FolderOpen,
  FileText,
  Search,
  Inbox,
  Sparkles,
  MessageSquare,
  BookOpen,
  Target,
} from 'lucide-react';

export function EmptyProjects({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No projects yet"
      description="Start your research journey by creating your first project. Organize your work, collaborate with others, and track your progress all in one place."
      action={{
        label: 'Create Your First Project',
        onClick: onCreateProject,
      }}
    />
  );
}

export function EmptyDocuments({ onUpload }: { onUpload: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No documents yet"
      description="Upload research papers, notes, or other documents to get started. We'll help you organize and analyze them with AI."
      action={{
        label: 'Upload Document',
        onClick: onUpload,
      }}
    />
  );
}

export function EmptySearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms or exploring different keywords.`}
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={Inbox}
      title="You're all caught up!"
      description="No new notifications. We'll let you know when something important happens."
    />
  );
}

export function EmptyChat({ onStartChat }: { onStartChat: () => void }) {
  return (
    <EmptyState
      icon={Sparkles}
      title="Start a conversation"
      description="Ask JARVIS anything about your research. Get help with literature reviews, data analysis, writing, and more."
      action={{
        label: 'Start Chatting',
        onClick: onStartChat,
      }}
    />
  );
}

export function EmptyKnowledgeBase({ onExplore }: { onExplore: () => void }) {
  return (
    <EmptyState
      icon={BookOpen}
      title="Build your knowledge base"
      description="Discover papers, save resources, and create your personal research library. AI-powered recommendations help you find relevant work."
      action={{
        label: 'Explore Papers',
        onClick: onExplore,
      }}
    />
  );
}

export function EmptyProblems({ onBrowse }: { onBrowse: () => void }) {
  return (
    <EmptyState
      icon={Target}
      title="Find research opportunities"
      description="Browse open problems, funding opportunities, and research challenges in your field. Get matched with projects that align with your interests."
      action={{
        label: 'Browse Opportunities',
        onClick: onBrowse,
      }}
    />
  );
}
