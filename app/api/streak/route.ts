import { NextRequest, NextResponse } from 'next/server';

// Demo streak data
export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database based on user ID
    const streak = {
      currentStreak: 5,
      longestStreak: 12,
      totalActiveDays: 47,
      lastActiveDate: new Date().toISOString(),
      weeklyActivity: [true, true, false, true, true, true, true], // Last 7 days
    };

    return NextResponse.json({ streak });
  } catch (error) {
    console.error('Error fetching streak:', error);
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Update user's streak (called when user performs an action)
    const { userId } = await request.json();

    // In production: Update database with new activity
    // - Check if today is already marked as active
    // - Update current streak if it's a new day
    // - Update longest streak if current > longest

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating streak:', error);
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
  }
}
