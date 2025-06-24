// Vercel Serverless Function for Estimate API
import { sendEstimateEmail, sendClientConfirmationEmail } from '../server/email-service.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'projectType', 'budget', 'timeline'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Send to ActivePieces webhook
    try {
      const webhookPayload = {
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone || '',
        empresa: formData.company || '',
        pais: formData.country || '',
        industria: formData.industry || '',
        tipo_projeto: formData.projectType,
        orcamento: formData.budget,
        prazo: formData.timeline,
        mensagem: formData.description || '',
        recursos: formData.features?.join(', ') || '',
        timestamp: new Date().toISOString(),
        fonte: 'devtone-estimate-api'
      };

      await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + Buffer.from(process.env.ACTIVEPIECES_USERNAME + ':' + process.env.ACTIVEPIECES_PASSWORD).toString('base64')
        },
        body: JSON.stringify(webhookPayload),
      });
    } catch (webhookError) {
      console.error('ActivePieces webhook error:', webhookError);
    }

    // Send emails
    const adminEmailResult = await sendEstimateEmail(formData);
    const clientEmailResult = await sendClientConfirmationEmail(formData);

    return res.status(200).json({
      success: true,
      message: 'Estimate request submitted successfully',
      emailsSent: {
        admin: adminEmailResult.success,
        client: clientEmailResult.success
      }
    });

  } catch (error) {
    console.error('Error processing estimate:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process estimate request'
    });
  }
}