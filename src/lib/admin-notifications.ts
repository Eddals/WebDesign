// Admin Notifications System
import { supabase } from './supabase';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  action_required: boolean;
  action_type?: string;
  client_registration_id?: string;
  data?: any;
  created_at: string;
}

export interface ClientRegistrationData {
  user_name: string;
  user_email: string;
  company_name?: string;
  phone?: string;
  registration_time: string;
}

// Get all notifications for the admin
export const getAdminNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  
  return data as Notification[];
};

// Mark a notification as read
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('admin_notifications')
    .update({ read: true })
    .eq('id', id);
  
  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
  
  return true;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const { error } = await supabase
    .from('admin_notifications')
    .update({ read: true })
    .eq('read', false);
  
  if (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
  
  return true;
};

// Delete a notification
export const deleteNotification = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('admin_notifications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
  
  return true;
};

// Subscribe to new notifications
export const subscribeToNotifications = (callback: (notification: Notification) => void) => {
  const channel = supabase
    .channel('admin-notifications')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'admin_notifications'
      }, 
      (payload: any) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();
  
  return channel;
};

// Format notification time to a human-readable format
export const formatNotificationTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Get color class based on notification priority
export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/20 text-red-400';
    case 'high':
      return 'bg-orange-500/20 text-orange-400';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'low':
    default:
      return 'bg-blue-500/20 text-blue-400';
  }
};

// Admin notification service mock
export const adminNotificationService = {
  initialize: () => {
    console.log('Admin notification service initialized');
  },
  
  cleanup: () => {
    console.log('Admin notification service cleaned up');
  },
  
  on: (event: string, callback: any) => {
    console.log(`Registered listener for ${event}`);
    // In a real implementation, this would register event listeners
  },
  
  off: (event: string, callback: any) => {
    console.log(`Removed listener for ${event}`);
    // In a real implementation, this would remove event listeners
  },
  
  getUnreadNotifications: async (): Promise<AdminNotification[]> => {
    // This is a mock implementation
    return [];
  },
  
  markAsRead: async (id: string): Promise<boolean> => {
    console.log(`Marking notification ${id} as read`);
    return true;
  },
  
  approveClient: async (notificationId: string, clientId: string): Promise<boolean> => {
    console.log(`Approving client ${clientId} from notification ${notificationId}`);
    return true;
  },
  
  rejectClient: async (notificationId: string, clientId: string, reason: string): Promise<boolean> => {
    console.log(`Rejecting client ${clientId} from notification ${notificationId} with reason: ${reason}`);
    return true;
  },
  
  executeAction: async (notificationId: string, actionType: string, actionData: any): Promise<string> => {
    console.log(`Executing action ${actionType} for notification ${notificationId} with data:`, actionData);
    return 'action-id-123';
  }
};