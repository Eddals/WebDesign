// Admin Notifications System - DevTone Agency
// Real-time notifications for administrative actions

import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface AdminNotification {
  id: string;
  type: 'new_client_registration' | 'new_project_request' | 'client_message' | 'payment_received' | 'project_update';
  title: string;
  message: string;
  client_registration_id?: string;
  data: Record<string, any>;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_required: boolean;
  action_type?: string;
  action_data: Record<string, any>;
  created_at: string;
  read_at?: string;
  expires_at?: string;
}

export interface AdminAction {
  id: string;
  notification_id: string;
  admin_user_id?: string;
  action_type: string;
  action_data: Record<string, any>;
  result: Record<string, any>;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface RealTimeCommunication {
  id: string;
  from_user_id: string;
  to_user_id: string;
  project_id?: string;
  message_type: 'project_update' | 'milestone_completed' | 'feedback_request' | 'general_message' | 'file_shared';
  subject?: string;
  message: string;
  attachments: any[];
  metadata: Record<string, any>;
  is_read: boolean;
  is_urgent: boolean;
  created_at: string;
  read_at?: string;
}

export interface ClientRegistrationData {
  user_email: string;
  user_name: string;
  company_name?: string;
  phone?: string;
  registration_time: string;
}

class AdminNotificationService {
  private channel: RealtimeChannel | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // Initialize real-time subscriptions
  async initialize() {
    try {
      // Subscribe to admin notifications
      this.channel = supabase
        .channel('admin-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'admin_notifications'
          },
          (payload: any) => {
            console.log('🔔 Nova notificação administrativa:', payload.new);
            this.emit('new_notification', payload.new as AdminNotification);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'admin_notifications'
          },
          (payload: any) => {
            console.log('📝 Notificação atualizada:', payload.new);
            this.emit('notification_updated', payload.new as AdminNotification);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'client_registrations'
          },
          (payload: any) => {
            console.log('👤 Novo cliente registrado:', payload.new);
            this.emit('new_client_registration', payload.new);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'client_communications'
          },
          (payload: any) => {
            console.log('💬 Nova comunicação:', payload.new);
            this.emit('new_communication', payload.new);
          }
        )
        .subscribe();

      console.log('✅ Sistema de notificações administrativas inicializado');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error);
      return false;
    }
  }

  // Cleanup subscriptions
  cleanup() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.listeners.clear();
  }

  // Event listener system
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Get all unread notifications
  async getUnreadNotifications(): Promise<AdminNotification[]> {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar notificações:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return [];
    }
  }

  // Get all notifications with pagination
  async getNotifications(page: number = 1, limit: number = 20): Promise<AdminNotification[]> {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('❌ Erro ao buscar notificações:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) {
        console.error('❌ Erro ao marcar como lida:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return false;
    }
  }

  // Execute admin action
  async executeAction(
    notificationId: string,
    actionType: string,
    actionData: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('execute_admin_action', {
        notification_id: notificationId,
        action_type: actionType,
        action_data: actionData
      });

      if (error) {
        console.error('❌ Erro ao executar ação:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return null;
    }
  }

  // Send real-time communication to client
  async sendCommunication(
    toUserId: string,
    messageType: RealTimeCommunication['message_type'],
    subject: string,
    message: string,
    projectId?: string,
    attachments: any[] = [],
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('real_time_communications')
        .insert({
          to_user_id: toUserId,
          project_id: projectId,
          message_type: messageType,
          subject,
          message,
          attachments,
          metadata,
          is_urgent: messageType === 'project_update' || messageType === 'milestone_completed'
        });

      if (error) {
        console.error('❌ Erro ao enviar comunicação:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return false;
    }
  }

  // Get client communications
  async getClientCommunications(clientId: string): Promise<RealTimeCommunication[]> {
    try {
      const { data, error } = await supabase
        .from('real_time_communications')
        .select('*')
        .eq('to_user_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar comunicações:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Erro de conexão:', error);
      return [];
    }
  }

  // Approve client registration
  async approveClient(notificationId: string, clientRegistrationId: string): Promise<boolean> {
    try {
      // Execute approval action using the SQL function
      const actionId = await this.executeAction(notificationId, 'approve_client', {
        client_registration_id: clientRegistrationId,
        approved: true,
        approval_time: new Date().toISOString()
      });

      if (!actionId) return false;

      console.log('✅ Cliente aprovado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao aprovar cliente:', error);
      return false;
    }
  }

  // Reject client registration
  async rejectClient(notificationId: string, clientRegistrationId: string, reason: string): Promise<boolean> {
    try {
      const actionId = await this.executeAction(notificationId, 'reject_client', {
        client_registration_id: clientRegistrationId,
        rejected: true,
        reason,
        rejection_time: new Date().toISOString()
      });

      if (!actionId) return false;

      console.log('✅ Cliente rejeitado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao rejeitar cliente:', error);
      return false;
    }
  }
}

// Export singleton instance
export const adminNotificationService = new AdminNotificationService();

// Export utility functions
export const showNotificationPopup = (notification: AdminNotification) => {
  // This will be used by the UI components to show popup notifications
  const event = new CustomEvent('admin-notification', {
    detail: notification
  });
  window.dispatchEvent(event);
};

export const formatNotificationTime = (timestamp: string): string => {
  const now = new Date();
  const notificationTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return notificationTime.toLocaleDateString('pt-BR');
};

export const getPriorityColor = (priority: AdminNotification['priority']): string => {
  switch (priority) {
    case 'urgent': return 'text-red-400 bg-red-500/20';
    case 'high': return 'text-orange-400 bg-orange-500/20';
    case 'medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'low': return 'text-green-400 bg-green-500/20';
    default: return 'text-purple-400 bg-purple-500/20';
  }
};

export const getNotificationIcon = (type: AdminNotification['type']): string => {
  switch (type) {
    case 'new_client_registration': return '👤';
    case 'new_project_request': return '📁';
    case 'client_message': return '💬';
    case 'payment_received': return '💰';
    case 'project_update': return '🔄';
    default: return '🔔';
  }
};
