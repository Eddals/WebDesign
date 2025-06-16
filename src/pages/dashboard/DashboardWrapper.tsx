import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import the dashboard pages directly
import Landing from '../../components/Devtone-Dashboard/client/src/pages/landing';
import Signup from '../../components/Devtone-Dashboard/client/src/pages/signup';
import SignIn from '../../components/Devtone-Dashboard/client/src/pages/signin';
import AdminDashboard from '../../components/Devtone-Dashboard/client/src/pages/admin-dashboard';
import AdminClients from '../../components/Devtone-Dashboard/client/src/pages/admin-clients';
import AdminProjects from '../../components/Devtone-Dashboard/client/src/pages/admin-projects';
import AdminCommunications from '../../components/Devtone-Dashboard/client/src/pages/admin-communications';
import AdminSettings from '../../components/Devtone-Dashboard/client/src/pages/admin-settings';
import ClientDashboard from '../../components/Devtone-Dashboard/client/src/pages/client-dashboard';
import ClientProjects from '../../components/Devtone-Dashboard/client/src/pages/client-projects';
import ClientMessages from '../../components/Devtone-Dashboard/client/src/pages/client-messages';
import ClientFeedback from '../../components/Devtone-Dashboard/client/src/pages/client-feedback';
import NotFound from '../../components/Devtone-Dashboard/client/src/pages/not-found';

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