// Versão alternativa do servidor com email verificado
// Use esta versão se não conseguir configurar o domínio devtone.agency no Brevo

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

// Brevo Estimate endpoint - Versão com email verificado
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

    // IMPORTANTE: Substitua pelo seu email verificado no Brevo
    const VERIFIED_EMAIL = 'seu-email-verificado@exemplo.com'; // ⚠️ ALTERE AQUI

    // Send email to team using Brevo template ID #2
    const emailData = {
      sender: {
        name: 'DevTone Agency - Estimate Form', // Nome personalizado
        email: VERIFIED_EMAIL // Email verificado
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
        name: 'DevTone Agency - team@devtone.agency', // Nome personalizado
        email: VERIFIED_EMAIL // Email verificado
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

// Brevo Contact endpoint using template ID #5 - Backup version
app.post('/api/contact-brevo', async (req, res) => {
  console.log('📧 Recebida requisição para Brevo Contact:', req.body);
  
  try {
    const data = req.body;
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Validation passed, sending email...');

    const BREVO_CONFIG = {
      API_KEY: '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',
      API_URL: 'https://api.brevo.com/v3/smtp/email',
      TEAM_EMAIL: 'team@devtone.agency'
    };

    // IMPORTANTE: Substitua pelo seu email verificado no Brevo
    const VERIFIED_EMAIL = 'seu-email-verificado@exemplo.com'; // ⚠️ ALTERE AQUI

    // Send email to team using Brevo template ID #5
    const emailData = {
      sender: {
        name: 'DevTone Agency - Contact Form',
        email: VERIFIED_EMAIL
      },
      to: [
        {
          email: BREVO_CONFIG.TEAM_EMAIL,
          name: 'DevTone Team'
        }
      ],
      templateId: 5,
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone || 'Not provided',
        COMPANY: data.company || 'Not provided',
        SUBJECT: data.subject,
        MESSAGE: data.message,
        PREFERRED_CONTACT: data.preferredContact || 'email',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Contact Form'
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

    // Send confirmation email to the client using Brevo template ID #5
    const confirmationEmailData = {
      sender: {
        name: 'DevTone Agency - team@devtone.agency',
        email: VERIFIED_EMAIL
      },
      to: [
        {
          email: data.email,
          name: data.name
        }
      ],
      templateId: 5, // Using template ID 5 for client confirmation
      params: {
        NAME: data.name,
        EMAIL: data.email,
        PHONE: data.phone || 'Not provided',
        COMPANY: data.company || 'Not provided',
        SUBJECT: data.subject,
        MESSAGE: data.message,
        PREFERRED_CONTACT: data.preferredContact || 'email',
        SUBMISSION_DATE: new Date().toLocaleString(),
        SOURCE: 'Contact Form - Client Confirmation'
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
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit contact form' 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Servidor local rodando na porta ${port}`);
  console.log(`📧 Brevo Estimate API: http://localhost:${port}/api/estimate-brevo`);
  console.log(`📧 Brevo Contact API: http://localhost:${port}/api/contact-brevo`);
  console.log(`🔧 Test API: http://localhost:${port}/api/test`);
  console.log(`⚠️  IMPORTANTE: Altere VERIFIED_EMAIL no código para seu email verificado no Brevo`);
}); 