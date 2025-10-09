// Notification system types
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'collaboration'
  | 'mention'
  | 'deadline'
  | 'achievement';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: Date;
  metadata?: {
    projectId?: string;
    commentId?: string;
    mentionedBy?: string;
    achievementType?: string;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
  mentions: boolean;
  collaborations: boolean;
  deadlines: boolean;
  achievements: boolean;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: 'created' | 'updated' | 'commented' | 'shared' | 'completed' | 'uploaded';
  resourceType: 'project' | 'document' | 'paper' | 'note' | 'experiment';
  resourceId: string;
  resourceName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  totalActiveDays: number;
}
