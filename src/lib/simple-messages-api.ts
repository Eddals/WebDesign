// 🔧 SIMPLE MESSAGES API - Fixed Foreign Key Issues
// DevTone Agency - Client Dashboard Messages

import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================
export interface SimpleMessage {
  id: string;
  client_id: string;
  project_id?: string;
  parent_message_id?: string;
  message: string;
  sender_type: 'client' | 'admin';
  sender_name?: string;
  sender_email?: string;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageForm {
  client_id: string;
  project_id?: string;
  parent_message_id?: string;
  message: string;
  sender_type: 'client' | 'admin';
  sender_name?: string;
  sender_email?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: any;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ============================================================================
// SIMPLE MESSAGES SERVICE
// ============================================================================
class SimpleMessagesService {
  
  // Send a new message
  async sendMessage(messageData: CreateMessageForm): Promise<ApiResponse<SimpleMessage>> {
    try {
      console.log('🔄 Sending message:', messageData);

      // Try to insert into client_dashboard_messages first
      const { data: dashboardMessage, error: dashboardError } = await supabase
        .from('client_dashboard_messages')
        .insert({
          client_id: messageData.client_id,
          project_id: messageData.project_id || null,
          parent_message_id: messageData.parent_message_id || null,
          message: messageData.message,
          sender_type: messageData.sender_type,
          sender_name: messageData.sender_name || 'User',
          sender_email: messageData.sender_email || '',
          priority: messageData.priority || 'normal',
          attachments: messageData.attachments || null,
          is_read: false
        })
        .select('*')
        .single();

      if (!dashboardError && dashboardMessage) {
        console.log('✅ Message sent to client_dashboard_messages:', dashboardMessage.id);
        return {
          data: dashboardMessage as SimpleMessage,
          error: null,
          success: true
        };
      }

      // Fallback to original messages table
      console.log('⚠️ Fallback to messages table, dashboard error:', dashboardError);
      
      const { data: originalMessage, error: originalError } = await supabase
        .from('messages')
        .insert({
          client_id: messageData.client_id,
          message: messageData.message,
          sender_type: messageData.sender_type,
          sender_name: messageData.sender_name || 'User',
          is_read: false,
          priority: messageData.priority || 'normal'
        })
        .select('*')
        .single();

      if (originalError) {
        console.error('❌ Error sending message to both tables:', originalError);
        return {
          data: null,
          error: `Failed to send message: ${originalError.message}`,
          success: false
        };
      }

      console.log('✅ Message sent to messages table:', originalMessage.id);
      return {
        data: originalMessage as SimpleMessage,
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Unexpected error sending message:', error);
      return {
        data: null,
        error: 'Unexpected error occurred while sending message',
        success: false
      };
    }
  }

  // Get messages for a client
  async getMessages(clientId: string, projectId?: string): Promise<ApiResponse<SimpleMessage[]>> {
    try {
      console.log('🔄 Getting messages for client:', clientId);

      // Try client_dashboard_messages first
      let query = supabase
        .from('client_dashboard_messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data: dashboardMessages, error: dashboardError } = await query;

      if (!dashboardError && dashboardMessages && dashboardMessages.length > 0) {
        console.log('✅ Messages loaded from client_dashboard_messages:', dashboardMessages.length);
        return {
          data: dashboardMessages as SimpleMessage[],
          error: null,
          success: true
        };
      }

      // Fallback to original messages table
      console.log('⚠️ Fallback to messages table');
      
      const { data: originalMessages, error: originalError } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (originalError) {
        console.error('❌ Error loading messages:', originalError);
        return {
          data: null,
          error: `Failed to load messages: ${originalError.message}`,
          success: false
        };
      }

      console.log('✅ Messages loaded from messages table:', originalMessages?.length || 0);
      return {
        data: (originalMessages || []) as SimpleMessage[],
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Unexpected error loading messages:', error);
      return {
        data: null,
        error: 'Unexpected error occurred while loading messages',
        success: false
      };
    }
  }

  // Mark message as read
  async markAsRead(messageId: string): Promise<ApiResponse<null>> {
    try {
      console.log('🔄 Marking message as read:', messageId);

      // Try client_dashboard_messages first
      const { error: dashboardError } = await supabase
        .from('client_dashboard_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (!dashboardError) {
        console.log('✅ Message marked as read in client_dashboard_messages');
        return { data: null, error: null, success: true };
      }

      // Fallback to original messages table
      const { error: originalError } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (originalError) {
        console.error('❌ Error marking message as read:', originalError);
        return {
          data: null,
          error: `Failed to mark message as read: ${originalError.message}`,
          success: false
        };
      }

      console.log('✅ Message marked as read in messages table');
      return { data: null, error: null, success: true };

    } catch (error: any) {
      console.error('❌ Unexpected error marking message as read:', error);
      return {
        data: null,
        error: 'Unexpected error occurred',
        success: false
      };
    }
  }

  // Get unread messages count
  async getUnreadCount(clientId: string): Promise<ApiResponse<number>> {
    try {
      // Try client_dashboard_messages first
      const { data: dashboardMessages } = await supabase
        .from('client_dashboard_messages')
        .select('id')
        .eq('client_id', clientId)
        .eq('is_read', false)
        .eq('sender_type', 'admin');

      if (dashboardMessages && dashboardMessages.length > 0) {
        return {
          data: dashboardMessages.length,
          error: null,
          success: true
        };
      }

      // Fallback to original messages table
      const { data: originalMessages } = await supabase
        .from('messages')
        .select('id')
        .eq('client_id', clientId)
        .eq('is_read', false)
        .eq('sender_type', 'admin');

      return {
        data: originalMessages?.length || 0,
        error: null,
        success: true
      };

    } catch (error: any) {
      return {
        data: 0,
        error: null,
        success: true
      };
    }
  }

  // Subscribe to real-time message updates
  subscribeToMessages(clientId: string, callback: (message: any) => void) {
    console.log('🔄 Setting up real-time message subscription for client:', clientId);

    const channel = supabase
      .channel(`messages-${clientId}`)
      // Subscribe to client_dashboard_messages
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_dashboard_messages',
          filter: `client_id=eq.${clientId}`,
        },
        (payload: any) => {
          console.log('📨 Dashboard message update:', payload);
          callback({ type: 'dashboard_message', payload });
        }
      )
      // Subscribe to original messages table
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${clientId}`,
        },
        (payload: any) => {
          console.log('📨 Message update:', payload);
          callback({ type: 'message', payload });
        }
      )
      .subscribe((status: any) => {
        console.log('📡 Message subscription status:', status);
      });

    return channel;
  }

  // Unsubscribe from real-time updates
  unsubscribe(channel: any) {
    if (channel) {
      supabase.removeChannel(channel);
      console.log('🔌 Message subscription closed');
    }
  }
}

// Export singleton instance
export const simpleMessagesService = new SimpleMessagesService();

export default simpleMessagesService;
