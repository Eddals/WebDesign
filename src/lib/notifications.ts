import { supabase } from './supabase';

export interface EstimateNotification {
  name: string;
  country: string;
  industry: string;
  timeAgo: string;
  id: string;
}

interface DatabaseEstimate {
  id: string;
  full_name: string;
  country: string | null;
  industry: string | null;
  created_at: string;
}

// Function to get recent estimates for notifications
export async function getRecentEstimates(): Promise<EstimateNotification[]> {
  try {
    console.log('🔍 Buscando estimates para notificações...');

    const { data, error } = await supabase
      .from('quotes')
      .select('id, full_name, country, industry, created_at')
      .not('country', 'is', null)
      .not('industry', 'is', null)
      .not('full_name', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Erro de banco de dados:', error.message);

      // Show example data for demonstration when database is not configured
      if (error.code === '42P01' || error.code === '42703') {
        console.log('💡 Banco não configurado. Mostrando dados de exemplo.');
        return getExampleNotifications();
      }

      console.log('📋 Usando dados de exemplo devido ao erro');
      return getExampleNotifications();
    }

    if (!data || data.length === 0) {
      console.log('📊 Nenhum estimate encontrado no banco');
      console.log('📋 Mostrando dados de exemplo para demonstração');
      return getExampleNotifications();
    }

    // Return real data from database
    const validEstimates = data.map((estimate: DatabaseEstimate) => ({
      id: estimate.id,
      name: estimate.full_name,
      country: estimate.country!,
      industry: estimate.industry!,
      timeAgo: getTimeAgo(estimate.created_at)
    }));

    console.log(`✅ ${validEstimates.length} estimates reais encontrados`);
    return validEstimates;

  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    console.log('📋 Usando dados de exemplo devido ao erro de conexão');
    return getExampleNotifications();
  }
}

// Function to calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return `${Math.floor(diffInDays / 7)} weeks ago`;
}

// Example notifications for demonstration
function getExampleNotifications(): EstimateNotification[] {
  const examples = [
    {
      id: 'demo-1',
      name: 'Sarah Johnson',
      country: 'United States',
      industry: 'Healthcare & Medical',
      timeAgo: '5 minutes ago'
    },
    {
      id: 'demo-2',
      name: 'Michael Chen',
      country: 'Canada',
      industry: 'Technology & Software',
      timeAgo: '12 minutes ago'
    },
    {
      id: 'demo-3',
      name: 'Emma Wilson',
      country: 'United Kingdom',
      industry: 'E-commerce & Retail',
      timeAgo: '23 minutes ago'
    },
    {
      id: 'demo-4',
      name: 'Carlos Rodriguez',
      country: 'Spain',
      industry: 'Food & Restaurant',
      timeAgo: '35 minutes ago'
    },
    {
      id: 'demo-5',
      name: 'Anna Müller',
      country: 'Germany',
      industry: 'Fashion & Beauty',
      timeAgo: '47 minutes ago'
    },
    {
      id: 'demo-6',
      name: 'João Silva',
      country: 'Brazil',
      industry: 'Technology & Software',
      timeAgo: '8 minutes ago'
    }
  ];

  console.log('📋 Gerando notificações de exemplo para demonstração');
  return examples;
}


