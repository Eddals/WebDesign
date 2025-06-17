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
      (payload) => {
        callback(payload.new as Notification);
      }
    )
    .subscribe();
  
  return channel;
};