# Professional Dashboard System

A complete, real-time dashboard system for managing client projects, feedback, and communication built with React, TypeScript, and Supabase.

## Features

### 🔐 Authentication & Authorization
- Secure user authentication with Supabase Auth
- Role-based access control (Admin/Client)
- Protected routes with automatic redirects
- User profile management

### 📊 Project Management
- **Admin Features:**
  - Create, edit, and delete projects
  - Assign projects to clients
  - Update project status and deadlines
  - View all projects across all clients
- **Client Features:**
  - View assigned projects
  - Track project progress and status
  - See project deadlines and milestones

### 💬 Real-time Communication
- **Project Chat:**
  - Real-time messaging using Supabase websockets
  - Project-specific chat rooms
  - Message history and timestamps
  - User role indicators
- **Feedback System:**
  - Leave feedback on projects
  - Real-time feedback updates
  - Threaded conversations

### 📈 Analytics (Admin Only)
- Project status breakdown
- User statistics
- Activity metrics
- Quick action buttons

### 🔄 Real-time Updates
- Live project status changes
- Instant message delivery
- Real-time feedback notifications
- Automatic UI updates without refresh

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **State Management:** React Context API
- **Routing:** React Router v6
- **Real-time:** Supabase Websockets

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── components/
│   ├── ProtectedRoute.tsx       # Route protection
│   └── Dashboard/
│       ├── ProjectList.tsx      # Project management
│       ├── FeedbackSection.tsx  # Feedback system
│       ├── ChatSection.tsx      # Real-time chat
│       └── AnalyticsSection.tsx # Admin analytics
├── pages/
│   ├── Login.tsx               # Login page
│   ├── Signup.tsx              # Registration page
│   ├── Dashboard.tsx           # Client dashboard
│   └── AdminDashboard.tsx      # Admin dashboard
├── lib/
│   └── dashboard-service.ts    # API service layer
└── database/
    ├── dashboard_schema.sql    # Database schema
    └── rls_policies.sql       # Security policies
```

## Setup Instructions

### 1. Database Setup
1. Run the SQL schema in your Supabase project:
   ```sql
   -- Execute database/dashboard_schema.sql
   -- Execute database/rls_policies.sql
   ```

### 2. Environment Variables
Ensure your `.env` file contains:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 4. Configure Supabase
- Enable Row Level Security on all tables
- Set up authentication providers
- Configure realtime subscriptions

## Usage

### For Clients
1. **Access:** Navigate to `/dashboard` (requires login)
2. **Projects:** View assigned projects and their status
3. **Communication:** Chat with admin and leave feedback
4. **Updates:** Receive real-time notifications

### For Admins
1. **Access:** Navigate to `/admin-dashboard` (requires admin role)
2. **Project Management:** Create, assign, and manage all projects
3. **Analytics:** View dashboard metrics and statistics
4. **Communication:** Chat with all clients and respond to feedback

### Authentication Flow
1. **Registration:** `/signup` - Create new client account
2. **Login:** `/login` - Authenticate existing users
3. **Auto-redirect:** Based on user role (admin → admin-dashboard, client → dashboard)

## API Service Methods

### Projects
- `getProjects(isAdmin, userId)` - Fetch projects
- `createProject(project)` - Create new project
- `updateProject(id, updates)` - Update project
- `deleteProject(id)` - Delete project

### Feedback
- `getFeedback(projectId, isAdmin, userId)` - Fetch feedback
- `createFeedback(feedback)` - Add feedback

### Chat
- `getChatMessages(projectId, isAdmin, userId)` - Fetch messages
- `sendChatMessage(message)` - Send message

### Real-time Subscriptions
- `subscribeToProjects(callback, userId)` - Project updates
- `subscribeToFeedback(callback, projectId)` - Feedback updates
- `subscribeToChatMessages(callback, projectId)` - Chat updates

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Admins have elevated permissions
- Project-based access control
- Secure real-time subscriptions

### Authentication
- JWT-based authentication
- Secure password handling
- Session management
- Role-based authorization

## Customization

### Styling
- Uses Tailwind CSS classes
- Consistent color scheme with `text-primary`
- Responsive design for all screen sizes
- Professional UI components

### Extending Features
1. **Add new project fields:** Update schema and components
2. **Custom notifications:** Extend the real-time subscriptions
3. **File uploads:** Add file sharing to projects
4. **Advanced analytics:** Extend the analytics component

## Troubleshooting

### Common Issues
1. **Authentication errors:** Check Supabase configuration
2. **Real-time not working:** Verify RLS policies and realtime settings
3. **Permission denied:** Ensure proper role assignment
4. **Database errors:** Check schema and policies

### Debug Mode
Enable console logging in development:
```typescript
// In dashboard-service.ts
console.log('Debug:', data, error);
```

## Production Deployment

1. **Environment:** Set production Supabase credentials
2. **Security:** Review and test all RLS policies
3. **Performance:** Optimize queries and subscriptions
4. **Monitoring:** Set up error tracking and analytics

## Support

For issues or questions:
1. Check the console for error messages
2. Verify Supabase configuration
3. Review RLS policies
4. Test authentication flow

---

This dashboard system provides a complete, professional solution for client project management with real-time communication and secure access control.