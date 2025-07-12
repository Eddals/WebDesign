// /api/contact-brevo.js
export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    'https://devtone.agency',
    'https://www.devtone.agency',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { name, email, phone, company, subject, message, preferredContact } = req.body;

  // Validação básica
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, subject, message'
    });
  }

  // Usar a chave da API do ambiente ou a chave hardcoded como fallback
  const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';

  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not defined in environment variables');
    return res.status(500).json({ 
      success: false, 
      error: 'Server configuration error' 
    });
  }
  
  // Log para debug
  console.log('Contact Form API called with:', { name, email, subject, message });

  try {
    // 1. Adicionar contato à lista #8 do Brevo (lista de contatos)
    const contactData = {
      email,
      attributes: {
        FIRSTNAME: name,
        PHONE: phone || '',
        COMPANY: company || '',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      },
      listIds: [8], // ID da lista de contatos
      updateEnabled: true
    };

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      let errorMessage = 'Failed to submit contact form';
      let errorDetails = '';
      
      try {
        // Tenta analisar a resposta como JSON
        const errorData = await response.json();
        console.error('Brevo API error response:', errorData);
        
        if (errorData && errorData.message) {
          errorDetails = errorData.message;
          
          // Verificar se é um erro de duplicação (email já existe)
          if (errorDetails.includes('already exists')) {
            // Continuar mesmo se o contato já existir
            console.log('Contact already exists, continuing with email notification');
          } else {
            return res.status(500).json({ 
              success: false, 
              error: errorMessage + (errorDetails ? ': ' + errorDetails : '')
            });
          }
        }
      } catch (e) {
        // Se não for JSON, tenta obter o texto
        try {
          errorDetails = await response.text();
        } catch (textError) {
          errorDetails = 'Could not read error details';
        }
        
        console.error('Failed to add contact to Brevo list:', errorDetails);
        return res.status(500).json({ 
          success: false, 
          error: errorMessage + (errorDetails ? ': ' + errorDetails : '')
        });
      }
    }

    // 2. Enviar email de notificação para a equipe usando template #13
    try {
      const teamNotificationData = {
        to: [
          {
            email: 'team@devtone.agency',
            name: 'DevTone Team'
          }
        ],
        templateId: 13,
        params: {
          FIRSTNAME: name,
          EMAIL: email,
          PHONE: phone || 'Not provided',
          COMPANY: company || 'Not provided',
          SUBJECT: subject,
          MESSAGE: message,
          PREFERRED_CONTACT: preferredContact || 'Email',
          SUBMISSION_DATE: new Date().toISOString()
        }
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamNotificationData)
      });
    } catch (emailError) {
      console.error('Error sending team notification email:', emailError);
      // Continue with success response even if team notification email fails
    }

    // 3. Enviar email de confirmação para o usuário
    try {
      const userConfirmationData = {
        to: [
          {
            email: email,
            name: name
          }
        ],
        templateId: 13,
        params: {
          FIRSTNAME: name,
          EMAIL: email,
          PHONE: phone || 'Not provided',
          COMPANY: company || 'Not provided',
          SUBJECT: 'Thank you for contacting DevTone Agency',
          MESSAGE: `Thank you for contacting DevTone Agency regarding "${subject}". We have received your message and will get back to you as soon as possible.`,
          PREFERRED_CONTACT: preferredContact || 'Email',
          SUBMISSION_DATE: new Date().toISOString()
        }
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userConfirmationData)
      });
    } catch (emailError) {
      console.error('Error sending user confirmation email:', emailError);
      // Continue with success response even if confirmation email fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });
  } catch (error) {
    // Captura detalhes do erro para melhor diagnóstico
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Contact form submission error:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Contact form submission unknown error:', error);
    }
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
} 