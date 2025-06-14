// Dashboard API - DevTone Agency
// Complete API for all dashboard sections with real-time updates

import { supabase } from './supabase';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface Project {
  id: string;
  client_registration_id: string;
  title: string;
  description?: string;
  project_type: 'website' | 'ecommerce' | 'mobile_app' | 'web_app' | 'branding' | 'seo' | 'maintenance';
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget?: number;
  estimated_hours?: number;
  actual_hours: number;
  start_date?: string;
  estimated_completion_date?: string;
  actual_completion_date?: string;
  progress_percentage: number;
  project_url?: string;
  repository_url?: string;
  staging_url?: string;
  live_url?: string;
  assigned_to?: string;
  technologies: string[];
  milestones: any[];
  files: any[];
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: {
    full_name: string;
    company_name?: string;
    email: string;
  };
}

export interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  project_id?: string;
  subject?: string;
  message: string;
  message_type: 'general' | 'project_update' | 'support' | 'billing' | 'feedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments: any[];
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  reply_to?: string;
  thread_id?: string;
  created_at: string;
  read_at?: string;
  from_user?: {
    full_name: string;
    company_name?: string;
    email: string;
  };
  to_user?: {
    full_name: string;
    company_name?: string;
    email: string;
  };
  project?: {
    title: string;
  };
}

export interface Report {
  id: string;
  title: string;
  report_type: 'financial' | 'project_status' | 'client_activity' | 'performance' | 'custom';
  description?: string;
  data: Record<string, any>;
  filters: Record<string, any>;
  generated_by: string;
  date_range_start?: string;
  date_range_end?: string;
  status: 'generating' | 'generated' | 'failed';
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface DashboardStats {
  total_clients: number;
  pending_clients: number;
  approved_clients: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  unread_messages: number;
  total_revenue: number;
  monthly_revenue: number;
  recent_activities: ActivityLog[];
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// =====================================================
// DASHBOARD SERVICE CLASS
// =====================================================

class DashboardService {
  // =====================================================
  // OVERVIEW / STATS
  // =====================================================

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      console.log('🔄 Loading dashboard stats...');

      // Get client stats
      const { data: clients, error: clientError } = await supabase
        .from('client_registrations')
        .select('status');

      if (clientError) {
        console.error('❌ Error loading clients:', clientError);
        throw clientError;
      }

      const clientStats = clients?.reduce((acc: any, client: any) => {
        acc.total_clients++;
        if (client.status === 'pending') acc.pending_clients++;
        if (client.status === 'approved') acc.approved_clients++;
        return acc;
      }, { total_clients: 0, pending_clients: 0, approved_clients: 0 }) || { total_clients: 0, pending_clients: 0, approved_clients: 0 };

      // Get project stats
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('status, budget');

      if (projectError) {
        console.error('❌ Error loading projects:', projectError);
        // Don't throw, just use empty stats
      }

      const projectStats = projects?.reduce((acc: any, project: any) => {
        acc.total_projects++;
        if (['planning', 'in_progress', 'review'].includes(project.status)) acc.active_projects++;
        if (project.status === 'completed') acc.completed_projects++;
        if (project.budget) acc.total_revenue += Number(project.budget);
        return acc;
      }, { total_projects: 0, active_projects: 0, completed_projects: 0, total_revenue: 0 }) || { total_projects: 0, active_projects: 0, completed_projects: 0, total_revenue: 0 };

      // Get message stats
      const { data: messages, error: messageError } = await supabase
        .from('messages')
        .select('is_read')
        .eq('is_read', false);

      if (messageError) {
        console.error('❌ Error loading messages:', messageError);
      }

      const messageStats = { unread_messages: messages?.length || 0 };

      // Get recent activities
      const { data: activities, error: activityError } = await supabase
        .from('activity_logs')
        .select(`
          *,
          user:user_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) {
        console.error('❌ Error loading activities:', activityError);
      }

      const stats: DashboardStats = {
        ...clientStats,
        ...projectStats,
        ...messageStats,
        monthly_revenue: projectStats.total_revenue, // Simplified for demo
        recent_activities: activities || []
      };

      console.log('✅ Dashboard stats loaded:', stats);

      return {
        data: stats,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in getDashboardStats:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  // =====================================================
  // PROJECTS
  // =====================================================

  async getProjects(): Promise<ApiResponse<Project[]>> {
    try {
      console.log('🔄 Loading projects...');

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:client_registration_id(full_name, company_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading projects:', error);
        throw error;
      }

      console.log('✅ Projects loaded:', data?.length || 0);

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in getProjects:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  async createProject(projectData: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      console.log('🔄 Creating project:', projectData.title);

      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          client_registration_id: projectData.client_registration_id,
          project_type: projectData.project_type || 'website',
          status: projectData.status || 'planning',
          priority: projectData.priority || 'medium',
          budget: projectData.budget,
          estimated_hours: projectData.estimated_hours,
          start_date: projectData.start_date,
          estimated_completion_date: projectData.estimated_completion_date,
          progress_percentage: projectData.progress_percentage || 0,
          assigned_to: projectData.assigned_to || 'DevTone Team',
          technologies: projectData.technologies || [],
          notes: projectData.notes
        })
        .select(`
          *,
          client:client_registration_id(full_name, company_name, email)
        `)
        .single();

      if (error) {
        console.error('❌ Error creating project:', error);
        throw error;
      }

      console.log('✅ Project created successfully:', data.id);

      return {
        data: data,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in createProject:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select(`
          *,
          client:client_registrations(full_name, company_name, email)
        `)
        .single();

      if (error) throw error;

      return {
        data: data,
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  async deleteProject(projectId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      return {
        data: true,
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message,
        success: false
      };
    }
  }

  // =====================================================
  // MESSAGES
  // =====================================================

  async getMessages(): Promise<ApiResponse<Message[]>> {
    try {
      console.log('🔄 Loading messages...');

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          from_user:from_user_id(full_name, company_name, email),
          project:project_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading messages:', error);
        throw error;
      }

      console.log('✅ Messages loaded:', data?.length || 0);

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in getMessages:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  async sendMessage(messageData: Partial<Message>): Promise<ApiResponse<Message>> {
    try {
      console.log('🔄 Sending message:', messageData.subject);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          from_user_id: messageData.from_user_id,
          to_user_id: messageData.to_user_id,
          project_id: messageData.project_id,
          subject: messageData.subject,
          message: messageData.message,
          message_type: messageData.message_type || 'general',
          priority: messageData.priority || 'medium',
          attachments: messageData.attachments || [],
          reply_to: messageData.reply_to,
          thread_id: messageData.thread_id
        })
        .select(`
          *,
          from_user:from_user_id(full_name, company_name, email),
          project:project_id(title)
        `)
        .single();

      if (error) {
        console.error('❌ Error sending message:', error);
        throw error;
      }

      console.log('✅ Message sent successfully:', data.id);

      return {
        data: data,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in sendMessage:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  async markMessageAsRead(messageId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;

      return {
        data: true,
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message,
        success: false
      };
    }
  }

  async clearAllMessages(): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔄 Clearing all messages...');

      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('❌ Error clearing messages:', error);
        throw error;
      }

      console.log('✅ All messages cleared successfully');

      return {
        data: true,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in clearAllMessages:', error);
      return {
        data: false,
        error: error.message,
        success: false
      };
    }
  }

  async deleteMessage(messageId: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔄 Deleting message:', messageId);

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('❌ Error deleting message:', error);
        throw error;
      }

      console.log('✅ Message deleted successfully');

      return {
        data: true,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in deleteMessage:', error);
      return {
        data: false,
        error: error.message,
        success: false
      };
    }
  }

  // =====================================================
  // REPORTS
  // =====================================================

  async getReports(): Promise<ApiResponse<Report[]>> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  async generateReport(reportType: string): Promise<ApiResponse<Report>> {
    try {
      console.log('🔄 Generating report:', reportType);

      let reportData: any = {};
      let title = '';
      let description = '';

      // Generate real data based on report type
      switch (reportType) {
        case 'financial':
          // Get financial data
          console.log('📊 Fetching financial data...');
          const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('budget, status');

          if (projectsError) {
            console.error('❌ Error fetching projects for financial report:', projectsError);
          }

          const totalRevenue = projects?.reduce((sum: any, p: any) => sum + (p.budget || 0), 0) || 0;
          const completedProjects = projects?.filter((p: any) => p.status === 'completed').length || 0;

          reportData = {
            total_revenue: totalRevenue,
            completed_projects: completedProjects,
            active_projects: projects?.filter((p: any) => ['planning', 'in_progress', 'review'].includes(p.status)).length || 0,
            average_project_value: projects?.length ? totalRevenue / projects.length : 0,
            total_projects: projects?.length || 0
          };

          title = `Financial Report - ${new Date().toLocaleDateString('en-US')}`;
          description = 'Financial report with total revenue, completed projects and performance metrics';
          break;

        case 'project_status':
          // Get project status data
          console.log('📊 Fetching project status data...');
          const { data: allProjects, error: allProjectsError } = await supabase
            .from('projects')
            .select('status, priority, progress_percentage, created_at');

          if (allProjectsError) {
            console.error('❌ Error fetching projects for status report:', allProjectsError);
          }

          reportData = {
            total_projects: allProjects?.length || 0,
            by_status: allProjects?.reduce((acc: any, p: any) => {
              acc[p.status] = (acc[p.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {},
            by_priority: allProjects?.reduce((acc: any, p: any) => {
              acc[p.priority] = (acc[p.priority] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {},
            average_progress: allProjects?.length ?
              allProjects.reduce((sum: any, p: any) => sum + p.progress_percentage, 0) / allProjects.length : 0
          };

          title = `Project Status Report - ${new Date().toLocaleDateString('en-US')}`;
          description = 'Project status report with distribution by status and priority';
          break;

        case 'client_activity':
          // Get client activity data
          console.log('📊 Fetching client activity data...');
          const { data: clients, error: clientsError } = await supabase
            .from('client_registrations')
            .select('status, created_at, industry');

          if (clientsError) {
            console.error('❌ Error fetching clients for activity report:', clientsError);
          }

          const { data: messages, error: messagesError } = await supabase
            .from('messages')
            .select('created_at, message_type, priority');

          if (messagesError) {
            console.error('❌ Error fetching messages for activity report:', messagesError);
          }

          reportData = {
            total_clients: clients?.length || 0,
            new_clients_this_month: clients?.filter((c: any) =>
              new Date(c.created_at).getMonth() === new Date().getMonth()
            ).length || 0,
            by_status: clients?.reduce((acc, c) => {
              acc[c.status] = (acc[c.status] || 0) + 1;
              return acc;
            }, {} as Record<string, number>) || {},
            by_industry: clients?.reduce((acc, c) => {
              if (c.industry) {
                acc[c.industry] = (acc[c.industry] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>) || {},
            total_messages: messages?.length || 0,
            messages_this_month: messages?.filter(m =>
              new Date(m.created_at).getMonth() === new Date().getMonth()
            ).length || 0
          };

          title = `Client Activity Report - ${new Date().toLocaleDateString('en-US')}`;
          description = 'Client activity report with engagement statistics';
          break;

        case 'performance':
          // Get performance data
          console.log('📊 Fetching performance data...');
          const { data: performanceProjects, error: performanceError } = await supabase
            .from('projects')
            .select('estimated_hours, actual_hours, estimated_completion_date, actual_completion_date, status');

          if (performanceError) {
            console.error('❌ Error fetching projects for performance report:', performanceError);
          }

          const completedPerformanceProjects = performanceProjects?.filter(p => p.status === 'completed') || [];

          reportData = {
            total_projects: performanceProjects?.length || 0,
            completed_projects: completedPerformanceProjects.length,
            in_progress_projects: performanceProjects?.filter(p => p.status === 'in_progress').length || 0,
            on_time_delivery: completedPerformanceProjects.filter(p =>
              p.actual_completion_date && p.estimated_completion_date &&
              new Date(p.actual_completion_date) <= new Date(p.estimated_completion_date)
            ).length,
            average_hours_variance: completedPerformanceProjects.length ?
              completedPerformanceProjects.reduce((sum, p) =>
                sum + ((p.actual_hours || 0) - (p.estimated_hours || 0)), 0
              ) / completedPerformanceProjects.length : 0,
            efficiency_rate: completedPerformanceProjects.length ?
              (completedPerformanceProjects.filter(p =>
                (p.actual_hours || 0) <= (p.estimated_hours || 0)
              ).length / completedPerformanceProjects.length) * 100 : 0
          };

          title = `Performance Report - ${new Date().toLocaleDateString('en-US')}`;
          description = 'Performance report with delivery and efficiency metrics';
          break;

        default:
          throw new Error('Invalid report type');
      }

      // Insert the report
      const { data, error } = await supabase
        .from('reports')
        .insert({
          title,
          report_type: reportType,
          description,
          data: reportData,
          date_range_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          date_range_end: new Date().toISOString().split('T')[0],
          status: 'generated',
          generated_by: 'Admin'
        })
        .select('*')
        .single();

      if (error) {
        console.error('❌ Error generating report:', error);
        throw error;
      }

      console.log('✅ Report generated successfully:', data.id);

      return {
        data: data,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in generateReport:', error);
      return {
        data: null,
        error: error.message,
        success: false
      };
    }
  }

  // =====================================================
  // REAL-TIME SUBSCRIPTIONS
  // =====================================================

  subscribeToProjects(callback: (payload: any) => void) {
    return supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, callback)
      .subscribe();
  }

  subscribeToMessages(callback: (payload: any) => void) {
    return supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, callback)
      .subscribe();
  }

  subscribeToReports(callback: (payload: any) => void) {
    return supabase
      .channel('reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, callback)
      .subscribe();
  }

  subscribeToActivityLogs(callback: (payload: any) => void) {
    return supabase
      .channel('activity-logs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_logs' }, callback)
      .subscribe();
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;
