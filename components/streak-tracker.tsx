"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  lastActiveDate: string;
  weeklyActivity: boolean[]; // Last 7 days
}

export function StreakTracker({ className }: { className?: string }) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 5,
    longestStreak: 12,
    totalActiveDays: 47,
    lastActiveDate: new Date().toISOString(),
    weeklyActivity: [true, true, false, true, true, true, true],
  });

  useEffect(() => {
    // Fetch streak data from API
    fetch('/api/streak')
      .then((res) => res.json())
      .then((data) => setStreakData(data.streak || streakData))
      .catch(console.error);
  }, []);

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '🚀';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '✨';
    return '💪';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary researcher!';
    if (streak >= 14) return 'On fire!';
    if (streak >= 7) return 'Amazing consistency!';
    if (streak >= 3) return 'Building momentum!';
    return 'Keep it up!';
  };

  const getDayLabel = (index: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const dayIndex = (today - (6 - index) + 7) % 7;
    return days[dayIndex];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Your Streak</CardTitle>
            <CardDescription>Keep the momentum going!</CardDescription>
          </div>
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center py-6 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-lg border border-orange-500/20">
          <div className="text-6xl mb-2">{getStreakEmoji(streakData.currentStreak)}</div>
          <div className="text-4xl font-bold text-orange-500 mb-1">
            {streakData.currentStreak}
            <span className="text-xl ml-1">days</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {getStreakMessage(streakData.currentStreak)}
          </p>
        </div>

        {/* Weekly Activity */}
        <div>
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Week
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {streakData.weeklyActivity.map((active, index) => (
              <div key={index} className="text-center">
                <div
                  className={cn(
                    'w-full aspect-square rounded-md mb-1 flex items-center justify-center text-xs font-medium',
                    active
                      ? 'bg-orange-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {active ? '✓' : '-'}
                </div>
                <span className="text-xs text-muted-foreground">
                  {getDayLabel(index)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{streakData.longestStreak}</div>
            <p className="text-xs text-muted-foreground mt-1">Longest Streak</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{streakData.totalActiveDays}</div>
            <p className="text-xs text-muted-foreground mt-1">Active Days</p>
          </div>
        </div>

        {/* Motivation */}
        {streakData.currentStreak > 0 && (
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-sm text-muted-foreground">
              {streakData.currentStreak >= 7 ? (
                <>
                  <span className="font-semibold text-foreground">Amazing!</span> You've been active for {streakData.currentStreak} days straight.
                  {streakData.currentStreak < 30 && ` ${30 - streakData.currentStreak} more to reach legendary status!`}
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground">Keep going!</span> {7 - streakData.currentStreak} more day{7 - streakData.currentStreak !== 1 ? 's' : ''} to reach 1 week.
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
