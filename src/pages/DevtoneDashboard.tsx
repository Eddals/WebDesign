import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';

// This component serves as the entry point to the Devtone Dashboard
export default function DevtoneDashboard() {
  // Use state to control when to redirect to avoid React Suspense issues
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Set a small timeout to avoid immediate redirect which can cause Suspense issues
    const timer = setTimeout(() => {
      setShouldRedirect(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Only redirect after component has mounted and the state has been updated
  useEffect(() => {
    if (shouldRedirect) {
      window.location.href = 'https://devtone.agency/devtone-dashboard';
    }
  }, [shouldRedirect]);

  return (
    <>
      <SEO
        title="Devtone Client Dashboard - DevTone"
        description="Access your client dashboard to manage your projects, view progress, and communicate with our team."
        keywords={['client dashboard', 'project management', 'client portal', 'DevTone']}
        ogUrl="https://devtone.agency/devtone-dashboard"
      />
      <div className="min-h-screen flex items-center justify-center bg-[#030718]">
        <div className="text-center max-w-md mx-auto p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Redirecting to Dashboard...</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-white/60 text-sm">
              If you are not redirected automatically, <a href="/devtone-dashboard" className="text-purple-400 hover:text-purple-300">click here</a>.
            </p>
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-xs">
                <strong>Note:</strong> Make sure the dashboard server is running on port 3001.<br />
                Run: <code className="bg-black/30 px-1 rounded">cd src/components/Devtone-Dashboard && npm run dev</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}