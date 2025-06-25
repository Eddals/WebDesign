import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    name, 
    email, 
    phone, 
    company, 
    country, 
    industry,
    projectType,
    budget,
    timeline,
    features,
    retainer,
    description 
  } = req.body;

  try {
    // 1. Send email to DevTone team (admin notification)
    await resend.emails.send({
      from: 'DevTone <onboarding@resend.dev>', // Using test domain until devtone.com is verified
      to: ['sweepeasellc@gmail.com'], // Admin email
      subject: `🚀 New Estimate Request from ${name} - ${projectType}`,
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
                <td>${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Email:</strong></td>
                <td><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Phone:</strong></td>
                <td>${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Company:</strong></td>
                <td>${company}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Country:</strong></td>
                <td>${country}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Industry:</strong></td>
                <td>${industry}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Details</h2>
            <table style="width: 100%; margin-bottom: 30px;">
              <tr>
                <td style="padding: 8px 0;"><strong>Project Type:</strong></td>
                <td>${projectType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Budget:</strong></td>
                <td>${budget}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Timeline:</strong></td>
                <td>${timeline}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Monthly Retainer:</strong></td>
                <td>${retainer === 'none' ? 'No retainer' : retainer}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; vertical-align: top;"><strong>Features:</strong></td>
                <td>${features || 'None selected'}</td>
              </tr>
            </table>

            <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Project Description</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0; white-space: pre-wrap;">${description || 'No description provided'}</p>
            </div>

            <div style="background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0;">Submitted on: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    });

    // 2. Send confirmation email to client (IMPORTANT: This confirms their quote request)
    await resend.emails.send({
      from: 'DevTone Team <onboarding@resend.dev>', // Using test domain until devtone.com is verified
      to: [email], // Client's email - they will receive confirmation
      subject: `Thank you for your estimate request, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Choosing DevTone!</h1>
          </div>
          
          <div style="padding: 40px; background: #f7f7f7;">
            <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}, 👋</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              We're thrilled that you're considering DevTone for your project! Our team has received your estimate request 
              and we're already excited about the possibility of working together.
            </p>

            <div style="background: white; padding: 25px; border-radius: 10px; margin: 30px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <h3 style="color: #667eea; margin-top: 0;">📋 Your Request Summary:</h3>
              
              <h4 style="color: #333; margin-bottom: 10px;">Contact Information</h4>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Company:</strong> ${company}</li>
                <li><strong>Country:</strong> ${country}</li>
                <li><strong>Industry:</strong> ${industry}</li>
              </ul>

              <h4 style="color: #333; margin-bottom: 10px;">Project Details</h4>
              <ul style="color: #555; line-height: 1.8;">
                <li><strong>Project Type:</strong> ${projectType}</li>
                <li><strong>Budget Range:</strong> ${budget}</li>
                <li><strong>Timeline:</strong> ${timeline}</li>
                <li><strong>Monthly Retainer:</strong> ${retainer === 'none' ? 'No retainer' : retainer}</li>
                <li><strong>Features Requested:</strong> ${features || 'None selected'}</li>
              </ul>

              <h4 style="color: #333; margin-bottom: 10px;">Your Message</h4>
              <p style="color: #555; background: #f7f7f7; padding: 15px; border-radius: 5px; margin: 0;">
                ${description || 'No additional details provided'}
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
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}