import { Resend } from 'resend';

const resend = new Resend('re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR');

async function testRealContactSubmission() {
  console.log('🚀 Testing Real Contact Form Submission\n');
  console.log('This simulates exactly what happens when someone fills out your contact form.\n');
  
  // Simulate a real customer
  const formData = {
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    subject: 'Need Website for My Restaurant',
    message: 'Hi, I own a restaurant in New York and need a modern website with online ordering capabilities. Can you help?'
  };
  
  console.log('📝 Customer fills out form:');
  console.log('Name:', formData.full_name);
  console.log('Email:', formData.email);
  console.log('Subject:', formData.subject);
  console.log('\n' + '='.repeat(60) + '\n');
  
  try {
    // Send the two emails exactly as the API does
    console.log('📧 Sending emails...\n');
    
    const [adminEmail, customerEmail] = await Promise.all([
      // 1. Admin notification to YOU
      resend.emails.send({
        from: 'DevTone Contact System <noreply@devtone.agency>',
        to: 'sweepeasellc@gmail.com',
        replyTo: formData.email,
        subject: `📬 New Contact Form: ${formData.full_name} - ${formData.subject}`,
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background-color: #333; color: #ffffff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px;">📬 New Contact Form Submission</h1>
              <p style="margin: 8px 0 0 0; color: #ccc; font-size: 14px;">From: ${formData.full_name}</p>
            </div>
            
            <div style="padding: 30px; background: #f5f5f5;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 16px;">Contact Information</h2>
              <table style="width: 100%; background: white; padding: 15px; border-radius: 5px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${formData.full_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">
                    <a href="mailto:${formData.email}" style="color: #4a6cf7;">${formData.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${formData.phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: bold;">${formData.subject}</td>
                </tr>
              </table>
              
              <h2 style="color: #333; margin: 20px 0 15px 0; font-size: 16px;">Message</h2>
              <div style="background: white; padding: 20px; border-radius: 5px; border-left: 3px solid #4a6cf7;">
                <p style="color: #333; line-height: 1.6; margin: 0;">${formData.message}</p>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <a href="mailto:${formData.email}?subject=Re: ${formData.subject}" 
                   style="display: inline-block; background-color: #4a6cf7; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                  Reply to Customer
                </a>
              </div>
            </div>
          </div>
        `
      }),
      
      // 2. Confirmation email to CUSTOMER
      resend.emails.send({
        from: 'DevTone Agency <noreply@devtone.agency>',
        to: formData.email,
        subject: '✨ We Received Your Message - DevTone Agency',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: white; padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">We've received your message</p>
            </div>
            
            <div style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
                Hello ${formData.full_name},
              </p>
              
              <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
                Thank you for reaching out to DevTone Agency. We appreciate your interest and have successfully received your message about "${formData.subject}".
              </p>
              
              <div style="background-color: #f0f7ff; padding: 25px; border-radius: 10px; margin: 25px 0;">
                <h3 style="color: #2541b2; margin: 0 0 15px 0; font-size: 18px;">What Happens Next?</h3>
                <p style="color: #555; margin: 0 0 10px 0;">
                  ✅ Our team will review your message within 24 hours<br>
                  ✅ We'll send you a personalized response<br>
                  ✅ If needed, we'll schedule a call to discuss your project
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Best regards,<br>
                <strong>The DevTone Team</strong>
              </p>
            </div>
          </div>
        `
      })
    ]);
    
    console.log('✅ SUCCESS! Both emails sent!\n');
    
    console.log('📬 Email 1 - ADMIN NOTIFICATION (to you):');
    console.log('   To: sweepeasellc@gmail.com');
    console.log('   Subject: 📬 New Contact Form: Sarah Johnson - Need Website for My Restaurant');
    console.log('   Email ID:', adminEmail.data?.id);
    console.log('   Status: You can reply directly to sarah.johnson@example.com');
    
    console.log('\n📬 Email 2 - CUSTOMER CONFIRMATION:');
    console.log('   To: sarah.johnson@example.com');
    console.log('   Subject: ✨ We Received Your Message - DevTone Agency');
    console.log('   Email ID:', customerEmail.data?.id);
    console.log('   Status: Customer knows their message was received');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.response) {
      console.error('Details:', error.response.data);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 SUMMARY:');
  console.log('='.repeat(60));
  console.log('\n✅ The contact form system:');
  console.log('   1. Sends YOU an email at sweepeasellc@gmail.com with customer details');
  console.log('   2. Sends the CUSTOMER a confirmation at their email');
  console.log('   3. Both emails use your verified domain: noreply@devtone.agency');
  console.log('\n🔍 Check your email now at sweepeasellc@gmail.com!');
  console.log('   - Look in inbox and spam folder');
  console.log('   - Search for: from:noreply@devtone.agency');
}

// Run the test
testRealContactSubmission();