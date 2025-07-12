import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { record } = await req.json()
    
    if (!record) {
      throw new Error('No record provided')
    }

    // Extract data from the estimate record
    const {
      name,
      email,
      company,
      industry,
      project_type,
      budget,
      timeline,
      description,
      features,
      retainer
    } = record

    // Prepare data for Brevo
    const brevoData = {
      email: email,
      attributes: {
        FIRSTNAME: name.split(' ')[0] || name,
        LASTNAME: name.split(' ').slice(1).join(' ') || '',
        COMPANY: company || '',
        INDUSTRY: industry || '',
        PROJECT_TYPE: project_type || '',
        BUDGET: budget || '',
        TIMELINE: timeline || '',
        DESCRIPTION: description || '',
        FEATURES: Array.isArray(features) ? features.join(', ') : features || '',
        RETAINER: retainer || 'none',
        SOURCE: 'Estimate Form',
        ESTIMATE_DATE: new Date().toISOString()
      },
      listIds: [2], // ID da lista no Brevo (ajuste conforme necessário)
      updateEnabled: true
    }

    // Send to Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': Deno.env.get('BREVO_API_KEY') || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(brevoData)
    })

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text()
      console.error('Brevo API Error:', errorText)
      throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorText}`)
    }

    const brevoResult = await brevoResponse.json()

    // Send email notification to admin (optional)
    try {
      await sendAdminNotification(record)
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError)
      // Don't fail the main function if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Estimate sent to Brevo successfully',
        brevoResult: brevoResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-estimate-to-brevo:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

// Function to send admin notification
async function sendAdminNotification(estimateData: any) {
  const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@devtone.agency'
  
  const emailData = {
    sender: {
      name: 'DevTone Estimate System',
      email: 'noreply@devtone.agency'
    },
    to: [
      {
        email: adminEmail,
        name: 'DevTone Admin'
      }
    ],
    subject: `Nova solicitação de orçamento - ${estimateData.name}`,
    htmlContent: `
      <h2>Nova solicitação de orçamento recebida!</h2>
      
      <h3>Informações do Cliente:</h3>
      <p><strong>Nome:</strong> ${estimateData.name}</p>
      <p><strong>Email:</strong> ${estimateData.email}</p>
      <p><strong>Empresa:</strong> ${estimateData.company || 'Não informado'}</p>
      <p><strong>Setor:</strong> ${estimateData.industry || 'Não informado'}</p>
      
      <h3>Detalhes do Projeto:</h3>
      <p><strong>Tipo:</strong> ${estimateData.project_type}</p>
      <p><strong>Orçamento:</strong> ${estimateData.budget}</p>
      <p><strong>Prazo:</strong> ${estimateData.timeline}</p>
      <p><strong>Retainer:</strong> ${estimateData.retainer}</p>
      
      <h3>Features Selecionadas:</h3>
      <ul>
        ${Array.isArray(estimateData.features) ? estimateData.features.map(f => `<li>${f}</li>`).join('') : '<li>Nenhuma feature selecionada</li>'}
      </ul>
      
      <h3>Descrição:</h3>
      <p>${estimateData.description || 'Nenhuma descrição fornecida'}</p>
      
      <hr>
      <p><small>Enviado em: ${new Date().toLocaleString('pt-BR')}</small></p>
    `
  }

  const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': Deno.env.get('BREVO_API_KEY') || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })

  if (!emailResponse.ok) {
    throw new Error(`Email API error: ${emailResponse.status}`)
  }

  return emailResponse.json()
} 