// Clean professional email templates

export const getAdminEmailTemplate = (formData) => {
  const features = Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || 'None specified';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Estimate Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
    
    <div style="background-color: #333; color: #ffffff; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
      <h1 style="margin: 0; font-size: 22px;">New Estimate Request</h1>
    </div>
    
    <div style="padding: 30px;">
      
      <h2 style="color: #333; margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Client Information</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold; width: 100px;">Name:</td>
          <td style="padding: 6px 0; color: #333;">${formData.name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Email:</td>
          <td style="padding: 6px 0; color: #333;">${formData.email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Phone:</td>
          <td style="padding: 6px 0; color: #333;">${formData.phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Company:</td>
          <td style="padding: 6px 0; color: #333;">${formData.company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Country:</td>
          <td style="padding: 6px 0; color: #333;">${formData.country || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Industry:</td>
          <td style="padding: 6px 0; color: #333;">${formData.industry || 'Not provided'}</td>
        </tr>
      </table>
      
      <h2 style="color: #333; margin: 20px 0 15px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Project Details</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold; width: 100px;">Project Type:</td>
          <td style="padding: 6px 0; color: #333;">${formData.projectType}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Budget:</td>
          <td style="padding: 6px 0; color: #333; font-weight: bold;">${formData.budget}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold;">Timeline:</td>
          <td style="padding: 6px 0; color: #333;">${formData.timeline}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #666; font-weight: bold; vertical-align: top;">Features:</td>
          <td style="padding: 6px 0; color: #333;">${features}</td>
        </tr>
      </table>
      
      ${formData.description ? `
      <h2 style="color: #333; margin: 20px 0 15px 0; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Project Description</h2>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 3px; border-left: 3px solid #333;">
        <p style="color: #333; margin: 0;">${formData.description}</p>
      </div>
      ` : ''}
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 3px; margin-top: 20px;">
        <p style="color: #666; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Contact Information:</p>
        <p style="margin: 0; color: #333; font-size: 14px;">
          Email: ${formData.email}<br>
          Phone: ${formData.phone || 'Not provided'}
        </p>
      </div>
      
    </div>
    
    <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-top: 1px solid #ddd; border-radius: 0 0 5px 5px;">
      <p style="color: #666; margin: 0; font-size: 12px;">
        Request submitted: ${new Date().toLocaleString()}
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

export const getClientEmailTemplate = (formData) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estimate Request Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
    
    <div style="background-color: #333; color: #ffffff; padding: 25px; text-align: center; border-radius: 5px 5px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Thank You</h1>
      <p style="margin: 8px 0 0 0; color: #ccc; font-size: 14px;">We have received your estimate request</p>
    </div>
    
    <div style="padding: 30px;">
      
      <p style="color: #333; font-size: 16px; margin: 0 0 15px 0;">
        Hello ${formData.name},
      </p>
      
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Thank you for choosing DevTone Agency for your ${formData.projectType} project. We appreciate your interest in working with us.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 3px; margin: 20px 0; border-left: 3px solid #333;">
        <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px; text-align: center;">What Happens Next</h2>
        
        <div style="margin-bottom: 12px;">
          <h3 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
            Step 1: Project Review (2-4 hours)
          </h3>
          <p style="color: #666; margin: 0; font-size: 14px;">
            Our team will carefully review your requirements and project details.
          </p>
        </div>
        
        <div style="margin-bottom: 12px;">
          <h3 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
            Step 2: Custom Proposal (Within 24 hours)
          </h3>
          <p style="color: #666; margin: 0; font-size: 14px;">
            You will receive a detailed proposal with pricing and timeline information.
          </p>
        </div>
        
        <div>
          <h3 style="color: #333; margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">
            Step 3: Consultation Call (Within 48 hours)
          </h3>
          <p style="color: #666; margin: 0; font-size: 14px;">
            We will schedule a call to discuss your project and answer questions.
          </p>
        </div>
      </div>
      
      <div style="background-color: #fff8dc; padding: 15px; border-radius: 3px; border-left: 3px solid #f4a261; margin: 20px 0;">
        <p style="color: #8b4513; margin: 0; font-size: 14px;">
          <strong>Please Note:</strong> Check your email regularly for our response. If you do not see our email within 24 hours, please check your spam folder.
        </p>
      </div>
      
      <h3 style="color: #333; margin: 20px 0 10px 0; font-size: 16px;">Your Project Summary</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; border-radius: 3px;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; color: #666; font-weight: bold; border-bottom: 1px solid #ddd;">Project Type:</td>
          <td style="padding: 10px; color: #333; border-bottom: 1px solid #ddd;">${formData.projectType}</td>
        </tr>
        <tr>
          <td style="padding: 10px; color: #666; font-weight: bold; border-bottom: 1px solid #ddd;">Budget Range:</td>
          <td style="padding: 10px; color: #333; border-bottom: 1px solid #ddd;">${formData.budget}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; color: #666; font-weight: bold;">Timeline:</td>
          <td style="padding: 10px; color: #333;">${formData.timeline}</td>
        </tr>
      </table>
      
      <div style="text-align: center; margin: 25px 0;">
        <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Need to contact us?</p>
        <p style="margin: 0; color: #333; font-size: 14px;">
          Email: team@devtone.agency<br>
          WhatsApp: +1 (917) 741-3468<br>
          Website: devtone.agency
        </p>
      </div>
      
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #ddd; border-radius: 0 0 5px 5px;">
      <p style="color: #666; margin: 0; font-size: 14px;">
        Best regards,<br>
        The DevTone Team
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

// Newsletter subscriber template with circular design
export const getNewsletterSubscriberTemplate = (subscriberData) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to DevTone Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 20px; overflow: hidden;">
    
    <!-- Circular Header -->
    <div style="background: linear-gradient(135deg, #4a6cf7 0%, #2541b2 100%); color: #ffffff; padding: 30px; text-align: center; border-radius: 50% 50% 0 0 / 20%;">
      <div style="width: 80px; height: 80px; margin: 0 auto 15px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px; color: #4a6cf7;">✉️</span>
      </div>
      <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Welcome to Our Newsletter!</h1>
      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Thank you for joining our community</p>
    </div>
    
    <div style="padding: 40px 30px;">
      
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Hello ${subscriberData.name},
      </p>
      
      <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">
        Thank you for subscribing to the DevTone newsletter! We're excited to have you join our community of web enthusiasts and digital innovators.
      </p>
      
      <!-- Circular Content Blocks -->
      <div style="margin: 30px 0;">
        <div style="background-color: #f0f7ff; padding: 25px; border-radius: 30px; margin-bottom: 20px; border: 1px solid #e0e9fa;">
          <div style="width: 60px; height: 60px; margin: 0 auto 15px; background-color: #4a6cf7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 30px; color: #ffffff;">🎯</span>
          </div>
          <h3 style="color: #2541b2; margin: 0 0 10px 0; font-size: 18px; text-align: center; font-weight: 600;">What to Expect</h3>
          <p style="color: #555; margin: 0; font-size: 15px; text-align: center;">
            Exclusive insights, industry trends, and practical tips to help you stay ahead in the digital world.
          </p>
        </div>
        
        <div style="background-color: #fff8f0; padding: 25px; border-radius: 30px; margin-bottom: 20px; border: 1px solid #faeee0;">
          <div style="width: 60px; height: 60px; margin: 0 auto 15px; background-color: #f4a261; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 30px; color: #ffffff;">📅</span>
          </div>
          <h3 style="color: #e76f51; margin: 0 0 10px 0; font-size: 18px; text-align: center; font-weight: 600;">Newsletter Frequency</h3>
          <p style="color: #555; margin: 0; font-size: 15px; text-align: center;">
            We'll send you updates twice a month with fresh content and special offers just for subscribers.
          </p>
        </div>
        
        <div style="background-color: #f0fff4; padding: 25px; border-radius: 30px; border: 1px solid #e0faee;">
          <div style="width: 60px; height: 60px; margin: 0 auto 15px; background-color: #2a9d8f; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 30px; color: #ffffff;">💡</span>
          </div>
          <h3 style="color: #2a9d8f; margin: 0 0 10px 0; font-size: 18px; text-align: center; font-weight: 600;">Get Involved</h3>
          <p style="color: #555; margin: 0; font-size: 15px; text-align: center;">
            Have questions or topics you'd like us to cover? Reply to any of our newsletters with your suggestions!
          </p>
        </div>
      </div>
      
      <!-- Social Media Circles -->
      <div style="text-align: center; margin: 35px 0 25px;">
        <p style="color: #666; margin: 0 0 15px 0; font-size: 16px;">Connect with us:</p>
        <div>
          <a href="https://twitter.com/devtoneagency" style="display: inline-block; margin: 0 8px; width: 40px; height: 40px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">𝕏</a>
          <a href="https://instagram.com/devtoneagency" style="display: inline-block; margin: 0 8px; width: 40px; height: 40px; background-color: #e1306c; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">📸</a>
          <a href="https://linkedin.com/company/devtoneagency" style="display: inline-block; margin: 0 8px; width: 40px; height: 40px; background-color: #0077b5; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">in</a>
        </div>
      </div>
      
      <div style="background-color: #f5f7fa; padding: 20px; border-radius: 15px; margin-top: 30px; text-align: center;">
        <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Need assistance?</p>
        <p style="margin: 0; color: #333; font-size: 14px;">
          Email: support@devtone.agency<br>
          Website: <a href="https://devtone.agency" style="color: #4a6cf7; text-decoration: none;">devtone.agency</a>
        </p>
      </div>
      
    </div>
    
    <!-- Circular Footer -->
    <div style="background-color: #f5f7fa; padding: 25px; text-align: center; border-radius: 0 0 20px 20px;">
      <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
        © ${new Date().getFullYear()} DevTone Agency. All rights reserved.
      </p>
      <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
        You're receiving this email because you subscribed to our newsletter.<br>
        <a href="#" style="color: #4a6cf7; text-decoration: none;">Unsubscribe</a> | <a href="#" style="color: #4a6cf7; text-decoration: none;">Privacy Policy</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

// Newsletter admin notification template with circular design
export const getNewsletterAdminTemplate = (subscriberData) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Newsletter Subscriber</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 20px; overflow: hidden;">
    
    <!-- Circular Header -->
    <div style="background: linear-gradient(135deg, #6c5ce7 0%, #4834d4 100%); color: #ffffff; padding: 25px; text-align: center; border-radius: 50% 50% 0 0 / 20%;">
      <div style="width: 70px; height: 70px; margin: 0 auto 15px; background-color: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 35px; color: #6c5ce7;">📊</span>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Newsletter Subscriber!</h1>
      <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Someone just joined your mailing list</p>
    </div>
    
    <div style="padding: 35px 30px;">
      
      <div style="background-color: #f0f7ff; padding: 25px; border-radius: 20px; margin-bottom: 25px; border: 1px solid #e0e9fa;">
        <h2 style="color: #4834d4; margin: 0 0 20px 0; font-size: 18px; text-align: center; font-weight: 600;">Subscriber Details</h2>
        
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 40px; height: 40px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 20px; color: #ffffff;">👤</span>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">Name</p>
            <p style="margin: 3px 0 0 0; color: #333; font-size: 16px;">${subscriberData.name}</p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 40px; height: 40px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 20px; color: #ffffff;">✉️</span>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">Email</p>
            <p style="margin: 3px 0 0 0; color: #333; font-size: 16px;">${subscriberData.email}</p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 40px; height: 40px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 20px; color: #ffffff;">📱</span>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">Source</p>
            <p style="margin: 3px 0 0 0; color: #333; font-size: 16px;">${subscriberData.source}</p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center;">
          <div style="width: 40px; height: 40px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="font-size: 20px; color: #ffffff;">🕒</span>
          </div>
          <div>
            <p style="margin: 0; color: #666; font-size: 14px; font-weight: bold;">Subscribed At</p>
            <p style="margin: 3px 0 0 0; color: #333; font-size: 16px;">${subscriberData.subscribedAt}</p>
          </div>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://devtone.agency/admin/subscribers" style="display: inline-block; background-color: #6c5ce7; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; margin: 0 10px 10px 0; box-shadow: 0 4px 6px rgba(108, 92, 231, 0.2);">View All Subscribers</a>
        <a href="mailto:${subscriberData.email}" style="display: inline-block; background-color: #ffffff; color: #6c5ce7; text-decoration: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; border: 2px solid #6c5ce7; margin: 0 0 10px 0;">Contact Subscriber</a>
      </div>
      
      <!-- Stats Section -->
      <div style="background-color: #f9f7ff; padding: 20px; border-radius: 20px; margin-top: 20px; text-align: center;">
        <h3 style="color: #4834d4; margin: 0 0 15px 0; font-size: 16px;">Newsletter Growth</h3>
        <div style="display: flex; justify-content: space-around; text-align: center;">
          <div>
            <div style="width: 60px; height: 60px; margin: 0 auto 10px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px; color: #ffffff;">📈</span>
            </div>
            <p style="margin: 0; color: #666; font-size: 12px;">This Month</p>
            <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">+12%</p>
          </div>
          <div>
            <div style="width: 60px; height: 60px; margin: 0 auto 10px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px; color: #ffffff;">👥</span>
            </div>
            <p style="margin: 0; color: #666; font-size: 12px;">Total Subscribers</p>
            <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">1,250</p>
          </div>
          <div>
            <div style="width: 60px; height: 60px; margin: 0 auto 10px; background-color: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px; color: #ffffff;">📧</span>
            </div>
            <p style="margin: 0; color: #666; font-size: 12px;">Open Rate</p>
            <p style="margin: 5px 0 0 0; color: #333; font-size: 18px; font-weight: bold;">68%</p>
          </div>
        </div>
      </div>
      
    </div>
    
    <!-- Circular Footer -->
    <div style="background-color: #f5f7fa; padding: 20px; text-align: center; border-radius: 0 0 20px 20px;">
      <p style="color: #666; margin: 0; font-size: 14px;">
        © ${new Date().getFullYear()} DevTone Agency Admin System
      </p>
      <p style="color: #999; margin: 8px 0 0 0; font-size: 12px;">
        This is an automated notification. Please do not reply to this email.
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};