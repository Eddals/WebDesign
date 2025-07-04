import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

function getEstimateEmailText(formData) {
  const firstName = formData.name.split(' ')[0] || formData.name;
  const featuresText = Array.isArray(formData.features) && formData.features.length > 0
    ? `• Features: ${formData.features.join(', ')}`
    : '';
  return `Subject: We’ve received your quote request\n\nHi ${firstName},\n\nThank you for requesting a quote with Devtone — we’re excited to learn more about your project and explore how we can bring it to life.\n\nHere’s a quick summary of what you submitted:\n\n* * *\n\n📌 Project Summary:\n• Project Type: ${formData.projectType}\n• Goal: ${formData.description || 'Not specified'}\n• Timeline: ${formData.timeline}\n• Estimated Budget: ${formData.budget}\n${featuresText ? featuresText + '\n' : ''}\n* * *\n\nOur team is reviewing your request and will reach out shortly with a personalized proposal. We usually respond within 2 business hours.\n\nIn the meantime, feel free to explore our website to learn more about our services and past projects: devtone.agency\n\nIf you’d like to share more details or make changes, just reply to this email.\n\nLooking forward to connecting with you.\n\nWarm regards,\nMatheus Silva\nFounder & Owner – Devtone Agency`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Signature');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check signing secret
  const signature = req.headers['x-signature'];
  if (signature !== 'whsec_ZmHJmv6XL380DfV3kVvdTH2Tk/x44f5n') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const formData = req.body;
    if (!formData.name || !formData.email || !formData.projectType || !formData.budget || !formData.timeline) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Send summary email to client
    await resend.emails.send({
      from: 'Devtone Agency <matheus.silva@devtone.agency>',
      to: formData.email,
      subject: 'We’ve received your quote request',
      text: getEstimateEmailText(formData),
      reply_to: 'matheus.silva@devtone.agency'
    });
    return res.status(200).json({ success: true, message: 'Estimate summary email sent.' });
  } catch (error) {
    console.error('Error sending estimate summary email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
