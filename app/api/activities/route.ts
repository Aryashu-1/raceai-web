import { NextRequest, NextResponse } from 'next/server';
import { ActivityEvent } from '@/lib/types/notifications';

// In-memory storage for demo (replace with database in production)
let activitiesStore: ActivityEvent[] = [
  // Sample activities for demo
  {
    id: '1',
    userId: 'demo-user',
    userName: 'Sarah Chen',
    userAvatar: '',
    action: 'created',
    resourceType: 'project',
    resourceId: 'proj-1',
    resourceName: 'Machine Learning Research',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
  },
  {
    id: '2',
    userId: 'demo-user-2',
    userName: 'Alex Kumar',
    action: 'commented',
    resourceType: 'document',
    resourceId: 'doc-1',
    resourceName: 'Literature Review Draft',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: '3',
    userId: 'demo-user',
    userName: 'Maria Garcia',
    action: 'uploaded',
    resourceType: 'paper',
    resourceId: 'paper-1',
    resourceName: 'Attention Is All You Need',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, get activities from database with proper filtering
    const activities = activitiesStore
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20); // Limit to 20 most recent

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const activity: ActivityEvent = await request.json();

    // In production, save to database
    activitiesStore.push(activity);

    // Keep only last 100 activities
    if (activitiesStore.length > 100) {
      activitiesStore = activitiesStore.slice(-100);
    }

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
