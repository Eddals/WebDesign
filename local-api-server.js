// Servidor local para testar as APIs
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Handle OPTIONS requests for all routes
app.options('*', (req, res) => {
  res.status(200).end();
});

// Inicializar o Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

// Endpoint de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API local funcionando!', timestamp: new Date().toISOString() });
});

// HubSpot API endpoint
app.post('/api/hubspot', async (req, res) => {
  console.log('📊 Recebida requisição para HubSpot API:', req.body);
  
  const HUBSPOT_TOKEN = 'pat-na2-0e94e7a3-5904-4247-ba2c-68dcf7c50c08';
  const { name, email, phone, company, country, industry } = req.body;

  // Create a contact in HubSpot
  try {
    console.log('Sending data to HubSpot CRM API...');
    
    const hubspotRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUBSPOT_TOKEN}`
      },
      body: JSON.stringify({
        properties: {
          firstname: name?.split(' ')[0] || '',
          lastname: name?.split(' ').slice(1).join(' ') || '',
          email,
          phone: phone || '',
          company: company || '',
          country: country || '',
          industry: industry || '',
          source: 'website_form'
        }
      })
    });
    
    console.log('HubSpot API status:', hubspotRes.status);
    
    let data;
    try {
      data = await hubspotRes.json();
      console.log('HubSpot API response:', data);
    } catch (jsonError) {
      console.error('Error parsing HubSpot response:', jsonError);
      data = { error: 'Failed to parse response' };
    }
    
    if (!hubspotRes.ok) {
      return res.status(400).json({ 
        error: data.message || 'HubSpot error',
        details: data
      });
    }
    
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error sending to HubSpot:', err);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message 
    });
  }
});

// Brevo Estimate endpoint
app.post('/api/estimate-brevo', async (req, res) => {
  console.log('📊 Recebida requisição para Brevo Estimate:', req.body);
  
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.company || !data.industry || !data.projectType || !data.budget || !data.timeline) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Validation passed, sending email...');

    const BREVO_CONFIG = {
      API_KEY: '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',
      API_URL: 'https://api.brevo.com/v3/smtp/email',
      TEAM_EMAIL: 'team@devtone.agency'
    };

    // Send email to team using Brevo template ID #2
    const emailData = {
      sender: {
        name: 'DevTone Agency - Estimate Form',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: BREVO_CONFIG.TEAM_EMAIL,
          name: 'DevTone Team'
        }
      ],
      templateId: 2,
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone,
        COMPANY: data.company,
        INDUSTRY: data.industry,
        PROJECT_TYPE: data.projectType,
        BUDGET: data.budget,
        TIMELINE: data.timeline,
        RETAINER: data.retainer,
        FEATURES: data.features.join(', '),
        DESCRIPTION: data.description || 'No description provided',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Estimate Form'
      }
    };

    console.log('Sending email data:', emailData);

    // Send email via Brevo API
    const brevoResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify(emailData)
    });

    console.log('Brevo response status:', brevoResponse.status);

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error('Brevo API error:', errorData);
      throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorData}`);
    }

    console.log('Team email sent successfully');

    // Send confirmation email to the client using Brevo template
    const confirmationEmailData = {
      sender: {
        name: 'DevTone Agency - team@devtone.agency',
        email: 'team@devtone.agency'
      },
      to: [
        {
          email: data.email,
          name: data.name
        }
      ],
      templateId: 2, // Using template ID 2 for client confirmation
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone,
        COMPANY: data.company,
        INDUSTRY: data.industry,
        PROJECT_TYPE: data.projectType,
        BUDGET: data.budget,
        TIMELINE: data.timeline,
        RETAINER: data.retainer,
        FEATURES: data.features.join(', '),
        DESCRIPTION: data.description || 'No description provided',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Estimate Form - Client Confirmation'
      }
    };

    console.log('Sending confirmation email...');

    // Send confirmation email
    const confirmationResponse = await fetch(BREVO_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_CONFIG.API_KEY
      },
      body: JSON.stringify(confirmationEmailData)
    });

    console.log('Confirmation response status:', confirmationResponse.status);

    if (!confirmationResponse.ok) {
      const errorData = await confirmationResponse.text();
      console.error('Confirmation email failed:', errorData);
      // Don't fail the whole request if confirmation email fails
    } else {
      console.log('Confirmation email sent successfully');
    }

    console.log('Sending success response');
    return res.status(200).json({ 
      success: true, 
      message: 'Estimate request submitted successfully' 
    });

  } catch (error) {
    console.error('Estimate submission error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit estimate request' 
    });
  }
});

// Brevo Contact endpoint using template ID #2
app.post('/api/contact-brevo', async (req, res) => {
  console.log('📧 Recebida requisição para Brevo Contact:', req.body);
  
  try {
    const { name, email, phone, company, subject, message, preferredContact } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: name, email, subject, message' 
      });
    }

    console.log('Validation passed, processing contact...');

    const BREVO_API_KEY = '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';

    // Note: Contact creation requires additional API permissions
    // For now, we'll only send the email using template #2
    console.log('📧 Sending contact email only (contact creation requires additional API permissions)');

    // Send email using template #2
    const emailData = {
      to: [{
        email: email,
        name: name
      }],
      templateId: 2,
      params: {
        FIRSTNAME: name,
        EMAIL: email,
        PHONE: phone || 'Not provided',
        COMPANY: company || 'Not provided',
        SUBJECT: subject,
        MESSAGE: message,
        PREFERRED_CONTACT: preferredContact || 'email'
      }
    };

    console.log('📧 Sending email with template #2:', emailData);

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('❌ Error sending email:', emailResponse.status, errorData);
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Email sent successfully:', emailResult.messageId);

    return res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      emailId: emailResult.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Contact submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// HubSpot Estimate Webhook endpoint
app.post('/api/hubspot-estimate-webhook', async (req, res) => {
  console.log('📊 Recebida requisição para HubSpot Estimate Webhook:', req.body);
  
  try {
    const formData = req.body;
    
    // Format data for HubSpot - using the format from HubSpot's documentation
    const hubspotData = {
      // This is the format HubSpot expects for webhook triggers
      submittedAt: Date.now(),
      fields: [
        {
          name: "firstname",
          value: formData.full_name?.split(' ')[0] || ''
        },
        {
          name: "lastname",
          value: formData.full_name?.split(' ').slice(1).join(' ') || ''
        },
        {
          name: "email",
          value: formData.email
        },
        {
          name: "phone",
          value: formData.phone || ''
        },
        {
          name: "company",
          value: formData.property_type || ''
        },
        {
          name: "country",
          value: formData.location || ''
        },
        {
          name: "industry",
          value: formData.service_type || ''
        },
        {
          name: "budget",
          value: formData.estimated_budget || ''
        },
        {
          name: "timeline",
          value: formData.preferred_timeline || ''
        },
        {
          name: "message",
          value: formData.project_description || ''
        },
        {
          name: "property_size",
          value: formData.property_size || ''
        },
        {
          name: "source",
          value: "estimate_form"
        }
      ],
      context: {
        pageUri: "estimate-form",
        pageName: "Estimate Request Form"
      }
    };
    
    // HubSpot webhook URL - use the URL provided by HubSpot
    const hubspotWebhookUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi';
    
    console.log('Sending data to HubSpot webhook...');
    
    // Send data to HubSpot
    const response = await fetch(hubspotWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotData),
    });
    
    console.log('HubSpot webhook response status:', response.status);
    
    // Try to get response data
    let responseData;
    try {
      const text = await response.text();
      console.log('Response text:', text);
      responseData = text ? JSON.parse(text) : { message: 'Empty response' };
    } catch (error) {
      console.log('Error parsing response:', error.message);
      responseData = { message: 'No JSON response or invalid JSON' };
    }
    
    // Return response to client
    return res.status(response.ok ? 200 : 400).json({
      success: response.ok,
      status: response.status,
      data: responseData
    });
    
  } catch (error) {
    console.error('Error sending to HubSpot webhook:', error);
    return res.status(500).json({ 
      error: 'Failed to send data to HubSpot webhook',
      message: error.message 
    });
  }
});

// Webhook proxy endpoint
app.post('/api/webhook-proxy', async (req, res) => {
  console.log('📊 Recebida requisição para Webhook Proxy:', req.query);
  
  try {
    // Get the target from query params or use default
    const target = req.query.target || 'n8n';
    console.log(`Proxying webhook request to ${target}`);
    
    let targetUrl;
    let requestBody = req.body;
    
    // Determine the target URL based on the target parameter
    if (target === 'hubspot') {
      targetUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi';
      
      // Format data for HubSpot webhook
      requestBody = {
        submittedAt: Date.now(),
        fields: Object.entries(req.body).map(([name, value]) => ({
          name,
          value: value || ''
        })),
        context: {
          pageUri: "estimate-form",
          pageName: "Estimate Request Form"
        }
      };
    } else {
      // Default to N8N
      targetUrl = 'https://eae.app.n8n.cloud/webhook/a6db0e86-ac57-49bc-ac5b-aed7c1ddd0e3';
    }
    
    console.log(`Forwarding to: ${targetUrl}`);
    console.log('Request body:', JSON.stringify(requestBody));
    
    // Forward the request to the target URL
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Response status: ${response.status}`);
    
    // Try to get the response text
    let responseText;
    try {
      responseText = await response.text();
      console.log('Response text:', responseText);
    } catch (textError) {
      console.error('Error getting response text:', textError);
      responseText = 'Error getting response text';
    }
    
    // Return the response from the target
    return res.status(response.status).send(responseText || '');
  } catch (error) {
    console.error('Webhook proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to forward request',
      message: error.message
    });
  }
});

// Endpoint de email simples
app.post('/api/simple-email', async (req, res) => {
  try {
    console.log('📧 Recebida requisição de email:', req.body);
    
    // Extrair dados do corpo da requisição
    const { name, email, subject, message } = req.body;

    // Validar dados obrigatórios
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    console.log('📧 Enviando email simples...');
    console.log('📋 Dados:', { name, email, subject, message });

    // 1. Enviar email para o administrador
    const adminResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: process.env.ADMIN_EMAIL || 'sweepeasellc@gmail.com',
      reply_to: email,
      subject: `📬 Novo Contato: ${name} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Novo Contato Recebido</h1>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Assunto:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Enviado do formulário de contato em ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email para administrador enviado:', adminResult);
    
    // 2. Enviar email de confirmação para o cliente
    const clientResult = await resend.emails.send({
      from: 'DevTone Agency <team@devtone.agency>',
      to: email,
      subject: '✨ Recebemos sua mensagem - DevTone Agency',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a6cf7;">Obrigado por entrar em contato!</h1>
          <p>Olá ${name},</p>
          <p>Recebemos sua mensagem e retornaremos em breve, geralmente dentro de 24 horas.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Sua mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>Próximos passos:</p>
          <ol>
            <li>Nossa equipe analisará sua mensagem nas próximas 2-4 horas</li>
            <li>Você receberá uma resposta personalizada em até 24 horas</li>
            <li>Se necessário, agendaremos uma chamada para discutir seus requisitos em detalhes</li>
          </ol>
          <p>Atenciosamente,<br>Equipe DevTone</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            DevTone Agency<br>
            Email: team@devtone.agency<br>
            Website: <a href="https://devtone.agency">devtone.agency</a>
          </p>
        </div>
      `,
    });
    
    console.log('✅ Email para cliente enviado:', clientResult);

    return res.status(200).json({ 
      success: true, 
      message: 'Emails sent successfully',
      emailSent: true,
      details: {
        adminEmailId: adminResult.data?.id,
        clientEmailId: clientResult.data?.id
      }
    });
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Newsletter signup endpoint using Brevo API
app.post('/api/newsletter-signup', async (req, res) => {
  console.log('📧 Recebida requisição para Newsletter Signup:', req.body);
  
  try {
    const { email, attributes } = req.body;
    
    // Validate required fields
    if (!email || !attributes || !attributes.FIRSTNAME) {
      console.log('Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email and firstName'
      });
    }

    console.log('Validation passed, processing newsletter signup...');

    const BREVO_API_KEY = process.env.BREVO_API_KEY || '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';

    // Prepare contact data for Brevo
    const contactData = {
      email: email,
      attributes: {
        FIRSTNAME: attributes.FIRSTNAME
      },
      listIds: [3],
      updateEnabled: true
    };

    console.log('📧 Creating/updating newsletter contact in Brevo:', contactData);

    // Create or update contact in Brevo
    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(contactData)
    });

    if (!contactResponse.ok) {
      const errorData = await contactResponse.text();
      console.error('❌ Error creating newsletter contact:', contactResponse.status, errorData);
      throw new Error(`Failed to create contact: ${contactResponse.status} ${errorData}`);
    }

    const contactResult = await contactResponse.json();
    console.log('✅ Newsletter contact created/updated successfully:', contactResult.id);

    try {
      const addToListResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/3/contacts/add`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          emails: [email]
        })
      });

      if (addToListResponse.ok) {
        console.log('✅ Newsletter contact added to list #3 successfully');
      } else {
        console.warn('⚠️ Could not add newsletter contact to list #3:', addToListResponse.status);
      }
    } catch (listError) {
      console.warn('⚠️ Error adding newsletter contact to list:', listError);
    }

    const emailData = {
      to: [{
        email: email,
        name: attributes.FIRSTNAME
      }],
      templateId: 7,
      params: {
        FIRSTNAME: attributes.FIRSTNAME,
        EMAIL: email
      }
    };

    console.log('📧 Sending newsletter welcome email with template #7:', emailData);

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('❌ Error sending newsletter email:', emailResponse.status, errorData);
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Newsletter email sent successfully:', emailResult.messageId);

    return res.status(200).json({
      success: true,
      message: 'Newsletter signup successful',
      contactId: contactResult.id,
      emailId: emailResult.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Newsletter API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor local rodando em http://localhost:${port}`);
  console.log(`📧 Resend API Key: ${process.env.RESEND_API_KEY ? 'Configurada' : 'Não configurada'}`);
  console.log(`📮 Admin Email: ${process.env.ADMIN_EMAIL || 'sweepeasellc@gmail.com'}`);
  console.log(`🔌 API Endpoints disponíveis:`);
  console.log(`   - GET  /api/test`);
  console.log(`   - POST /api/simple-email`);
  console.log(`   - POST /api/hubspot`);
  console.log(`   - POST /api/hubspot-estimate-webhook`);
  console.log(`   - POST /api/webhook-proxy?target=hubspot`);
  console.log(`   - POST /api/newsletter-signup`);
});
