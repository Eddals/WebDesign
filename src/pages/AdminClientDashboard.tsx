import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import '../styles/dashboard.css';
import {
  Users,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Bell,
  X
} from 'lucide-react';
import { NotificationManager } from '../components/AdminNotifications/NotificationPopup';
import { adminNotificationService, AdminNotification } from '../lib/admin-notifications';
import { simpleClientService, ClientRegistration } from '../lib/simple-client-api';
import { dashboardService, Project, Message, Report, DashboardStats } from '../lib/dashboard-api';
import ProjectModal from '../components/Dashboard/ProjectModal';
import MessageModal from '../components/Dashboard/MessageModal';
import NotificationModal from '../components/Dashboard/NotificationModal';
import '../debug/test-reports';

const AdminClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'projects' | 'messages' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [clients, setClients] = useState<ClientRegistration[]>([]);
  const [pendingClients, setPendingClients] = useState<ClientRegistration[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | undefined>();
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  // Initialize admin notifications and load data
  useEffect(() => {
    // Initialize notifications
    adminNotificationService.initialize();

    // Load unread notifications
    adminNotificationService.getUnreadNotifications().then(notifications => {
      setNotifications(notifications);
      setUnreadCount(notifications.length);
    });

    // Load all clients
    simpleClientService.getAllClients().then(response => {
      if (response.success && response.data) {
        setClients(response.data);
      }
    });

    // Load pending clients
    simpleClientService.getPendingClients().then(response => {
      if (response.success && response.data) {
        setPendingClients(response.data);
      }
    });

    // Load dashboard stats
    dashboardService.getDashboardStats().then(response => {
      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    });

    // Load projects
    dashboardService.getProjects().then(response => {
      if (response.success && response.data) {
        setProjects(response.data);
      }
    });

    // Load messages
    dashboardService.getMessages().then(response => {
      if (response.success && response.data) {
        setMessages(response.data);
      }
    });

    // Load reports
    dashboardService.getReports().then(response => {
      if (response.success && response.data) {
        setReports(response.data);
      }
    });

    // Listen for new notifications
    const handleNewNotification = (notification: AdminNotification) => {
      console.log('🔔 Nova notificação recebida:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Reload clients when new registration
      if (notification.type === 'new_client_registration') {
        simpleClientService.getAllClients().then(response => {
          if (response.success && response.data) {
            setClients(response.data);
          }
        });
        simpleClientService.getPendingClients().then(response => {
          if (response.success && response.data) {
            setPendingClients(response.data);
          }
        });
      }
    };

    // Listen for new client registrations
    const handleNewClientRegistration = (clientData: any) => {
      console.log('👤 Novo cliente registrado diretamente:', clientData);
      // Reload clients
      simpleClientService.getAllClients().then(response => {
        if (response.success && response.data) {
          setClients(response.data);
        }
      });
      simpleClientService.getPendingClients().then(response => {
        if (response.success && response.data) {
          setPendingClients(response.data);
        }
      });
    };

    adminNotificationService.on('new_notification', handleNewNotification);
    adminNotificationService.on('new_client_registration', handleNewClientRegistration);

    // Subscribe to real-time updates
    const projectsSubscription = dashboardService.subscribeToProjects((payload) => {
      console.log('🔄 Project update:', payload);
      dashboardService.getProjects().then(response => {
        if (response.success && response.data) {
          setProjects(response.data);
        }
      });
    });

    const messagesSubscription = dashboardService.subscribeToMessages((payload) => {
      console.log('💬 Message update:', payload);
      dashboardService.getMessages().then(response => {
        if (response.success && response.data) {
          setMessages(response.data);
        }
      });
    });

    const reportsSubscription = dashboardService.subscribeToReports((payload) => {
      console.log('📊 Report update:', payload);
      dashboardService.getReports().then(response => {
        if (response.success && response.data) {
          setReports(response.data);
        }
      });
    });

    return () => {
      adminNotificationService.off('new_notification', handleNewNotification);
      adminNotificationService.off('new_client_registration', handleNewClientRegistration);
      adminNotificationService.cleanup();

      // Cleanup subscriptions
      projectsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
      reportsSubscription.unsubscribe();
    };
  }, []);

  // Handlers for modals
  const handleProjectCreated = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    // Refresh stats
    dashboardService.getDashboardStats().then(response => {
      if (response.success && response.data) {
        setDashboardStats(response.data);
      }
    });
  };

  const handleMessageSent = (message: Message) => {
    setMessages(prev => [message, ...prev]);
    setReplyToMessage(undefined);
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyToMessage(message);
    setShowMessageModal(true);
  };

  const handleMarkAsRead = async (messageId: string) => {
    const response = await dashboardService.markMessageAsRead(messageId);
    if (response.success) {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
    }
  };

  const handleClearAllMessages = async () => {
    if (window.confirm('Are you sure you want to clear all messages? This action cannot be undone.')) {
      const response = await dashboardService.clearAllMessages();
      if (response.success) {
        setMessages([]);
        // Refresh stats
        dashboardService.getDashboardStats().then(response => {
          if (response.success && response.data) {
            setDashboardStats(response.data);
          }
        });
      }
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      console.log('🔄 Generating report type:', reportType);
      setGeneratingReport(reportType);

      const response = await dashboardService.generateReport(reportType);

      console.log('📊 Report response:', response);

      if (response.success && response.data) {
        setReports(prev => [response.data!, ...prev]);

        // Refresh stats to update report count
        dashboardService.getDashboardStats().then(statsResponse => {
          if (statsResponse.success && statsResponse.data) {
            setDashboardStats(statsResponse.data);
          }
        });

        console.log('✅ Report generated successfully:', response.data.title);
        alert(`Report "${response.data.title}" generated successfully!`);
      } else {
        console.error('❌ Failed to generate report:', response.error);
        alert(`Failed to generate report: ${response.error}`);
      }
    } catch (error: any) {
      console.error('❌ Error generating report:', error);
      alert(`Error generating report: ${error.message}`);
    } finally {
      setGeneratingReport(null);
    }
  };

  // Quick Actions handlers
  const handleViewAllClients = () => {
    setActiveTab('clients');
  };

  const handleApprovePending = async () => {
    if (pendingClients.length === 0) {
      alert('No pending clients to approve');
      return;
    }

    const confirmApprove = window.confirm(`Approve all ${pendingClients.length} pending clients?`);
    if (!confirmApprove) return;

    try {
      for (const client of pendingClients) {
        await simpleClientService.updateClientStatus(client.id, 'approved');
      }

      // Refresh data
      const clientsResponse = await simpleClientService.getAllClients();
      if (clientsResponse.success && clientsResponse.data) {
        setClients(clientsResponse.data);
      }

      const pendingResponse = await simpleClientService.getPendingClients();
      if (pendingResponse.success && pendingResponse.data) {
        setPendingClients(pendingResponse.data);
      }

      // Refresh stats
      dashboardService.getDashboardStats().then(response => {
        if (response.success && response.data) {
          setDashboardStats(response.data);
        }
      });

      alert(`Successfully approved ${pendingClients.length} clients!`);
    } catch (error: any) {
      console.error('❌ Error approving clients:', error);
      alert(`Error approving clients: ${error.message}`);
    }
  };

  const handleViewNotifications = () => {
    setShowNotificationModal(true);
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await adminNotificationService.markAsRead(notificationId);

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);

      for (const notification of unreadNotifications) {
        await adminNotificationService.markAsRead(notification.id);
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Real-time stats based on actual data
  const stats = dashboardStats || {
    total_clients: clients.length,
    pending_clients: pendingClients.length,
    approved_clients: clients.filter(c => c.status === 'approved').length,
    total_projects: projects.length,
    active_projects: projects.filter(p => ['planning', 'in_progress', 'review'].includes(p.status)).length,
    completed_projects: projects.filter(p => p.status === 'completed').length,
    unread_messages: messages.filter(m => !m.is_read).length,
    unread_notifications: unreadCount,
    total_revenue: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    monthly_revenue: 0,
    recent_activities: []
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stats.total_clients}</p>
                <p className="text-blue-200 text-sm font-medium">Total Clients</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stats.pending_clients}</p>
                <p className="text-orange-200 text-sm font-medium">Pending Clients</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stats.approved_clients}</p>
                <p className="text-green-200 text-sm font-medium">Approved Clients</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{unreadCount}</p>
                <p className="text-red-200 text-sm font-medium">Unread Notifications</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Clients</h3>
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {clients.slice(0, 3).map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{client.full_name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{client.full_name}</h4>
                      <p className="text-purple-200 text-sm">{client.company_name || 'Sem empresa'}</p>
                      <p className="text-purple-300 text-xs">{client.email}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                    client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {client.status}
                  </span>
                </motion.div>
              ))}
              {clients.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-purple-200">Nenhum cliente registrado ainda</p>
                  <p className="text-purple-300 text-sm mt-1">Os novos registros aparecerão aqui</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewAllClients}
                className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span>View All Clients</span>
                  <Users className="w-5 h-5" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApprovePending}
                className="w-full p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span>Approve Pending ({pendingClients.length})</span>
                  <CheckCircle className="w-5 h-5" />
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewNotifications}
                className="w-full p-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span>View Notifications ({unreadCount})</span>
                  <Bell className="w-5 h-5" />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-2xl font-bold text-white">Client Management</h3>
          <p className="text-purple-200 text-sm mt-1">Manage and monitor all client registrations</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Client</span>
        </motion.button>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Industry</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Registered</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Country</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.filter(client =>
                  client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (client.company_name && client.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
                ).map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{client.full_name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{client.full_name}</h4>
                          <p className="text-purple-200 text-sm">{client.company_name || 'Sem empresa'}</p>
                          <p className="text-purple-300 text-xs">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-white text-sm">
                        {client.industry || 'Não informado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        client.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-200">{new Date(client.created_at).toLocaleDateString('pt-BR')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{client.country || 'Não informado'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {clients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="text-purple-200 text-lg font-semibold">Nenhum cliente registrado ainda</p>
                      <p className="text-purple-300 text-sm mt-1">Os novos registros aparecerão aqui automaticamente</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-2xl font-bold text-white">Projects Management</h3>
          <p className="text-purple-200 text-sm mt-1">Track and manage all client projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowProjectModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </motion.button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Projects</p>
              <p className="text-white text-2xl font-bold">{stats.total_projects}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Active Projects</p>
              <p className="text-white text-2xl font-bold">{stats.active_projects}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Completed</p>
              <p className="text-white text-2xl font-bold">{stats.completed_projects}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Revenue</p>
              <p className="text-white text-2xl font-bold">${stats.total_revenue?.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-white/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg mb-1">{project.title}</h4>
                  <p className="text-purple-200 text-sm">{project.client?.company_name || project.client?.full_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  project.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  project.status === 'planning' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-purple-100 text-sm mb-4 line-clamp-2">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-200">Progress</span>
                  <span className="text-white font-medium">{project.progress_percentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress_percentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-purple-200 text-sm">Budget: ${project.budget?.toLocaleString()}</span>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-purple-200 text-lg font-semibold">No projects yet</p>
            <p className="text-purple-300 text-sm mt-1">Create your first project to get started</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-2xl font-bold text-white">Messages</h3>
          <p className="text-purple-200 text-sm mt-1">Communicate with your clients</p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMessageModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Message</span>
          </motion.button>

          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearAllMessages}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <X className="w-5 h-5" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Messages</p>
              <p className="text-white text-2xl font-bold">{messages.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Unread Messages</p>
              <p className="text-white text-2xl font-bold">{stats.unread_messages}</p>
            </div>
            <Bell className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Urgent Messages</p>
              <p className="text-white text-2xl font-bold">{messages.filter(m => m.priority === 'urgent').length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold text-lg">Recent Messages</h4>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-white/10 text-purple-200 rounded-lg text-sm hover:bg-white/20 transition-all">
                  All
                </button>
                <button className="px-3 py-1 bg-white/10 text-purple-200 rounded-lg text-sm hover:bg-white/20 transition-all">
                  Unread
                </button>
                <button className="px-3 py-1 bg-white/10 text-purple-200 rounded-lg text-sm hover:bg-white/20 transition-all">
                  Urgent
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {messages.slice(0, 10).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-white/10 hover:bg-white/5 transition-all cursor-pointer ${
                  !message.is_read ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {message.from_user?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-white font-semibold truncate">
                        {message.from_user?.full_name || 'Unknown User'}
                      </h5>
                      <div className="flex items-center space-x-2">
                        {message.priority === 'urgent' && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                            Urgent
                          </span>
                        )}
                        <span className="text-purple-300 text-xs">
                          {new Date(message.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <p className="text-purple-200 text-sm mb-1">{message.subject}</p>
                    <p className="text-purple-100 text-sm line-clamp-2">{message.message}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-purple-300 text-xs">
                        {message.from_user?.company_name || 'Individual'}
                      </span>
                      <div className="flex space-x-2">
                        {!message.is_read && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleMarkAsRead(message.id)}
                            className="p-1 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded transition-all"
                            title="Mark as read"
                          >
                            <Eye className="w-3 h-3" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReplyToMessage(message)}
                          className="p-1 text-green-300 hover:text-white hover:bg-green-500/20 rounded transition-all"
                          title="Reply"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-purple-200 text-lg font-semibold">No messages yet</p>
                <p className="text-purple-300 text-sm mt-1">Messages from clients will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h3 className="text-2xl font-bold text-white">Reports & Analytics</h3>
          <p className="text-purple-200 text-sm mt-1">Business insights and performance metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Generate Report</span>
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Total Revenue</p>
              <p className="text-white text-2xl font-bold">${stats.total_revenue?.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Active Clients</p>
              <p className="text-white text-2xl font-bold">{stats.approved_clients}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Projects Done</p>
              <p className="text-white text-2xl font-bold">{stats.completed_projects}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Reports Generated</p>
              <p className="text-white text-2xl font-bold">{reports.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            type: 'financial',
            title: 'Financial Report',
            description: 'Revenue, expenses, and profit analysis',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600'
          },
          {
            type: 'project_status',
            title: 'Project Status Report',
            description: 'Current status of all projects',
            icon: FolderOpen,
            color: 'from-blue-500 to-indigo-600'
          },
          {
            type: 'client_activity',
            title: 'Client Activity Report',
            description: 'Client engagement and communication',
            icon: Users,
            color: 'from-purple-500 to-pink-600'
          },
          {
            type: 'performance',
            title: 'Performance Report',
            description: 'Team productivity and efficiency',
            icon: BarChart3,
            color: 'from-orange-500 to-red-600'
          }
        ].map((reportType, index) => {
          const Icon = reportType.icon;
          return (
            <motion.div
              key={reportType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${reportType.color} rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-white/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${reportType.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <motion.button
                    whileHover={{ scale: generatingReport === reportType.type ? 1 : 1.05 }}
                    whileTap={{ scale: generatingReport === reportType.type ? 1 : 0.95 }}
                    onClick={() => handleGenerateReport(reportType.type)}
                    disabled={generatingReport === reportType.type}
                    className={`px-4 py-2 text-white rounded-lg text-sm transition-all ${
                      generatingReport === reportType.type
                        ? 'bg-purple-600/50 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {generatingReport === reportType.type ? 'Generating...' : 'Generate'}
                  </motion.button>
                </div>

                <h4 className="text-white font-semibold text-lg mb-2">{reportType.title}</h4>
                <p className="text-purple-200 text-sm">{reportType.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h4 className="text-white font-semibold text-lg">Recent Reports</h4>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {reports.slice(0, 5).map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-b border-white/10 hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="text-white font-semibold">{report.title}</h5>
                    <p className="text-purple-200 text-sm">{report.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-purple-300 text-xs">
                        {new Date(report.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'generated' ? 'bg-green-500/20 text-green-300' :
                        report.status === 'generating' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-400" />
                </div>
                <p className="text-purple-200 text-lg font-semibold">No reports generated yet</p>
                <p className="text-purple-300 text-sm mt-1">Generate your first report to get insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'clients':
        return renderClients();
      case 'projects':
        return renderProjects();
      case 'messages':
        return renderMessages();
      case 'reports':
        return renderReports();
      default:
        return renderOverview();
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Client Dashboard - DevTone Agency</title>
        <meta name="description" content="Administrative dashboard for managing clients, projects, and communications at DevTone Agency." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Background with same style as homepage */}
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

        {/* Main Dashboard Layout - Clean without sidebar */}
        <div className="relative z-10 min-h-screen">
          <div className="flex flex-col min-h-screen">
              {/* Top Header */}
              <header className="dashboard-header bg-black/20 backdrop-blur-xl border-b border-white/10 p-6 flex-shrink-0">
              <div className="flex flex-col space-y-6">
                {/* Header with Logo and Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-white text-3xl font-bold">DevTone Admin</h1>
                      <p className="text-purple-200 text-sm mt-1">Complete Dashboard Management</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <div className="relative">
                    <button className="p-3 text-purple-300 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <Bell className="w-6 h-6" />
                    </button>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">Admin Panel</p>
                    <p className="text-purple-200 text-xs">DevTone Agency</p>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex space-x-2 overflow-x-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                            : 'bg-white/10 text-purple-200 hover:text-white hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              </div>
            </header>

              {/* Page Content */}
              <main className="dashboard-content flex-1 overflow-y-auto">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderContent()}
                </motion.div>
              </main>
            </div>
          </div>

        {/* Modals */}
        <ProjectModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onProjectCreated={handleProjectCreated}
          clients={clients}
        />

        <MessageModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false);
            setReplyToMessage(undefined);
          }}
          onMessageSent={handleMessageSent}
          clients={clients}
          replyTo={replyToMessage}
        />

        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        />

        {/* Notification Manager */}
        <NotificationManager isAdmin={true} />
      </div>
    </>
  );
};

export default AdminClientDashboard;
