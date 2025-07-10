import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Permitir apenas solicitações POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Obter dados do formulário
  const { firstName, email, phone } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: firstName or email' 
    });
  }

  try {
    // API key do Brevo
    const brevoApiKey = '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';
    
    // Construir o payload para o Brevo
    const payload = {
      email,
      attributes: {
        FIRSTNAME: firstName
      },
      listIds: [2],
      updateEnabled: true
    };

    // Adicionar telefone se fornecido
    if (phone) {
      payload.attributes.SMS = phone;
    }

    console.log('Enviando para Brevo:', JSON.stringify(payload, null, 2));

    // Fazer a solicitação para o Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(payload)
    });

    // Obter o corpo da resposta como texto
    const responseText = await response.text();
    console.log('Brevo API response status:', response.status);
    console.log('Brevo API response text:', responseText);

    // Tentar analisar como JSON
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error('Error parsing Brevo API response:', e);
      responseData = { text: responseText };
    }

    // Verificar se a resposta é ok
    if (response.ok) {
      // Enviar email de confirmação
      try {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey
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
        // Continue with success even if email fails
      }

      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed to newsletter'
      });
    } else {
      // Tentar obter detalhes do erro
      let errorMessage = 'Failed to subscribe to newsletter';
      
      if (responseData && responseData.message) {
        // Verificar se é um erro de duplicação (email já existe)
        if (responseData.message.includes('already exists')) {
          return res.status(200).json({
            success: true,
            message: 'You are already subscribed to our newsletter'
          });
        }
        
        errorMessage = responseData.message;
      }
      
      console.error('Failed to add contact to Brevo newsletter list:', errorMessage);
      return res.status(response.status).json({ 
        success: false, 
        error: errorMessage
      });
    }
  } catch (error) {
    console.error('Newsletter submission error:', error);
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    });
  }
}