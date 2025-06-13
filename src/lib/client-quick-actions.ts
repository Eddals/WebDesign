// 🚀 CLIENT QUICK ACTIONS API
// DevTone Agency - Real-time Client Dashboard Quick Actions
// Send Feedback, Upload Files, Schedule Meeting

import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================
export interface SendFeedbackForm {
  project_id?: string;
  milestone_id?: string;
  subject: string;
  message: string;
  feedback_type: 'general' | 'bug_report' | 'feature_request' | 'design_feedback' | 'content_feedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UploadFileForm {
  project_id: string;
  milestone_id?: string;
  file: File;
  description?: string;
  category: 'general' | 'design' | 'content' | 'documentation' | 'assets' | 'deliverable';
}

export interface ScheduleMeetingForm {
  project_id?: string;
  title: string;
  description?: string;
  meeting_type: 'consultation' | 'review' | 'planning' | 'presentation' | 'training' | 'support';
  scheduled_date: string; // ISO string
  duration_minutes: number;
  client_notes?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// ============================================================================
// FEEDBACK SERVICE
// ============================================================================
export const feedbackService = {
  async sendFeedback(clientId: string, feedback: SendFeedbackForm): Promise<ApiResponse<any>> {
    try {
      console.log('🔄 Sending feedback:', feedback);
      console.log('🔄 Client ID:', clientId);

      const insertData = {
        client_id: clientId,
        project_id: feedback.project_id || null,
        milestone_id: feedback.milestone_id || null,
        subject: feedback.subject,
        message: feedback.message,
        feedback_type: feedback.feedback_type,
        priority: feedback.priority,
        status: 'pending'
      };

      console.log('🔄 Insert data:', insertData);

      const { data, error } = await supabase
        .from('client_feedbacks')
        .insert(insertData)
        .select('*')
        .single();

      if (error) {
        console.error('❌ Error sending feedback:', error);
        return {
          data: null,
          error: `Failed to send feedback: ${error.message || error.details || 'Database error'}`,
          success: false
        };
      }

      console.log('✅ Feedback sent successfully:', data.id);
      return {
        data: data,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Unexpected error sending feedback:', error);
      return {
        data: null,
        error: 'Unexpected error occurred while sending feedback',
        success: false
      };
    }
  },

  async getFeedbacks(clientId: string, projectId?: string): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('client_feedbacks')
        .select(`
          *,
          project:projects(id, title),
          milestone:project_milestones(id, title)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        error: 'Failed to load feedbacks',
        success: false
      };
    }
  }
};

// ============================================================================
// FILE UPLOAD SERVICE
// ============================================================================
export const fileUploadService = {
  async uploadFile(clientId: string, uploadData: UploadFileForm): Promise<ApiResponse<any>> {
    try {
      console.log('🔄 Uploading file:', uploadData.file.name);

      // Generate unique file name
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `client-files/${clientId}/${uploadData.project_id}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadResult, error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, uploadData.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Error uploading file:', uploadError);
        return {
          data: null,
          error: `Failed to upload file: ${uploadError.message}`,
          success: false
        };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Save file metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: uploadData.project_id,
          milestone_id: uploadData.milestone_id,
          uploaded_by_client: clientId,
          file_name: uploadData.file.name,
          file_type: uploadData.file.type,
          file_size: uploadData.file.size,
          file_url: publicUrl,
          description: uploadData.description,
          category: uploadData.category,
          is_public: true,
          version: 1
        })
        .select('*')
        .single();

      if (dbError) {
        console.error('❌ Error saving file metadata:', dbError);
        return {
          data: null,
          error: `Failed to save file metadata: ${dbError.message}`,
          success: false
        };
      }

      console.log('✅ File uploaded successfully:', fileRecord.id);
      return {
        data: fileRecord,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Unexpected error uploading file:', error);
      return {
        data: null,
        error: 'Unexpected error occurred while uploading file',
        success: false
      };
    }
  },

  async getFiles(clientId: string, projectId?: string): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('project_files')
        .select(`
          *,
          project:projects(id, title),
          milestone:project_milestones(id, title)
        `)
        .eq('uploaded_by_client', clientId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        error: 'Failed to load files',
        success: false
      };
    }
  }
};

// ============================================================================
// MEETING SCHEDULE SERVICE
// ============================================================================
export const meetingService = {
  async scheduleMeeting(clientId: string, meeting: ScheduleMeetingForm): Promise<ApiResponse<any>> {
    try {
      console.log('🔄 Scheduling meeting:', meeting);

      const { data, error } = await supabase
        .from('meeting_schedules')
        .insert({
          client_id: clientId,
          project_id: meeting.project_id,
          title: meeting.title,
          description: meeting.description,
          meeting_type: meeting.meeting_type,
          scheduled_date: meeting.scheduled_date,
          duration_minutes: meeting.duration_minutes,
          client_notes: meeting.client_notes,
          status: 'scheduled'
        })
        .select('*')
        .single();

      if (error) {
        console.error('❌ Error scheduling meeting:', error);
        return {
          data: null,
          error: `Failed to schedule meeting: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Meeting scheduled successfully:', data.id);
      return {
        data: data,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Unexpected error scheduling meeting:', error);
      return {
        data: null,
        error: 'Unexpected error occurred while scheduling meeting',
        success: false
      };
    }
  },

  async getMeetings(clientId: string, projectId?: string): Promise<ApiResponse<any[]>> {
    try {
      let query = supabase
        .from('meeting_schedules')
        .select(`
          *,
          project:projects(id, title)
        `)
        .eq('client_id', clientId)
        .order('scheduled_date', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: null,
          error: error.message,
          success: false
        };
      }

      return {
        data: data || [],
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        data: null,
        error: 'Failed to load meetings',
        success: false
      };
    }
  }
};

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================
export const realtimeService = {
  subscribeToClientUpdates(clientId: string, callback: (event: any) => void) {
    console.log('🔄 Setting up real-time subscriptions for client:', clientId);

    const channel = supabase
      .channel(`client-${clientId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: clientId }
        }
      })
      // Projects updates
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          console.log('📊 Project update:', payload);
          callback({ type: 'project', payload });
        }
      )
      // Feedbacks updates
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_feedbacks',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          console.log('💬 Feedback update:', payload);
          callback({ type: 'feedback', payload });
        }
      )
      // Files updates
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'project_files',
          filter: `uploaded_by_client=eq.${clientId}`,
        },
        (payload) => {
          console.log('📁 File update:', payload);
          callback({ type: 'file', payload });
        }
      )
      // Meetings updates
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meeting_schedules',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          console.log('📅 Meeting update:', payload);
          callback({ type: 'meeting', payload });
        }
      )
      // Activity logs
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs',
          filter: `client_id=eq.${clientId}`,
        },
        (payload) => {
          console.log('🔔 Activity update:', payload);
          callback({ type: 'activity', payload });
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    return channel;
  },

  unsubscribe(channel: any) {
    if (channel) {
      supabase.removeChannel(channel);
      console.log('🔌 Real-time subscription closed');
    }
  }
};

export default {
  feedbackService,
  fileUploadService,
  meetingService,
  realtimeService
};
