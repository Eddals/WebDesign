// Simple Vercel Function - No Email Service Required
// Uses webhook services that can send emails (like Make.com, Zapier, or ActivePieces)

export default async function handler(req, res) {
  // Enable CORS
  const allowedOrigins = [
    'https://devtone.agency',
    'https://www.devtone.agency',
    'http://localhost:5173',
    'http://localhost:5174'
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Send to ActivePieces webhook (which can trigger email notifications)
    const webhookResponse = await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Main form data
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
        recursos: Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || '',
        
        // Metadata
        timestamp: new Date().toISOString(),
        fonte: 'devtone-website',
        
        // Email template data (ActivePieces can use this)
        email_data: {
          to_admin: 'team@devtone.agency',
          to_client: formData.email,
          subject_admin: `New Estimate: ${formData.name} - ${formData.projectType}`,
          subject_client: 'We received your estimate request - DevTone',
          
          // Formatted data for email templates
          formatted_features: Array.isArray(formData.features) 
            ? formData.features.map(f => `• ${f}`).join('\n') 
            : 'None specified',
          
          formatted_date: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      }),
    });

    if (webhookResponse.ok) {
      return res.status(200).json({
        success: true,
        message: 'Your estimate request has been received. We will contact you within 24 hours.'
      });
    } else {
      console.error('Webhook failed:', webhookResponse.status);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit estimate. Please try again or contact us directly.'
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again later.'
    });
  }
}