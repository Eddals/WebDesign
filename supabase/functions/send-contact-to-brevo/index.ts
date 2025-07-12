import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    // Extract data from the contact record
    const {
      full_name,
      email,
      phone,
      company,
      subject,
      message,
      preferred_contact,
      is_urgent,
      priority,
      source
    } = record

    // Prepare data for Brevo
    const brevoData = {
      email: email,
      attributes: {
        FIRSTNAME: full_name.split(' ')[0] || full_name,
        LASTNAME: full_name.split(' ').slice(1).join(' ') || '',
        PHONE: phone || '',
        COMPANY: company || '',
        SUBJECT: subject || '',
        MESSAGE: message || '',
        PREFERRED_CONTACT: preferred_contact || 'email',
        IS_URGENT: is_urgent ? 'Yes' : 'No',
        PRIORITY: priority?.toString() || '1',
        SOURCE: source || 'Contact Form',
        CONTACT_DATE: new Date().toISOString()
      },
      listIds: [3], // ID da lista de contatos no Brevo (ajuste conforme necessário)
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

    // Send confirmation email to contact (optional)
    try {
      await sendConfirmationEmail(record)
    } catch (confirmationError) {
      console.error('Failed to send confirmation email:', confirmationError)
      // Don't fail the main function if confirmation fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Contact sent to Brevo successfully',
        brevoResult: brevoResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-contact-to-brevo:', error)
    
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
async function sendAdminNotification(contactData: any) {
  const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'admin@devtone.agency'
  
  const emailData = {
    sender: {
      name: 'DevTone Contact System',
      email: 'noreply@devtone.agency'
    },
    to: [
      {
        email: adminEmail,
        name: 'DevTone Admin'
      }
    ],
    subject: `Nova mensagem de contato - ${contactData.is_urgent ? 'URGENTE' : ''} ${contactData.subject}`,
    htmlContent: `
      <h2>Nova mensagem de contato recebida!</h2>
      
      ${contactData.is_urgent ? '<div style="background: #ff4444; color: white; padding: 10px; border-radius: 5px; margin: 10px 0;"><strong>⚠️ MENSAGEM URGENTE</strong></div>' : ''}
      
      <h3>Informações do Contato:</h3>
      <p><strong>Nome:</strong> ${contactData.full_name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Telefone:</strong> ${contactData.phone || 'Não informado'}</p>
      <p><strong>Empresa:</strong> ${contactData.company || 'Não informado'}</p>
      <p><strong>Forma preferida de contato:</strong> ${contactData.preferred_contact}</p>
      
      <h3>Detalhes da Mensagem:</h3>
      <p><strong>Assunto:</strong> ${contactData.subject}</p>
      <p><strong>Prioridade:</strong> ${contactData.priority}/5</p>
      
      <h3>Mensagem:</h3>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${contactData.message.replace(/\n/g, '<br>')}
      </div>
      
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

// Function to send confirmation email to contact
async function sendConfirmationEmail(contactData: any) {
  const emailData = {
    sender: {
      name: 'DevTone Agency',
      email: 'noreply@devtone.agency'
    },
    to: [
      {
        email: contactData.email,
        name: contactData.full_name
      }
    ],
    subject: 'Recebemos sua mensagem - DevTone Agency',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Obrigado por entrar em contato!</h2>
        
        <p>Olá ${contactData.full_name},</p>
        
        <p>Recebemos sua mensagem e agradecemos por entrar em contato com a DevTone Agency.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Resumo da sua mensagem:</h3>
          <p><strong>Assunto:</strong> ${contactData.subject}</p>
          <p><strong>Mensagem:</strong></p>
          <p style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6366f1;">
            ${contactData.message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <p><strong>O que acontece agora?</strong></p>
        <ul>
          <li>Nossa equipe irá analisar sua mensagem</li>
          <li>Entraremos em contato em até 24 horas</li>
          <li>Responderemos pelo método que você preferiu: <strong>${contactData.preferred_contact}</strong></li>
        </ul>
        
        <p>Se sua mensagem for urgente, você pode nos contatar diretamente:</p>
        <ul>
          <li>📧 Email: contact@devtone.agency</li>
          <li>📱 WhatsApp: +55 (11) 99999-9999</li>
        </ul>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        
        <p style="color: #6b7280; font-size: 14px;">
          Esta é uma confirmação automática. Por favor, não responda a este email.
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          DevTone Agency<br>
          Transformando ideias em realidade digital
        </p>
      </div>
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