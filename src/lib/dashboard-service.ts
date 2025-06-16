import { supabase } from './supabase';

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  start_date?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  client?: {
    name: string;
    email: string;
  };
}

export interface Feedback {
  id: string;
  project_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user?: {
    name: string;
    role: string;
  };
  project?: {
    title: string;
  };
}

export interface ChatMessage {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  sent_at: string;
  sender?: {
    name: string;
    role: string;
  };
  project?: {
    title: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  created_at: string;
}

// Project operations
export const getProjects = async (isAdmin: boolean = false, userId?: string) => {
  let query = supabase
    .from('projects')
    .select(`
      *,
      client:users!projects_client_id_fkey(name, email)
    `);

  if (!isAdmin && userId) {
    query = query.eq('client_id', userId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Project[];
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Project;
};

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Feedback operations
export const getFeedback = async (projectId?: string, isAdmin: boolean = false, userId?: string) => {
  let query = supabase
    .from('feedback')
    .select(`
      *,
      user:users!feedback_user_id_fkey(name, role),
      project:projects!feedback_project_id_fkey(title)
    `);

  if (projectId) {
    query = query.eq('project_id', projectId);
  } else if (!isAdmin && userId) {
    // For clients, only show feedback from their projects
    query = query.in('project_id', 
      supabase.from('projects').select('id').eq('client_id', userId)
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Feedback[];
};

export const createFeedback = async (feedback: Omit<Feedback, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedback])
    .select(`
      *,
      user:users!feedback_user_id_fkey(name, role),
      project:projects!feedback_project_id_fkey(title)
    `)
    .single();
  
  if (error) throw error;
  return data as Feedback;
};

// Chat operations
export const getChatMessages = async (projectId?: string, isAdmin: boolean = false, userId?: string) => {
  let query = supabase
    .from('chat_messages')
    .select(`
      *,
      sender:users!chat_messages_sender_id_fkey(name, role),
      project:projects!chat_messages_project_id_fkey(title)
    `);

  if (projectId) {
    query = query.eq('project_id', projectId);
  } else if (!isAdmin && userId) {
    // For clients, only show messages from their projects
    query = query.in('project_id', 
      supabase.from('projects').select('id').eq('client_id', userId)
    );
  }

  const { data, error } = await query.order('sent_at', { ascending: true });
  
  if (error) throw error;
  return data as ChatMessage[];
};

export const sendChatMessage = async (message: Omit<ChatMessage, 'id' | 'sent_at'>) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select(`
      *,
      sender:users!chat_messages_sender_id_fkey(name, role),
      project:projects!chat_messages_project_id_fkey(title)
    `)
    .single();
  
  if (error) throw error;
  return data as ChatMessage;
};

// User operations (admin only)
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as User[];
};

// Real-time subscriptions
export const subscribeToProjects = (callback: (payload: any) => void, userId?: string) => {
  let channel = supabase
    .channel('projects-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'projects',
        filter: userId ? `client_id=eq.${userId}` : undefined
      }, 
      callback
    );

  return channel.subscribe();
};

export const subscribeToFeedback = (callback: (payload: any) => void, projectId?: string) => {
  let channel = supabase
    .channel('feedback-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'feedback',
        filter: projectId ? `project_id=eq.${projectId}` : undefined
      }, 
      callback
    );

  return channel.subscribe();
};

export const subscribeToChatMessages = (callback: (payload: any) => void, projectId?: string) => {
  let channel = supabase
    .channel('chat-changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'chat_messages',
        filter: projectId ? `project_id=eq.${projectId}` : undefined
      }, 
      callback
    );

  return channel.subscribe();
};

// Analytics (admin only)
export const getDashboardAnalytics = async () => {
  const [projectsResult, usersResult, feedbackResult, messagesResult] = await Promise.all([
    supabase.from('projects').select('status'),
    supabase.from('users').select('role'),
    supabase.from('feedback').select('id'),
    supabase.from('chat_messages').select('id')
  ]);

  const projects = projectsResult.data || [];
  const users = usersResult.data || [];
  const feedback = feedbackResult.data || [];
  const messages = messagesResult.data || [];

  return {
    totalProjects: projects.length,
    projectsByStatus: {
      pending: projects.filter(p => p.status === 'pending').length,
      in_progress: projects.filter(p => p.status === 'in_progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      on_hold: projects.filter(p => p.status === 'on_hold').length,
    },
    totalUsers: users.length,
    usersByRole: {
      admin: users.filter(u => u.role === 'admin').length,
      client: users.filter(u => u.role === 'client').length,
    },
    totalFeedback: feedback.length,
    totalMessages: messages.length,
  };
};