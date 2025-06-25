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