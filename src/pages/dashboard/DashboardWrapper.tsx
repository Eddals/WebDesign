import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Placeholder components until the actual dashboard components are implemented
const PlaceholderComponent = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-gray-400 mb-8">This page is currently under development.</p>
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <p className="text-sm text-gray-400 mb-4">
        The dashboard functionality is being implemented. Please check back later.
      </p>
    </div>
  </div>
);

// Define placeholder components for each dashboard page
const Landing = () => <PlaceholderComponent title="Dashboard Home" />;
const Signup = () => <PlaceholderComponent title="Sign Up" />;
const SignIn = () => <PlaceholderComponent title="Sign In" />;
const AdminDashboard = () => <PlaceholderComponent title="Admin Dashboard" />;
const AdminClients = () => <PlaceholderComponent title="Admin Clients" />;
const AdminProjects = () => <PlaceholderComponent title="Admin Projects" />;
const AdminCommunications = () => <PlaceholderComponent title="Admin Communications" />;
const AdminSettings = () => <PlaceholderComponent title="Admin Settings" />;
const ClientDashboard = () => <PlaceholderComponent title="Client Dashboard" />;
const ClientProjects = () => <PlaceholderComponent title="Client Projects" />;
const ClientMessages = () => <PlaceholderComponent title="Client Messages" />;
const ClientFeedback = () => <PlaceholderComponent title="Client Feedback" />;
const NotFound = () => <PlaceholderComponent title="Page Not Found" />;

// Create a context to provide navigation functions to dashboard components
export const DashboardNavigationContext = React.createContext({
  navigate: (path: string) => {},
  currentPath: '/'
});

export default function DashboardWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace('/dashboard', '') || '/';

  // Navigation function that works with React Router
  const dashboardNavigate = (path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    navigate(`/dashboard/${cleanPath}`);
  };

  // Override window.location.href for dashboard components
  React.useEffect(() => {
    const originalLocation = window.location;
    
    // Create a proxy to intercept href assignments
    Object.defineProperty(window, 'location', {
      value: new Proxy(originalLocation, {
        set(target, property, value) {
          if (property === 'href' && typeof value === 'string') {
            // Check if it's a dashboard-related navigation
            if (value.startsWith('/signin') || value.startsWith('/signup') || 
                value.startsWith('/admin') || value.startsWith('/client') ||
                value === '/' || value.startsWith('/api/logout')) {
              
              if (value.startsWith('/api/logout')) {
                // Handle logout - redirect to main site
                window.location.href = '/';
                return true;
              }
              
              // Handle dashboard navigation
              const cleanPath = value.startsWith('/') ? value.slice(1) : value;
              if (cleanPath === '') {
                navigate('/dashboard');
              } else {
                navigate(`/dashboard/${cleanPath}`);
              }
              return true;
            }
          }
          return Reflect.set(target, property, value);
        }
      }),
      configurable: true
    });

    return () => {
      // Restore original location object
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        configurable: true
      });
    };
  }, [navigate]);

  // Simple routing logic
  const renderPage = () => {
    const contextValue = {
      navigate: dashboardNavigate,
      currentPath: path
    };

    const PageComponent = () => {
      switch (path) {
        case '/':
          return <Landing />;
        case '/signup':
          return <Signup />;
        case '/signin':
          return <SignIn />;
        case '/admin':
          return <AdminDashboard />;
        case '/admin/clients':
          return <AdminClients />;
        case '/admin/projects':
          return <AdminProjects />;
        case '/admin/communications':
          return <AdminCommunications />;
        case '/admin/settings':
          return <AdminSettings />;
        case '/client':
          return <ClientDashboard />;
        case '/client/projects':
          return <ClientProjects />;
        case '/client/messages':
          return <ClientMessages />;
        case '/client/feedback':
          return <ClientFeedback />;
        default:
          return <NotFound />;
      }
    };

    return (
      <DashboardNavigationContext.Provider value={contextValue}>
        <PageComponent />
      </DashboardNavigationContext.Provider>
    );
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}