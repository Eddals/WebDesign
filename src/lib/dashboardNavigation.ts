// Helper function to handle dashboard navigation
export const navigateToDashboard = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Navigate to the dashboard route
  window.location.href = `/dashboard/${cleanPath}`;
};

// Helper function to get the correct dashboard URL
export const getDashboardUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/dashboard/${cleanPath}`;
};