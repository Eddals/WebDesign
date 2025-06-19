#!/usr/bin/env node

const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📧 Sending Professional Offer Letter to team@devtone.agency\n');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Professional offer letter content
const offerLetter = {
  from: `"DevTone Executive Team" <${process.env.SMTP_USER}>`,
  to: 'team@devtone.agency',
  subject: '🎉 Exclusive Partnership Opportunity - Fortune 500 Web Development Project',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background-color: #f9fafb;
        }
        
        .container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
        
        .header {
          background: linear-gradient(135deg, #6B46C1 0%, #4C1D95 100%);
          color: white;
          padding: 60px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        
        .tagline {
          font-size: 16px;
          opacity: 0.9;
          position: relative;
          z-index: 1;
        }
        
        .content {
          padding: 50px 40px;
        }
        
        .greeting {
          font-size: 24px;
          font-weight: 600;
          color: #4C1D95;
          margin-bottom: 20px;
        }
        
        .highlight-box {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          border-left: 4px solid #6B46C1;
          padding: 25px;
          margin: 30px 0;
          border-radius: 8px;
        }
        
        .project-details {
          background: #f9fafb;
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .detail-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #4C1D95;
          width: 140px;
          flex-shrink: 0;
        }
        
        .detail-value {
          color: #374151;
          flex: 1;
        }
        
        .benefits {
          margin: 30px 0;
        }
        
        .benefit-item {
          display: flex;
          align-items: start;
          margin-bottom: 15px;
        }
        
        .benefit-icon {
          width: 24px;
          height: 24px;
          background: #10B981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
          font-size: 14px;
        }
        
        .cta-section {
          background: linear-gradient(135deg, #6B46C1 0%, #4C1D95 100%);
          color: white;
          padding: 40px;
          text-align: center;
          margin: 40px -40px -50px -40px;
        }
        
        .cta-button {
          display: inline-block;
          background: white;
          color: #6B46C1;
          padding: 16px 40px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          margin-top: 20px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s;
        }
        
        .cta-button:hover {
          transform: translateY(-2px);
        }
        
        .footer {
          background: #1a1a1a;
          color: #9ca3af;
          padding: 30px 40px;
          text-align: center;
          font-size: 14px;
        }
        
        .signature {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e5e7eb;
        }
        
        .signature-name {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 5px;
        }
        
        .signature-title {
          color: #6b7280;
          font-size: 14px;
        }
        
        .confidential {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          padding: 15px;
          border-radius: 6px;
          margin: 30px 0;
          font-size: 13px;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">DevTone</div>
          <div class="tagline">Premium Web Development Solutions</div>
        </div>
        
        <div class="content">
          <div class="greeting">Dear DevTone Team,</div>
          
          <p>We are thrilled to present you with an exclusive opportunity to partner with <strong>TechCorp Industries</strong>, a Fortune 500 company, for their upcoming digital transformation initiative.</p>
          
          <div class="highlight-box">
            <h2 style="margin-top: 0; color: #4C1D95;">🎯 Project Overview</h2>
            <p style="margin-bottom: 0;">TechCorp Industries is seeking a premier development partner to completely reimagine their digital presence and create a cutting-edge web platform that will serve over 10 million users globally.</p>
          </div>
          
          <div class="project-details">
            <h3 style="margin-top: 0; margin-bottom: 25px; color: #1a1a1a;">Project Specifications</h3>
            
            <div class="detail-item">
              <div class="detail-label">Project Value:</div>
              <div class="detail-value"><strong>$250,000 - $350,000</strong></div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Timeline:</div>
              <div class="detail-value">6 months (with potential for long-term partnership)</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Start Date:</div>
              <div class="detail-value">July 1, 2025</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Project Type:</div>
              <div class="detail-value">Enterprise Web Application with AI Integration</div>
            </div>
            
            <div class="detail-item">
              <div class="detail-label">Technologies:</div>
              <div class="detail-value">React, Node.js, AWS, Machine Learning APIs</div>
            </div>
          </div>
          
          <div class="benefits">
            <h3 style="color: #1a1a1a;">Why This Partnership Matters</h3>
            
            <div class="benefit-item">
              <div class="benefit-icon">✓</div>
              <div>Establish DevTone as a trusted partner for Fortune 500 companies</div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">✓</div>
              <div>Access to TechCorp's extensive network of enterprise clients</div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">✓</div>
              <div>Featured case study rights for your portfolio</div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">✓</div>
              <div>Potential for $1M+ in additional projects over the next 24 months</div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">✓</div>
              <div>Direct collaboration with TechCorp's innovation team</div>
            </div>
          </div>
          
          <div class="confidential">
            <strong>🔒 Confidential:</strong> This opportunity is being extended exclusively to DevTone based on your exceptional portfolio and reputation in the industry. Please treat this information with the utmost confidentiality.
          </div>
          
          <p>The selection committee at TechCorp was particularly impressed with your recent work and innovative approach to web development. They believe DevTone's expertise aligns perfectly with their vision for this transformative project.</p>
          
          <p>To move forward, we would like to schedule a video conference with you and TechCorp's CTO next week to discuss the project requirements in detail and answer any questions you may have.</p>
          
          <div class="signature">
            <div class="signature-name">Alexandra Chen</div>
            <div class="signature-title">Senior Partnership Director</div>
            <div class="signature-title">TechCorp Industries</div>
          </div>
        </div>
        
        <div class="cta-section">
          <h2 style="margin-top: 0;">Ready to Transform the Digital Landscape?</h2>
          <p>This is your opportunity to work on a project that will define the future of enterprise web applications.</p>
          <a href="https://calendly.com/techcorp/devtone-partnership" class="cta-button">Schedule Partnership Call</a>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">© 2025 TechCorp Industries. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; font-size: 12px;">
            This email contains confidential information intended solely for DevTone Agency.<br>
            If you are not the intended recipient, please delete this email immediately.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
Dear DevTone Team,

We are thrilled to present you with an exclusive opportunity to partner with TechCorp Industries, a Fortune 500 company, for their upcoming digital transformation initiative.

PROJECT OVERVIEW
TechCorp Industries is seeking a premier development partner to completely reimagine their digital presence and create a cutting-edge web platform that will serve over 10 million users globally.

PROJECT SPECIFICATIONS
- Project Value: $250,000 - $350,000
- Timeline: 6 months (with potential for long-term partnership)
- Start Date: July 1, 2025
- Project Type: Enterprise Web Application with AI Integration
- Technologies: React, Node.js, AWS, Machine Learning APIs

WHY THIS PARTNERSHIP MATTERS
✓ Establish DevTone as a trusted partner for Fortune 500 companies
✓ Access to TechCorp's extensive network of enterprise clients
✓ Featured case study rights for your portfolio
✓ Potential for $1M+ in additional projects over the next 24 months
✓ Direct collaboration with TechCorp's innovation team

CONFIDENTIAL: This opportunity is being extended exclusively to DevTone based on your exceptional portfolio and reputation in the industry.

The selection committee at TechCorp was particularly impressed with your recent work and innovative approach to web development. They believe DevTone's expertise aligns perfectly with their vision for this transformative project.

To move forward, we would like to schedule a video conference with you and TechCorp's CTO next week to discuss the project requirements in detail.

Best regards,

Alexandra Chen
Senior Partnership Director
TechCorp Industries

© 2025 TechCorp Industries. All rights reserved.
This email contains confidential information intended solely for DevTone Agency.
  `
};

// Send the email
async function sendOfferLetter() {
  try {
    console.log('🔌 Connecting to SMTP server...');
    await transporter.verify();
    console.log('✅ Connection verified\n');
    
    console.log('📤 Sending professional offer letter...');
    const info = await transporter.sendMail(offerLetter);
    
    console.log('\n✅ SUCCESS! Professional offer letter sent to team@devtone.agency');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log('\n🎉 Check your IONOS email inbox for the fancy offer letter!');
    console.log('💡 Tip: This demonstrates how your estimate emails will look professionally formatted.');
    
  } catch (error) {
    console.error('\n❌ Failed to send offer letter:');
    console.error(error.message);
  }
}

// Run
sendOfferLetter();