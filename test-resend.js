// Quick test to verify Resend is working
// Run with: node test-resend.js

import { Resend } from 'resend';

const resend = new Resend('re_P4uBXUcH_7B4rc1geoyhz4H1P5njdJLst');

async function testEmail() {
  try {
    console.log('🚀 Sending test email to sweepeasellc@gmail.com...');
    
    const data = await resend.emails.send({
      from: 'DevTone <team@devtone.agency>', // Usar o email verificado
      to: ['team@devtone.agency'],
      subject: '🧪 Resend Test - DevTone Email System',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #667eea;">Resend is Working! 🎉</h1>
          <p>This is a test email from your DevTone email system.</p>
          <p>If you're seeing this, your Resend integration is set up correctly!</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666;">
            Next steps:<br>
            1. Add your domain (devtone.com) to Resend<br>
            2. Update the 'from' address in your API routes<br>
            3. Start sending beautiful emails!
          </p>
          <p style="margin-top: 30px; padding: 20px; background: #f0f0f0; border-radius: 8px;">
            <strong>Test Details:</strong><br>
            Sent at: ${new Date().toLocaleString()}<br>
            From: DevTone Test System<br>
            To: sweepeasellc@gmail.com
          </p>
        </div>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Resposta completa:', data);
    console.log('📬 Check sweepeasellc@gmail.com inbox!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail();