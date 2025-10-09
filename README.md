# RACE AI - Research Platform

A modern research collaboration platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
app/
├── api/              # API routes
├── dashboard/        # Main dashboard
├── jarvis/          # AI assistant interface
├── knowledge/       # Knowledge discovery
├── problems/        # Problem management
├── research/        # Research tools
└── profile/         # User profile

components/
├── ui/              # Base UI components
├── auth/            # Authentication components
├── onboarding/      # Onboarding flow
├── navigation-sidebar.tsx
├── command-palette.tsx
├── notification-center.tsx
└── ...

lib/
├── contexts/        # React contexts
├── features/        # Feature flags
└── llm-providers.ts # LLM integrations
```

## Features

### Core Platform

- Authentication with multiple providers
- AI-powered research assistant (JARVIS)
- Knowledge discovery and management
- Problem tracking and collaboration
- Real-time notifications
- Activity tracking

### User Engagement

- Streak tracking for daily engagement
- Daily digest emails
- Quick capture for ideas and notes
- Command palette (Cmd/Ctrl + K)
- Task management with Today's Focus

### UI/UX

- Light and dark mode support
- Responsive design
- Glass morphism effects
- Professional typography (Inter font)
- Accessibility-first approach

## Technology Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- React Hooks

## Theme System

The platform supports light, dark, and system themes:

```tsx
import { useAppTheme } from "@/components/theme-provider";

function Component() {
  const { theme, setTheme } = useAppTheme();

  return <button onClick={() => setTheme("dark")}>Switch to Dark Mode</button>;
}
```

## Design System

### Typography

- Base font size: 14px (0.875rem)
- Font family: Inter
- Letter spacing: -0.01em (body), -0.02em (headings)
- Line heights: 1.5 (body), 1.2 (headings)

### Colors (Light Mode)

- Background: #FFFFFF
- Foreground: #1D1D1F
- Primary: #0052CC
- Muted: #F5F5F7
- Border: #E8E8ED

### Colors (Dark Mode)

- Background: #0A1929
- Foreground: #F8FAFC
- Primary: #0052CC
- Muted: #1E293B
- Border: #1E293B

### Spacing

- Uses 8px base grid
- Consistent padding and margins
- Responsive breakpoints: 640px, 768px, 1024px

## API Routes

### Notifications

- `GET /api/notifications` - Fetch all notifications
- `GET /api/notifications/[id]` - Fetch single notification
- `POST /api/notifications/[id]/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/[id]` - Delete notification

### Activity

- `GET /api/activities` - Fetch recent activities
- `POST /api/activities` - Log new activity

### Streak

- `GET /api/streak` - Get current streak
- `POST /api/streak` - Update streak

### Quick Capture

- `POST /api/quick-capture` - Save idea/note/link/todo

### Daily Digest

- `POST /api/daily-digest` - Send daily summary email

### Today's Focus

- `GET /api/todays-focus` - Get daily tasks
- `POST /api/todays-focus` - Add task
- `PATCH /api/todays-focus/[id]` - Update task

## Feature Flags

Control features via `lib/features/feature-flags.ts`:

```ts
export const FEATURE_FLAGS = {
  NOTIFICATIONS: true,
  ACTIVITY_FEED: true,
  COMMAND_PALETTE: true,
  STREAK_TRACKER: true,
  DAILY_DIGEST: true,
  QUICK_CAPTURE: true,
  TODAYS_FOCUS: true,
};
```

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add other environment variables as needed
```

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Architecture

### State Management

- React Context for global state
- Custom hooks for reusable logic
- Server components for data fetching

### Styling

- Tailwind CSS with custom design system
- CSS custom properties for theming
- Glass morphism and modern effects

### Type Safety

- Full TypeScript coverage
- Strict type checking
- Interface-driven development

## Performance

- Optimized font loading
- Code splitting by route
- Image optimization
- Minimal client-side JavaScript
- Efficient re-renders with React patterns

## Accessibility

- Semantic HTML
- Keyboard navigation
- Focus management
- Screen reader support
- Reduced motion support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled

## Production Considerations

Before deploying to production:

1. Replace in-memory storage with database (PostgreSQL, MongoDB, etc.)
2. Add authentication middleware to API routes
3. Configure email service for daily digest
4. Add rate limiting to API endpoints
5. Set up monitoring and error tracking
6. Configure CDN for static assets
7. Enable caching strategies
8. Add security headers

## License

Proprietary
