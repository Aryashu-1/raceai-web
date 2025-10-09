"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Target, Plus, Clock, TrendingUp, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/contexts/toast-context';

interface FocusTask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number; // in minutes
}

interface TodaysFocusData {
  tasks: FocusTask[];
  dailyGoal: string;
  completionRate: number;
  focusTime: number; // in minutes
}

export function TodaysFocus({ className }: { className?: string }) {
  const { success, error } = useToast();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [focusData, setFocusData] = useState<TodaysFocusData>({
    tasks: [
      {
        id: '1',
        title: 'Review literature on transformer architectures',
        completed: true,
        priority: 'high',
        estimatedTime: 45,
      },
      {
        id: '2',
        title: 'Write methodology section draft',
        completed: false,
        priority: 'high',
        estimatedTime: 90,
      },
      {
        id: '3',
        title: 'Analyze experiment results from yesterday',
        completed: false,
        priority: 'medium',
        estimatedTime: 60,
      },
      {
        id: '4',
        title: 'Update research timeline',
        completed: false,
        priority: 'low',
        estimatedTime: 20,
      },
    ],
    dailyGoal: 'Complete methodology section',
    completionRate: 25,
    focusTime: 120,
  });

  useEffect(() => {
    fetchFocusData();
  }, []);

  const fetchFocusData = () => {
    fetch('/api/todays-focus')
      .then((res) => res.json())
      .then((data) => setFocusData(data.focus || focusData))
      .catch(console.error);
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      error('Please enter a task title');
      return;
    }

    try {
      const response = await fetch('/api/todays-focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          priority: 'medium',
          estimatedTime: 30,
        }),
      });

      if (response.ok) {
        success('Task added!', 'Added to your focus list');
        setNewTaskTitle('');
        setShowAddTask(false);
        fetchFocusData(); // Refresh the list
      } else {
        error('Failed to add task');
      }
    } catch (err) {
      error('Failed to add task');
      console.error(err);
    }
  };

  const toggleTask = async (taskId: string) => {
    setFocusData((prev) => {
      const updatedTasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const completionRate = Math.round((completedCount / updatedTasks.length) * 100);

      const newData = {
        ...prev,
        tasks: updatedTasks,
        completionRate,
      };

      // Update API
      fetch('/api/todays-focus', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: !prev.tasks.find((t) => t.id === taskId)?.completed }),
      }).catch(console.error);

      return newData;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const completedTasks = focusData.tasks.filter((t) => t.completed).length;
  const totalTasks = focusData.tasks.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Today's Focus</CardTitle>
            <CardDescription>Your priority tasks for today</CardDescription>
          </div>
          <Target className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Goal */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">Today's Goal</p>
              <p className="font-semibold">{focusData.dailyGoal}</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {completedTasks} of {totalTasks} completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 rounded-full"
              style={{ width: `${focusData.completionRate}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          {focusData.tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-all',
                task.completed
                  ? 'bg-muted/50 border-muted'
                  : 'bg-background border-border hover:bg-muted/30'
              )}
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={task.id}
                  className={cn(
                    'text-sm font-medium cursor-pointer',
                    task.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn('h-1.5 w-1.5 rounded-full', getPriorityColor(task.priority))} />
                  <span className="text-xs text-muted-foreground capitalize">{task.priority}</span>
                  {task.estimatedTime && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimatedTime} min
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Completion</span>
            </div>
            <p className="text-2xl font-bold">{focusData.completionRate}%</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Focus Time</span>
            </div>
            <p className="text-2xl font-bold">{focusData.focusTime}m</p>
          </div>
        </div>

        {/* Add Task Section */}
        {showAddTask ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Enter task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleAddTask} size="sm">
                Add
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddTask(false);
                  setNewTaskTitle('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Press Enter to add</p>
          </div>
        ) : (
          <Button variant="outline" className="w-full" size="sm" onClick={() => setShowAddTask(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
