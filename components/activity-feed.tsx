"use client";

import React from 'react';
import { useNotifications } from '@/lib/contexts/notification-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Folder, MessageSquare, Upload, CheckCircle, Share2, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export function ActivityFeed({ className }: { className?: string }) {
  const { activities } = useNotifications();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <Folder className="h-4 w-4" />;
      case 'updated': return <FileText className="h-4 w-4" />;
      case 'commented': return <MessageSquare className="h-4 w-4" />;
      case 'shared': return <Share2 className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'uploaded': return <Upload className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'text-blue-500';
      case 'updated': return 'text-yellow-500';
      case 'commented': return 'text-purple-500';
      case 'shared': return 'text-green-500';
      case 'completed': return 'text-emerald-500';
      case 'uploaded': return 'text-orange-500';
      default: return 'text-muted-foreground';
    }
  };

  const getActionText = (action: string, resourceType: string) => {
    return `${action} ${resourceType}`;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>What's happening in your workspace</CardDescription>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Activity className="h-12 w-12 text-muted-foreground opacity-20 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start working on projects to see activity here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 group">
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                    <AvatarFallback className="text-xs">
                      {activity.userName.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.userName}</span>
                          {' '}
                          <span className="text-muted-foreground">
                            {getActionText(activity.action, activity.resourceType)}
                          </span>
                        </p>
                        <Link
                          href={`/${activity.resourceType}s/${activity.resourceId}`}
                          className="text-sm font-medium hover:underline inline-block mt-0.5"
                        >
                          {activity.resourceName}
                        </Link>
                      </div>
                      <div className={`flex-shrink-0 ${getActionColor(activity.action)}`}>
                        {getActionIcon(activity.action)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
