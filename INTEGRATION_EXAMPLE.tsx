import { NotificationProvider } from "@/lib/contexts/notification-context";
import { ToastProvider } from "@/lib/contexts/toast-context";
import { CommandPalette } from "@/components/command-palette";
import { QuickCapture } from "@/components/quick-capture";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <NotificationProvider>
            <ToastProvider>
              {children}
              <CommandPalette />
              <QuickCapture />
            </ToastProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import { NotificationCenter } from "@/components/notification-center";

export function NavigationSidebar() {
  return (
    <div className="flex items-center gap-2">
      <NotificationCenter />
    </div>
  );
}

import { ActivityFeed } from "@/components/activity-feed";
import { StreakTracker } from "@/components/streak-tracker";
import { TodaysFocus } from "@/components/todays-focus";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodaysFocus />
        </div>

        <div className="space-y-6">
          <StreakTracker />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

import { EmptyProjects } from "@/components/empty-state";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const projects = [];

  if (projects.length === 0) {
    return (
      <EmptyProjects onCreateProject={() => router.push("/projects/new")} />
    );
  }

  return <div></div>;
}

("use client");

import { useToast } from "@/lib/contexts/toast-context";

export function YourComponent() {
  const { success, error, warning, info } = useToast();

  const handleSubmit = async () => {
    try {
      await api.createProject(data);
      success("Project created!", "Your research project is ready to use");
    } catch (err) {
      error("Failed to create project", "Please try again or contact support");
    }
  };

  const showWarning = () => {
    warning("Storage almost full", "You've used 90% of your quota");
  };

  const showInfo = () => {
    info("Pro tip", "Press ⌘K to quickly search and navigate");
  };

  return <button onClick={handleSubmit}>Create Project</button>;
}

("use client");

import { useNotifications } from "@/lib/contexts/notification-context";

export function CollaborationComponent() {
  const { addNotification } = useNotifications();

  const handleNewComment = async (comment) => {
    addNotification({
      userId: collaborator.id,
      type: "collaboration",
      title: "New comment on your project",
      message: `${user.name} commented: "${comment.text}"`,
      actionUrl: `/projects/${project.id}#comment-${comment.id}`,
      actionLabel: "View Comment",
    });
  };

  const handleMilestone = () => {
    addNotification({
      userId: user.id,
      type: "achievement",
      title: "🎉 Milestone reached!",
      message: "You've completed 10 research projects",
      actionUrl: "/profile",
      actionLabel: "View Profile",
    });
  };

  return null;
}

async function logActivity(activity: {
  userId: string;
  userName: string;
  action:
    | "created"
    | "updated"
    | "commented"
    | "shared"
    | "completed"
    | "uploaded";
  resourceType: "project" | "document" | "paper" | "note" | "experiment";
  resourceId: string;
  resourceName: string;
}) {
  await fetch("/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...activity,
      timestamp: new Date(),
    }),
  });
}

const handleCreateProject = async (data) => {
  const project = await createProject(data);

  await logActivity({
    userId: user.id,
    userName: user.name,
    action: "created",
    resourceType: "project",
    resourceId: project.id,
    resourceName: project.title,
  });

  success("Project created!");
};

async function updateStreak(userId: string) {
  await fetch("/api/streak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}

const handleUserAction = async () => {
  await updateStreak(user.id);
};

import { EmptyState } from "@/components/empty-state";
import { Sparkles, Upload } from "lucide-react";

function AnalysisPage({ analyses }) {
  if (analyses.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No AI analyses yet"
        description="Upload a research paper to get AI-powered insights, summaries, and recommendations."
        action={{
          label: "Upload Paper",
          onClick: () => router.push("/knowledge?upload=true"),
        }}
        secondaryAction={{
          label: "Browse Examples",
          onClick: () => router.push("/examples"),
        }}
      />
    );
  }

  return <div></div>;
}

const customCommands = [
  {
    id: "export-data",
    title: "Export Data",
    description: "Download your research data",
    icon: <Download className="h-4 w-4" />,
    category: "actions",
    keywords: ["export", "download", "backup"],
    action: () => {
      handleExport();
      setIsOpen(false);
    },
  },
  {
    id: "nav-experiments",
    title: "Go to Experiments",
    description: "View your experiments",
    icon: <Flask className="h-4 w-4" />,
    category: "navigation",
    keywords: ["experiments", "lab", "data"],
    action: () => {
      router.push("/experiments");
      setIsOpen(false);
    },
  },
];
