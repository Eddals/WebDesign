import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const ClientPortal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      alert('Client Portal is currently under maintenance. Please check back later.');
    }, 1500);
  };

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

      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Client Portal</h1>
            <p className="text-purple-200">Access your projects and communicate with our team</p>
          </div>

          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl text-yellow-300">
            Client Portal is currently under maintenance. Please check back later.
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 bg-white/10 border-white/20 rounded text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-purple-200">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-purple-200 text-sm">
              Don't have an account?{' '}
              <a href="/contact" className="text-purple-400 hover:text-purple-300 font-medium">
                Contact us
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ClientPortal;
