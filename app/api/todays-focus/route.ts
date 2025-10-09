import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for tasks
let tasksStore = [
  {
    id: '1',
    title: 'Review literature on transformer architectures',
    completed: true,
    priority: 'high' as const,
    estimatedTime: 45,
  },
  {
    id: '2',
    title: 'Write methodology section draft',
    completed: false,
    priority: 'high' as const,
    estimatedTime: 90,
  },
  {
    id: '3',
    title: 'Analyze experiment results from yesterday',
    completed: false,
    priority: 'medium' as const,
    estimatedTime: 60,
  },
];

export async function GET(request: NextRequest) {
  try {
    // Calculate completion rate
    const completedCount = tasksStore.filter(t => t.completed).length;
    const completionRate = tasksStore.length > 0 ? Math.round((completedCount / tasksStore.length) * 100) : 0;

    const focus = {
      tasks: tasksStore,
      dailyGoal: 'Complete methodology section',
      completionRate,
      focusTime: 120,
    };

    return NextResponse.json({ focus });
  } catch (error) {
    console.error('Error fetching focus:', error);
    return NextResponse.json({ error: 'Failed to fetch focus' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, priority = 'medium', estimatedTime = 30 } = await request.json();

    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      completed: false,
      priority: priority as 'high' | 'medium' | 'low',
      estimatedTime,
    };

    tasksStore.push(newTask);

    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    console.error('Error adding task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { taskId, completed } = await request.json();

    // Update task in memory
    const taskIndex = tasksStore.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasksStore[taskIndex].completed = completed;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
