import { NextRequest, NextResponse } from 'next/server';
import { Notification } from '@/lib/types/notifications';

// In-memory storage for demo (replace with database in production)
let notificationsStore: Notification[] = [];

export async function GET(request: NextRequest) {
  try {
    // In production, get userId from session/auth
    const userId = request.headers.get('x-user-id') || 'demo-user';

    // Filter notifications for the user and sort by date
    const userNotifications = notificationsStore
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50); // Limit to 50 most recent

    return NextResponse.json({ notifications: userNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const notification: Notification = await request.json();

    // In production, validate and save to database
    notificationsStore.push(notification);

    // Keep only last 100 notifications per user to prevent memory issues
    const userId = notification.userId;
    const userNotifs = notificationsStore.filter((n) => n.userId === userId);
    if (userNotifs.length > 100) {
      notificationsStore = notificationsStore.filter(
        (n) => n.userId !== userId || userNotifs.slice(-100).includes(n)
      );
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';

    // Clear all notifications for user
    notificationsStore = notificationsStore.filter((n) => n.userId !== userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json({ error: 'Failed to clear notifications' }, { status: 500 });
  }
}
