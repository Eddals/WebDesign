// Test the complete estimate email flow
// This simulates a form submission and sends both admin and client emails

import { Resend } from 'resend';

const resend = new Resend('re_68sbnJcD_9agW1SfXoz3drqNNEdmEN2gd');

// Test data simulating a real form submission
const testFormData = {
  name: 'John Smith',
  email: 'sweepeasellc@gmail.com', // Using your email for testing both admin and client emails
  phone: '+1 (555) 123-4567',
  company: 'Test Company LLC',
  country: 'United States',
  industry: 'Technology',
  projectType: 'E-commerce Store',
  budget: '$2,000 - $5,000',
  timeline: '1 Month',
  features: 'Payment Processing, SEO Optimization, Analytics Dashboard',
  retainer: 'Basic Maintenance ($200/mo)',
  description: 'I need a modern e-commerce website for selling digital products. The site should have a clean design, be mobile-responsive, and integrate with Stripe for payments.'
};

async function sendTestEmails() {
  try {
    console.log('🚀 Sending estimate emails...\n');

    // 1. Admin notification email
    console.log('📧 Sending admin notification...');
    const adminEmail = await resend.emails.send({
      from: 'DevTone <onboarding@resend.dev>',
      to: ['sweepeasellc@gmail.com'],
      subject: `🚀 New Estimate Request from ${testFormData.name} - ${testFormData.projectType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Estimate Request</h1>
          </div>
          
          <div style="padding: 30px; background: #f7f7f7;">
            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Information</h2>
            <table style="width: 100%; margin-bottom: 30px;">
              <tr>
                <td style="padding: 8px 0;"><strong>Name:</strong></td>
                <td>${testFormData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td><a href="mailto:${testFormData.email}">${testFormData.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                <td>${testFormData.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Company:</strong></td>
                <td>${testFormData.company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Country:</strong></td>
                <td>${testFormData.country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Industry:</strong></td>
                <td>${testFormData.industry}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Details</h2>
            <table style="width: 100%; margin-bottom: 30px;">
              <tr>
                <td style="padding: 8px 0;"><strong>Project Type:</strong></td>
                <td>${testFormData.projectType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Budget:</strong></td>
                <td>${testFormData.budget}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Timeline:</strong></td>
                <td>${testFormData.timeline}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Monthly Retainer:</strong></td>
                <td>${testFormData.retainer}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;"><strong>Features:</strong></td>
                <td>${testFormData.features}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Description</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; white-space: pre-wrap;">${testFormData.description}</p>
            </div>

            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0;">Submitted on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `
    });
    console.log('✅ Admin email sent!');

    // 2. Client confirmation email
    console.log('\n📧 Sending client confirmation...');
    const clientEmail = await resend.emails.send({
      from: 'DevTone Team <onboarding@resend.dev>',
      to: [testFormData.email],
      subject: `Thank you for your estimate request, ${testFormData.name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Choosing DevTone!</h1>
          </div>
          
          <div style="padding: 40px; background: #f7f7f7;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${testFormData.name}, 👋</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              We're thrilled that you're considering DevTone for your project! Our team has received your estimate request 
              and we're already excited about the possibility of working together.
            </p>

            <div style="background: white; padding: 25px; border-radius: 10px; margin: 30px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">📋 Your Request Summary:</h3>
              
              <h4 style="color: #333; margin-bottom: 10px;">Contact Information</h4>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Name:</strong> ${testFormData.name}</li>
                <li><strong>Email:</strong> ${testFormData.email}</li>
                <li><strong>Phone:</strong> ${testFormData.phone}</li>
                <li><strong>Company:</strong> ${testFormData.company}</li>
                <li><strong>Country:</strong> ${testFormData.country}</li>
                <li><strong>Industry:</strong> ${testFormData.industry}</li>
              </ul>

              <h4 style="color: #333; margin-bottom: 10px;">Project Details</h4>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Project Type:</strong> ${testFormData.projectType}</li>
                <li><strong>Budget Range:</strong> ${testFormData.budget}</li>
                <li><strong>Timeline:</strong> ${testFormData.timeline}</li>
                <li><strong>Monthly Retainer:</strong> ${testFormData.retainer}</li>
                <li><strong>Features Requested:</strong> ${testFormData.features}</li>
              </ul>

              <h4 style="color: #333; margin-bottom: 10px;">Your Message</h4>
              <p style="color: #555; background: #f7f7f7; padding: 15px; border-radius: 5px; margin: 0;">
                ${testFormData.description}
              </p>
            </div>

            <div style="background: #667eea; color: white; padding: 25px; border-radius: 10px; margin: 30px 0;">
              <h3 style="margin-top: 0;">🚀 What Happens Next?</h3>
              <ol style="line-height: 1.8; padding-left: 20px;">
                <li><strong>Project Review (Within 2-4 hours):</strong><br>
                    Our expert team is analyzing your requirements to create the perfect solution.</li>
                <li><strong>Custom Proposal (Within 24 hours):</strong><br>
                    You'll receive a detailed proposal with pricing, timeline, and technical approach.</li>
                <li><strong>Consultation Call (Within 48 hours):</strong><br>
                    We'll schedule a call to discuss your project in detail and answer any questions.</li>
                <li><strong>Project Kickoff:</strong><br>
                    Once approved, your dedicated team begins work immediately!</li>
              </ol>
            </div>

            <div style="background: white; padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
              <h3 style="color: #333; margin-bottom: 20px;">Need to Reach Us Sooner?</h3>
              <p style="color: #555; margin-bottom: 20px;">We're always here to help!</p>
              
              <div style="margin-bottom: 15px;">
                <a href="tel:+19177413468" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 5px;">
                  📞 Call: +1 917-741-3468
                </a>
              </div>
              
              <div style="margin-bottom: 15px;">
                <a href="mailto:team@devtone.com" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 5px;">
                  ✉️ Email: team@devtone.com
                </a>
              </div>
              
              <div>
                <a href="https://wa.me/19177413468" style="display: inline-block; background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 5px;">
                  💬 WhatsApp Chat
                </a>
              </div>
            </div>

            <div style="text-align: center; color: #888; font-size: 14px; margin-top: 40px;">
              <p>Best regards,<br><strong>The DevTone Team</strong></p>
              <p style="margin-top: 20px;">
                © ${new Date().getFullYear()} DevTone. All rights reserved.<br>
                <a href="https://devtone.com" style="color: #667eea;">devtone.com</a>
              </p>
            </div>
          </div>
        </div>
      `
    });
    console.log('✅ Client confirmation email sent!');

    console.log('\n🎉 Both emails sent successfully!');
    console.log('📬 Check sweepeasellc@gmail.com for both emails:');
    console.log('   1. Admin notification (New Estimate Request)');
    console.log('   2. Client confirmation (Thank you for your estimate request)');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

sendTestEmails();