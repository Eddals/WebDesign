import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ClientLogin from '../components/ClientDashboard/ClientLogin';
import ClientDashboard from '../components/ClientDashboard/ClientDashboard';
import { authService } from '../lib/client-dashboard-api';
import type { AuthSession } from '../types/client-dashboard';

const ClientPortal: React.FC = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setSession(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newSession: AuthSession) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    setSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading client portal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Client Portal - DevTone Agency</title>
        <meta name="description" content="Access your project dashboard, track progress, and communicate with our team through the DevTone Agency client portal." />
        <meta name="keywords" content="client portal, project dashboard, DevTone Agency, project management, client access" />
        <meta property="og:title" content="Client Portal - DevTone Agency" />
        <meta property="og:description" content="Access your project dashboard and track progress with DevTone Agency." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devtone.agency/client-portal" />
        <link rel="canonical" href="https://devtone.agency/client-portal" />
      </Helmet>

      {session ? (
        <ClientDashboard session={session} onLogout={handleLogout} />
      ) : (
        <ClientLogin onLogin={handleLogin} />
      )}
    </>
  );
};

export default ClientPortal;
