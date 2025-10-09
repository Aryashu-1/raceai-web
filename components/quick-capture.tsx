"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Lightbulb, FileText, Link as LinkIcon, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/contexts/toast-context';

type CaptureType = 'idea' | 'note' | 'link' | 'todo';

export function QuickCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<CaptureType>('idea');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { success } = useToast();

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const captureTypes = [
    { type: 'idea', label: 'Idea', icon: Lightbulb, color: 'text-yellow-500' },
    { type: 'note', label: 'Note', icon: FileText, color: 'text-blue-500' },
    { type: 'link', label: 'Link', icon: LinkIcon, color: 'text-green-500' },
    { type: 'todo', label: 'To-Do', icon: CheckSquare, color: 'text-purple-500' },
  ];

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);

    try {
      // Save to API
      await fetch('/api/quick-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content }),
      });

      success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved!`, 'Added to your workspace');
      setContent('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 transition-transform',
          isOpen && 'rotate-45'
        )}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Capture Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <Card className="fixed bottom-24 right-6 w-96 z-50 shadow-2xl">
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Quick Capture</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Type Selector */}
              <div className="flex gap-2">
                {captureTypes.map(({ type: t, label, icon: Icon, color }) => (
                  <button
                    key={t}
                    onClick={() => setType(t as CaptureType)}
                    className={cn(
                      'flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all',
                      type === t
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', type === t ? color : 'text-muted-foreground')} />
                    <span className={cn(
                      'text-xs font-medium',
                      type === t ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Content Input */}
              <Textarea
                ref={textareaRef}
                placeholder={`What's your ${type}?${type === 'link' ? ' (Paste URL)' : ''}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] resize-none"
              />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">⌘</kbd>
                  {' + '}
                  <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">Enter</kbd>
                  {' to save'}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setContent('');
                      setIsOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!content.trim() || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
