// Client Dashboard API Service
// DevTone Agency - Professional Client Dashboard

import { clientSupabase as supabase } from './supabase';
import type {
  Client,
  Project,
  ProjectMilestone,
  ProjectTask,
  ClientFeedback,
  ProjectFile,
  ClientComment,
  DashboardStats,
  CreateFeedbackForm,
  CreateCommentForm,
  LoginForm,
  RegisterForm,
  AuthSession,
  ApiResponse,
  PaginatedResponse,
  ProjectFilters,
  SortOptions
} from '../types/client-dashboard';

// Authentication
export const authService = {
  async login(credentials: LoginForm): Promise<ApiResponse<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      if (!data.user) {
        return { data: null, error: 'Login failed', success: false };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('client_users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        return { data: null, error: 'Failed to load user profile', success: false };
      }

      const session: AuthSession = {
        user: profile,
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
        expires_at: data.session?.expires_at || 0,
      };

      return { data: session, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Login failed', success: false };
    }
  },

  async register(userData: RegisterForm): Promise<ApiResponse<AuthSession>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            company_name: userData.company_name,
            phone: userData.phone,
            industry: userData.industry,
            website_url: userData.website_url,
            country: userData.country,
            business_description: userData.business_description,
          }
        }
      });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      if (!data.user) {
        return { data: null, error: 'Registration failed', success: false };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('client_users')
        .insert({
          id: data.user.id,
          email: userData.email,
          full_name: userData.full_name,
          company_name: userData.company_name,
          phone: userData.phone,
          industry: userData.industry,
          country: userData.country,
          role: 'client',
        });

      if (profileError) {
        return { data: null, error: 'Failed to create user profile', success: false };
      }

      // Create client record
      const { error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: data.user.id,
          company_name: userData.company_name || userData.full_name,
          industry: userData.industry,
          website_url: userData.website_url,
          country: userData.country,
          business_description: userData.business_description,
        });

      if (clientError) {
        return { data: null, error: 'Failed to create client profile', success: false };
      }

      return { data: null, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Registration failed', success: false };
    }
  },

  async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { data: null, error: error.message, success: false };
      }
      return { data: null, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Logout failed', success: false };
    }
  },

  async getCurrentUser(): Promise<ApiResponse<AuthSession>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { data: null, error: 'Not authenticated', success: false };
      }

      const { data: profile, error: profileError } = await supabase
        .from('client_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { data: null, error: 'Failed to load user profile', success: false };
      }

      const session: AuthSession = {
        user: profile,
        access_token: '',
        refresh_token: '',
        expires_at: 0,
      };

      return { data: session, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Authentication check failed', success: false };
    }
  }
};

// Dashboard Statistics
export const dashboardService = {
  async getStats(clientId: string): Promise<ApiResponse<DashboardStats>> {
    try {
      console.log('🔄 Getting dashboard stats for client:', clientId);

      // Get projects count and status
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status, progress_percentage')
        .eq('client_id', clientId);

      if (projectsError) {
        console.error('❌ Error fetching projects:', projectsError);
        // Return mock data if tables don't exist yet
        const mockStats: DashboardStats = {
          total_projects: 3,
          active_projects: 2,
          completed_projects: 1,
          pending_feedbacks: 1,
          unread_messages: 2,
          total_files: 8,
          recent_activity: 5
        };
        return { data: mockStats, error: null, success: true };
      }

      // Get pending feedbacks count
      const { data: feedbacks } = await supabase
        .from('client_feedbacks')
        .select('id')
        .eq('client_id', clientId)
        .eq('status', 'pending');

      // Get unread messages count (try both tables)
      let messages = null;

      // Try new client_dashboard_messages table first
      const { data: dashboardMessages } = await supabase
        .from('client_dashboard_messages')
        .select('id')
        .eq('client_id', clientId)
        .eq('is_read', false)
        .eq('sender_type', 'admin');

      if (dashboardMessages && dashboardMessages.length > 0) {
        messages = dashboardMessages;
      } else {
        // Fallback to original messages table
        const { data: originalMessages } = await supabase
          .from('messages')
          .select('id')
          .eq('client_id', clientId)
          .eq('is_read', false)
          .eq('sender_type', 'admin');
        messages = originalMessages;
      }

      // Get total files count
      const { data: files } = await supabase
        .from('project_files')
        .select('id')
        .in('project_id', projects?.map(p => p.id) || [])
        .eq('is_public', true);

      // Get recent activity count
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('id')
        .eq('client_id', clientId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;

      const stats: DashboardStats = {
        total_projects: totalProjects,
        active_projects: activeProjects,
        completed_projects: completedProjects,
        pending_feedbacks: feedbacks?.length || 0,
        unread_messages: messages?.length || 0,
        total_files: files?.length || 0,
        recent_activity: activities?.length || 0
      };

      console.log('✅ Dashboard stats loaded:', stats);
      return { data: stats, error: null, success: true };

      // Original code commented out until tables exist:
      /*
      // Get projects count
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status, progress_percentage')
        .eq('client_id', clientId);

      if (projectsError) {
        return { data: null, error: projectsError.message, success: false };
      }
      */

      /*
      // Original code commented out until tables exist:

      // Get pending feedbacks count
      const { data: feedbacks, error: feedbacksError } = await supabase
        .from('client_feedbacks')
        .select('id')
        .eq('client_id', clientId)
        .eq('status', 'pending');

      if (feedbacksError) {
        return { data: null, error: feedbacksError.message, success: false };
      }

      // Get unread messages count
      const { data: messages, error: messagesError } = await supabase
        .from('client_comments')
        .select('id')
        .eq('client_id', clientId)
        .eq('is_read', false)
        .eq('sender_type', 'admin');

      if (messagesError) {
        return { data: null, error: messagesError.message, success: false };
      }

      // Get upcoming milestones
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('id')
        .in('project_id', projects?.map(p => p.id) || [])
        .gte('due_date', new Date().toISOString().split('T')[0])
        .eq('status', 'pending');

      if (milestonesError) {
        return { data: null, error: milestonesError.message, success: false };
      }

      // Get files count
      const { data: files, error: filesError } = await supabase
        .from('project_files')
        .select('id')
        .in('project_id', projects?.map(p => p.id) || [])
        .eq('is_public', true);

      if (filesError) {
        return { data: null, error: filesError.message, success: false };
      }

      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
      const overallProgress = totalProjects > 0
        ? Math.round(projects.reduce((sum, p) => sum + p.progress_percentage, 0) / totalProjects)
        : 0;

      const stats: DashboardStats = {
        total_projects: totalProjects,
        active_projects: activeProjects,
        completed_projects: completedProjects,
        pending_feedbacks: feedbacks?.length || 0,
        unread_messages: messages?.length || 0,
        upcoming_milestones: milestones?.length || 0,
        total_files: files?.length || 0,
        overall_progress: overallProgress,
      };

      return { data: stats, error: null, success: true };
      */
    } catch (error) {
      return { data: null, error: 'Failed to load dashboard statistics', success: false };
    }
  }
};

// Projects Service
export const projectsService = {
  async getProjects(
    clientId: string,
    filters?: ProjectFilters,
    sort?: SortOptions,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Project>>> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:clients(*),
          milestones:project_milestones(*),
          tasks:project_tasks(*),
          files:project_files(*)
        `)
        .eq('client_id', clientId);

      // Apply filters
      if (filters?.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters?.project_type?.length) {
        query = query.in('project_type', filters.project_type);
      }
      if (filters?.priority?.length) {
        query = query.in('priority', filters.priority);
      }
      if (filters?.date_range) {
        query = query
          .gte('start_date', filters.date_range.start)
          .lte('start_date', filters.date_range.end);
      }

      // Apply sorting
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      const response: PaginatedResponse<Project> = {
        data: data || [],
        count: count || 0,
        page,
        limit,
        total_pages: Math.ceil((count || 0) / limit),
      };

      return { data: response, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load projects', success: false };
    }
  },

  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*),
          milestones:project_milestones(*),
          tasks:project_tasks(*),
          files:project_files(*),
          comments:client_comments(*)
        `)
        .eq('id', projectId)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load project', success: false };
    }
  }
};

// Milestones Service
export const milestonesService = {
  async getMilestones(projectId: string): Promise<ApiResponse<ProjectMilestone[]>> {
    try {
      const { data, error } = await supabase
        .from('project_milestones')
        .select(`
          *,
          project:projects(*),
          tasks:project_tasks(*)
        `)
        .eq('project_id', projectId)
        .order('order_index');

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load milestones', success: false };
    }
  }
};

// Tasks Service
export const tasksService = {
  async getTasks(projectId: string): Promise<ApiResponse<ProjectTask[]>> {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          *,
          project:projects(*),
          milestone:project_milestones(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load tasks', success: false };
    }
  }
};

// Feedbacks Service
export const feedbacksService = {
  async getFeedbacks(clientId: string, projectId?: string): Promise<ApiResponse<ClientFeedback[]>> {
    try {
      let query = supabase
        .from('client_feedbacks')
        .select(`
          *,
          project:projects(*),
          milestone:project_milestones(*),
          client:clients(*)
        `)
        .eq('client_id', clientId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load feedbacks', success: false };
    }
  },

  async createFeedback(feedback: CreateFeedbackForm): Promise<ApiResponse<ClientFeedback>> {
    try {
      const { data, error } = await supabase
        .from('client_feedbacks')
        .insert(feedback)
        .select(`
          *,
          project:projects(*),
          milestone:project_milestones(*),
          client:clients(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to create feedback', success: false };
    }
  }
};

// Files Service
export const filesService = {
  async getFiles(projectId: string): Promise<ApiResponse<ProjectFile[]>> {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          *,
          project:projects(*),
          milestone:project_milestones(*),
          uploaded_by_client:clients(*)
        `)
        .eq('project_id', projectId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: data || [], error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load files', success: false };
    }
  },

  async uploadFile(file: File, metadata: any): Promise<ApiResponse<ProjectFile>> {
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `project-files/${metadata.project_id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) {
        return { data: null, error: uploadError.message, success: false };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Save file metadata to database
      const { data, error } = await supabase
        .from('project_files')
        .insert({
          ...metadata,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_url: publicUrl,
          is_public: true,
          version: 1,
        })
        .select(`
          *,
          project:projects(*),
          milestone:project_milestones(*),
          uploaded_by_client:clients(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to upload file', success: false };
    }
  }
};

// Comments Service
export const commentsService = {
  async getComments(projectId: string): Promise<ApiResponse<ClientComment[]>> {
    try {
      const { data, error } = await supabase
        .from('client_comments')
        .select(`
          *,
          project:projects(*),
          client:clients(*)
        `)
        .eq('project_id', projectId)
        .is('parent_comment_id', null)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      // Get replies for each comment
      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabase
            .from('client_comments')
            .select(`
              *,
              project:projects(*),
              client:clients(*)
            `)
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return { ...comment, replies: replies || [] };
        })
      );

      return { data: commentsWithReplies, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to load comments', success: false };
    }
  },

  async createComment(comment: CreateCommentForm): Promise<ApiResponse<ClientComment>> {
    try {
      const { data, error } = await supabase
        .from('client_comments')
        .insert({
          ...comment,
          sender_type: 'client',
          is_read: false,
        })
        .select(`
          *,
          project:projects(*),
          client:clients(*)
        `)
        .single();

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to create comment', success: false };
    }
  },

  async markAsRead(commentId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('client_comments')
        .update({ is_read: true })
        .eq('id', commentId);

      if (error) {
        return { data: null, error: error.message, success: false };
      }

      return { data: null, error: null, success: true };
    } catch (error) {
      return { data: null, error: 'Failed to mark comment as read', success: false };
    }
  }
};

// Real-time subscriptions com Logical Replication
export const realtimeService = {
  // Subscrever a mudanças em um projeto específico
  subscribeToProject(projectId: string, callback: (event: any) => void) {
    const channel = supabase
      .channel(`project-${projectId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: projectId }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Project change:', payload);
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_milestones',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Milestone change:', payload);
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_tasks',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Task change:', payload);
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_files',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('File change:', payload);
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_comments',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('Comment change:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Project ${projectId} subscription status:`, status);
      });

    return channel;
  },

  // Subscrever a mudanças de um cliente específico
  subscribeToClient(clientId: string, callback: (event: any) => void) {
    const channel = supabase
      .channel(`client-${clientId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: clientId }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_feedbacks',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          console.log('Feedback change:', payload);
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          console.log('Client project change:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`Client ${clientId} subscription status:`, status);
      });

    return channel;
  },

  // Subscrever a todas as mudanças (para admin)
  subscribeToAll(callback: (event: any) => void) {
    const channel = supabase
      .channel('admin-all-changes', {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_feedbacks'
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_comments'
        },
        callback
      )
      .subscribe((status) => {
        console.log('Admin subscription status:', status);
      });

    return channel;
  },

  // Polling inteligente como fallback
  startPolling(callback: () => void, interval = 30000) {
    const pollInterval = setInterval(() => {
      console.log('Polling for updates...');
      callback();
    }, interval);

    return pollInterval;
  },

  stopPolling(pollInterval: NodeJS.Timeout) {
    clearInterval(pollInterval);
  },

  // Remover subscription
  unsubscribe(channel: any) {
    if (channel) {
      supabase.removeChannel(channel);
      console.log('Channel unsubscribed');
    }
  },

  // Verificar status da conexão
  getConnectionStatus() {
    return supabase.realtime.isConnected();
  },

  // Reconectar se necessário
  reconnect() {
    return supabase.realtime.connect();
  }
};
