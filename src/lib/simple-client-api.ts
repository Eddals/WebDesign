// Simple Client Registration API - DevTone Agency
// API simples para registro de clientes sem Supabase Auth

import { supabase } from './supabase';

export interface SimpleRegisterForm {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  website_url?: string;
  country?: string;
  business_description?: string;
}

export interface SimpleLoginForm {
  email: string;
  password: string;
}

export interface ClientRegistration {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  phone?: string;
  industry?: string;
  website_url?: string;
  country?: string;
  business_description?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Simple hash function for passwords (for demo purposes)
// In production, use proper bcrypt or similar
function simpleHash(password: string): string {
  // This is just for demo - use proper hashing in production
  return btoa(password + 'devtone_salt_2024');
}

// Simple password verification
function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

class SimpleClientService {
  // Register new client
  async register(userData: SimpleRegisterForm): Promise<ApiResponse<ClientRegistration>> {
    try {
      console.log('🔄 Registrando cliente:', userData.email);

      // Hash the password
      const passwordHash = simpleHash(userData.password);

      // Insert into client_registrations table
      const { data, error } = await supabase
        .from('client_registrations')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          full_name: userData.full_name,
          company_name: userData.company_name,
          phone: userData.phone,
          industry: userData.industry,
          website_url: userData.website_url,
          country: userData.country,
          business_description: userData.business_description,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao registrar cliente:', error);
        
        if (error.code === '23505') {
          return {
            data: null,
            error: 'Este email já está registrado',
            success: false
          };
        }
        
        return {
          data: null,
          error: `Erro no registro: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Cliente registrado com sucesso:', data);
      
      return {
        data: data as ClientRegistration,
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Erro inesperado no registro:', error);
      return {
        data: null,
        error: 'Erro inesperado no registro',
        success: false
      };
    }
  }

  // Login client
  async login(credentials: SimpleLoginForm): Promise<ApiResponse<ClientRegistration>> {
    try {
      console.log('🔄 Fazendo login:', credentials.email);

      // Get client by email
      const { data, error } = await supabase
        .from('client_registrations')
        .select('*')
        .eq('email', credentials.email)
        .single();

      if (error || !data) {
        console.error('❌ Cliente não encontrado:', error);
        return {
          data: null,
          error: 'Email ou senha incorretos',
          success: false
        };
      }

      // Verify password
      if (!verifyPassword(credentials.password, data.password_hash)) {
        console.error('❌ Senha incorreta');
        return {
          data: null,
          error: 'Email ou senha incorretos',
          success: false
        };
      }

      // Check if client is approved
      if (data.status === 'pending') {
        return {
          data: null,
          error: 'Sua conta ainda está pendente de aprovação. Aguarde o contato da nossa equipe.',
          success: false
        };
      }

      if (data.status === 'rejected') {
        return {
          data: null,
          error: 'Sua conta foi rejeitada. Entre em contato conosco para mais informações.',
          success: false
        };
      }

      console.log('✅ Login realizado com sucesso');
      
      return {
        data: data as ClientRegistration,
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Erro inesperado no login:', error);
      return {
        data: null,
        error: 'Erro inesperado no login',
        success: false
      };
    }
  }

  // Get client by ID
  async getClient(clientId: string): Promise<ApiResponse<ClientRegistration>> {
    try {
      const { data, error } = await supabase
        .from('client_registrations')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error || !data) {
        return {
          data: null,
          error: 'Cliente não encontrado',
          success: false
        };
      }

      return {
        data: data as ClientRegistration,
        error: null,
        success: true
      };

    } catch (error: any) {
      return {
        data: null,
        error: 'Erro ao buscar cliente',
        success: false
      };
    }
  }

  // Get all clients (for admin)
  async getAllClients(): Promise<ApiResponse<ClientRegistration[]>> {
    try {
      const { data, error } = await supabase
        .from('client_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: null,
          error: `Erro ao buscar clientes: ${error.message}`,
          success: false
        };
      }

      return {
        data: (data || []) as ClientRegistration[],
        error: null,
        success: true
      };

    } catch (error: any) {
      return {
        data: null,
        error: 'Erro inesperado ao buscar clientes',
        success: false
      };
    }
  }

  // Get pending clients (for admin)
  async getPendingClients(): Promise<ApiResponse<ClientRegistration[]>> {
    try {
      const { data, error } = await supabase
        .from('client_registrations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: null,
          error: `Erro ao buscar clientes pendentes: ${error.message}`,
          success: false
        };
      }

      return {
        data: (data || []) as ClientRegistration[],
        error: null,
        success: true
      };

    } catch (error: any) {
      return {
        data: null,
        error: 'Erro inesperado ao buscar clientes pendentes',
        success: false
      };
    }
  }

  // Test connection
  async testConnection(): Promise<ApiResponse<any>> {
    try {
      console.log('🔄 Testando conexão com client_registrations...');

      const { data, error } = await supabase
        .from('client_registrations')
        .select('count(*)')
        .limit(1);

      if (error) {
        console.error('❌ Erro na conexão:', error);
        return {
          data: null,
          error: `Erro de conexão: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Conexão funcionando!');
      return {
        data: { message: 'Conexão funcionando perfeitamente!' },
        error: null,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Erro inesperado na conexão:', error);
      return {
        data: null,
        error: 'Erro inesperado na conexão',
        success: false
      };
    }
  }

  // Update client status (for admin)
  async updateClientStatus(clientId: string, status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<ClientRegistration>> {
    try {
      console.log('🔄 Updating client status:', clientId, status);

      const { data, error } = await supabase
        .from('client_registrations')
        .update({ status })
        .eq('id', clientId)
        .select('*')
        .single();

      if (error) {
        console.error('❌ Error updating client status:', error);
        return {
          data: null,
          error: `Erro ao atualizar status: ${error.message}`,
          success: false
        };
      }

      console.log('✅ Client status updated successfully:', data.id);

      return {
        data: data as ClientRegistration,
        error: null,
        success: true
      };
    } catch (error: any) {
      console.error('❌ Error in updateClientStatus:', error);
      return {
        data: null,
        error: `Erro inesperado: ${error.message}`,
        success: false
      };
    }
  }
}

// Export singleton instance
export const simpleClientService = new SimpleClientService();

// Export types and service
export default simpleClientService;
