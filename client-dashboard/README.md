# DevTone Client Dashboard

A modern, professional client dashboard for web development agencies built with Next.js, Supabase, and Tailwind CSS.

## Features

### 🔐 Authentication & Authorization
- Secure client login with Supabase Auth
- Role-based access control (Client/Admin)
- Protected routes with middleware

### 📊 Dashboard Overview
- Project statistics and metrics
- Recent activity timeline
- Upcoming deadlines tracking
- Progress visualization

### 🚀 Project Management
- Project overview with status tracking
- Milestone management and progress
- Priority and status indicators
- Budget and timeline tracking

### 💬 Communication
- Project-specific messaging system
- Real-time updates with Supabase subscriptions
- Internal notes for admin users
- Activity notifications

### 📁 File Management
- Secure file upload/download
- Project-specific file organization
- File type validation
- Storage with Supabase Storage

### 💳 Invoice & Payment Tracking
- Invoice generation and management
- Payment status tracking
- Stripe integration ready
- Financial reporting

### ⚙️ Admin Panel
- Client project management
- User role management
- System-wide oversight
- Approval workflows

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Payments**: Stripe (optional)
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (optional, for payments)

### 1. Clone and Install

```bash
git clone <repository-url>
cd client-dashboard
npm install
```

### 2. Environment Setup

Copy the environment file and configure:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the migration script in Supabase SQL Editor:

```sql
-- Copy and paste the content from supabase/migrations/001_initial_schema.sql
```

3. Enable Row Level Security in your Supabase dashboard
4. Configure Storage bucket for file uploads (optional)

### 4. Create Admin User

1. Go to Supabase Auth in your dashboard
2. Create a new user with admin email
3. Update the user's profile in the `profiles` table:

```sql
UPDATE profiles 
SET role = 'admin', full_name = 'Admin Name', company_name = 'Your Agency'
WHERE email = 'admin@youragency.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
client-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── login/              # Authentication
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── layout/             # Layout components
│   │   └── providers.tsx       # Context providers
│   ├── lib/                    # Utilities and configurations
│   │   └── supabase.ts         # Supabase client setup
│   └── types/                  # TypeScript type definitions
├── supabase/
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── package.json
```

## Key Components

### Authentication Flow
- Middleware protects all routes except `/login`
- Automatic redirection based on auth state
- Profile creation on user registration

### Real-time Features
- Live project updates
- Real-time messaging
- Activity notifications
- Progress tracking

### File Upload System
- Drag & drop interface
- File type validation
- Progress tracking
- Secure storage with Supabase

### Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Professional UI components
- Accessible design patterns

## Customization

### Branding
Update the logo and colors in:
- `src/components/layout/dashboard-layout.tsx`
- `tailwind.config.js` (color palette)
- `src/app/globals.css` (custom styles)

### Features
- Add new dashboard widgets in `src/components/dashboard/`
- Extend database schema in `supabase/migrations/`
- Add new pages in `src/app/dashboard/`

### Styling
- Modify Tailwind configuration
- Add custom CSS classes
- Update component styles

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

The application can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Considerations

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- Input validation and sanitization
- Secure file upload handling
- Protected API routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:
- Email: support@devtone.agency
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by DevTone Agency
