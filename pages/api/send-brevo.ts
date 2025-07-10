import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { firstName, email, phone } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
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
  console.log('Newsletter API called with:', { firstName, email, phone: phone || 'not provided' });

  try {
    // Adicionar contato à lista #2 do Brevo (lista de newsletter)
    const contactData = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        SMS: phone || ''
      },
      listIds: [2], // ID da lista de newsletter
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
      let errorMessage = 'Failed to subscribe to newsletter';
      let errorDetails = '';
      
      try {
        // Tenta analisar a resposta como JSON
        const errorData = await response.json();
        console.error('Brevo API error response:', errorData);
        
        if (errorData && errorData.message) {
          errorDetails = errorData.message;
          
          // Verificar se é um erro de duplicação (email já existe)
          if (errorDetails.includes('already exists')) {
            return res.status(200).json({
              success: true,
              message: 'You are already subscribed to our newsletter'
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
      }
      
      console.error('Failed to add contact to Brevo newsletter list:', errorDetails);
      return res.status(500).json({ 
        success: false, 
        error: errorMessage + (errorDetails ? ': ' + errorDetails : '')
      });
    }

    // Opcional: Enviar email de confirmação
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'Devtone Agency',
            email: 'team@devtone.agency'
          },
          to: [
            {
              email,
              name: firstName
            }
          ],
          subject: 'Welcome to Devtone Newsletter!',
          htmlContent: `
            <html>
              <body>
                <h1>Welcome to our Newsletter, ${firstName}!</h1>
                <p>Thank you for subscribing to the Devtone Agency newsletter.</p>
                <p>You'll now receive our latest web development tips, industry insights, and exclusive offers.</p>
                ${phone ? `<p>We've also registered your phone number: ${phone} for important updates.</p>` : ''}
                <p>Best regards,<br>The Devtone Team</p>
              </body>
            </html>
          `
        })
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with success response even if confirmation email fails
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter' 
    });
  } catch (error) {
    // Captura detalhes do erro para melhor diagnóstico
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Newsletter subscription error:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Newsletter subscription unknown error:', error);
    }
    
    return res.status(500).json({ 
      success: false, 
      error: errorMessage
    });
  }
}