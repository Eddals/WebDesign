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
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Erro ao buscar estimates:', error);
      console.error('- Código:', error.code);
      console.error('- Mensagem:', error.message);

      if (error.code === '42P01') {
        console.log('💡 Tabela quotes não existe. Usando dados de exemplo');
      } else if (error.code === '42703') {
        console.log('💡 Coluna não existe. Usando dados de exemplo');
      }

      console.log('📋 Retornando notificações de exemplo para demonstração');
      return getExampleNotifications();
    }

    console.log(`📊 Encontrados ${data?.length || 0} estimates no banco`);

    if (!data || data.length === 0) {
      console.log('⚠️ Nenhum estimate encontrado no banco de dados');
      console.log('📋 Retornando notificações de exemplo para demonstração');
      return getExampleNotifications();
    }

    // Only return estimates that have both country and industry
    const validEstimates = data
      .filter((estimate: DatabaseEstimate) => estimate.country && estimate.industry)
      .map((estimate: DatabaseEstimate) => ({
        id: estimate.id,
        name: estimate.full_name,
        country: estimate.country!,
        industry: estimate.industry!,
        timeAgo: getTimeAgo(estimate.created_at)
      }));

    console.log(`✅ ${validEstimates.length} estimates válidos para notificações`);

    // If no valid estimates, return example data
    if (validEstimates.length === 0) {
      console.log('📋 Nenhum estimate válido encontrado. Usando dados de exemplo');
      return getExampleNotifications();
    }

    return validEstimates;
  } catch (error) {
    console.error('❌ Erro geral em getRecentEstimates:', error);
    console.log('📋 Retornando notificações de exemplo devido ao erro');
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

// Example notifications for demonstration (used when no real data exists)
function getExampleNotifications(): EstimateNotification[] {
  const examples = [
    {
      id: 'example-1',
      name: 'Sarah Johnson',
      country: 'United States',
      industry: 'Healthcare & Medical',
      timeAgo: '5 minutes ago'
    },
    {
      id: 'example-2',
      name: 'Michael Chen',
      country: 'Canada',
      industry: 'Technology & Software',
      timeAgo: '12 minutes ago'
    },
    {
      id: 'example-3',
      name: 'Emma Wilson',
      country: 'United Kingdom',
      industry: 'E-commerce & Retail',
      timeAgo: '23 minutes ago'
    },
    {
      id: 'example-4',
      name: 'Carlos Rodriguez',
      country: 'Spain',
      industry: 'Food & Restaurant',
      timeAgo: '35 minutes ago'
    },
    {
      id: 'example-5',
      name: 'Anna Müller',
      country: 'Germany',
      industry: 'Fashion & Beauty',
      timeAgo: '47 minutes ago'
    },
    {
      id: 'example-6',
      name: 'João Silva',
      country: 'Brazil',
      industry: 'Technology & Software',
      timeAgo: '8 minutes ago'
    },
    {
      id: 'example-7',
      name: 'Maria Santos',
      country: 'Brazil',
      industry: 'E-commerce & Retail',
      timeAgo: '15 minutes ago'
    },
    {
      id: 'example-8',
      name: 'David Kim',
      country: 'South Korea',
      industry: 'Gaming & Entertainment',
      timeAgo: '22 minutes ago'
    }
  ];

  console.log('📋 Gerando notificações de exemplo para demonstração');
  return examples;
}
