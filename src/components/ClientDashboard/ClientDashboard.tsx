import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FolderOpen,
  Target,
  CheckSquare,
  MessageSquare,
  Upload,
  FileText,
  BarChart3,
  LogOut,
  Bell,
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';
import { dashboardService, authService } from '../../lib/client-dashboard-api';
import type { DashboardStats, AuthSession } from '../../types/client-dashboard';
import { realtimeService } from '../../lib/client-quick-actions';
import SendFeedbackModal from './SendFeedbackModal';
import UploadFileModal from './UploadFileModal';
import ScheduleMeetingModal from './ScheduleMeetingModal';

// Import dashboard components
import DashboardOverview from './DashboardOverview';
import ProjectsList from './ProjectsList';
import MilestonesList from './MilestonesList';
import TasksList from './TasksList';
import FeedbacksList from './FeedbacksList';
import FilesList from './FilesList';
import MessagesList from './MessagesList';

interface ClientDashboardProps {
  session: AuthSession;
  onLogout: () => void;
}

type ActiveTab = 'overview' | 'projects' | 'milestones' | 'tasks' | 'feedback' | 'files' | 'messages';

const ClientDashboard: React.FC<ClientDashboardProps> = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);

  // Quick Actions modals
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get client ID from user session
      // This would typically come from the user's client relationship
      // For now, we'll use a placeholder
      const mockClientId = '660e8400-e29b-41d4-a716-446655440001';
      setClientId(mockClientId);
      
      const response = await dashboardService.getStats(mockClientId);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'files', label: 'Files', icon: Upload },
    { id: 'messages', label: 'Messages', icon: FileText },
  ];

  const renderActiveComponent = () => {
    const props = { clientId, session };
    
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview stats={stats} {...props} />;
      case 'projects':
        return <ProjectsList {...props} />;
      case 'milestones':
        return <MilestonesList {...props} />;
      case 'tasks':
        return <TasksList {...props} />;
      case 'feedback':
        return <FeedbacksList {...props} />;
      case 'files':
        return <FilesList {...props} />;
      case 'messages':
        return <MessagesList {...props} />;
      default:
        return <DashboardOverview stats={stats} {...props} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background identical to homepage */}
        <div className="absolute inset-0 bg-[#030718]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-purple-950/10 to-[#030718] opacity-80"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImhzbCgyNzEsIDkxJSwgNjUlLCAwLjEpIi8+PC9zdmc+Cg==')] opacity-20"></div>

          {/* Floating gradient orbs like homepage */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background identical to homepage */}
      <div className="absolute inset-0 bg-[#030718]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030718] via-purple-950/10 to-[#030718] opacity-80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9ImhzbCgyNzEsIDkxJSwgNjUlLCAwLjEpIi8+PC9zdmc+Cg==')] opacity-20"></div>

        {/* Floating gradient orbs like homepage */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative fixed left-0 top-0 h-full w-80 bg-black/40 backdrop-blur-xl border-r border-white/20 z-50 lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://i.imgur.com/qZ9tgbe.png"
                alt="DevTone Logo"
                className="w-10 h-10"
              />
              <div>
                <h2 className="text-white font-bold text-lg">Client Portal</h2>
                <p className="text-purple-200 text-sm">DevTone Agency</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-purple-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{session.user?.full_name || 'User'}</h3>
              <p className="text-purple-200 text-sm">{session.user?.company_name || 'No company'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  setSidebarOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.id === 'feedback' && stats?.pending_feedbacks && stats.pending_feedbacks > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pending_feedbacks}
                  </span>
                )}
                {item.id === 'messages' && stats?.unread_messages && stats.unread_messages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.unread_messages}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-white/10 hover:text-white rounded-xl transition-all">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 lg:ml-80 min-h-screen">
        {/* Top Header */}
        <header className="bg-black/40 backdrop-blur-xl border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:text-purple-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-white text-xl font-bold capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all flex items-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Feedback</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Files</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMeetingModal(true)}
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition-all flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </motion.button>
              </div>

              <button className="relative text-white hover:text-purple-300">
                <Bell className="w-6 h-6" />
                {(stats?.pending_feedbacks || 0) + (stats?.unread_messages || 0) > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {(stats?.pending_feedbacks || 0) + (stats?.unread_messages || 0)}
                  </span>
                )}
              </button>
              <div className="text-white text-sm">
                Welcome back, {session.user?.full_name || 'User'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveComponent()}
          </motion.div>
        </main>
      </div>

      {/* Quick Actions Modals */}
      <SendFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        clientId={clientId}
        projects={projects}
        onFeedbackSent={(feedback) => {
          console.log('✅ Feedback sent:', feedback);
          // Refresh stats
          loadDashboardData();
        }}
      />

      <UploadFileModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        clientId={clientId}
        projects={projects}
        onFileUploaded={(file) => {
          console.log('✅ File uploaded:', file);
          // Refresh stats
          loadDashboardData();
        }}
      />

      <ScheduleMeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        clientId={clientId}
        projects={projects}
        onMeetingScheduled={(meeting) => {
          console.log('✅ Meeting scheduled:', meeting);
          // Refresh stats
          loadDashboardData();
        }}
      />
    </div>
  );
};

export default ClientDashboard;
