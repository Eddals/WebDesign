// Email templates for estimate notifications - Spam-safe version

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
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px;">
    
    <!-- Header -->
    <div style="background-color: #495057; color: #ffffff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 600;">New Estimate Request</h1>
      <p style="margin: 8px 0 0 0; color: #ced4da; font-size: 14px;">DevTone Agency</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 32px 24px;">
      
      <!-- Client Information -->
      <h2 style="color: #212529; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">Client Information</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600; width: 120px;">Name:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.name}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Phone:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.phone || 'Not provided'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Company:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Country:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.country || 'Not provided'}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Industry:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.industry || 'Not provided'}</td>
        </tr>
      </table>
      
      <!-- Project Details -->
      <h2 style="color: #212529; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">Project Details</h2>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600; width: 120px;">Project Type:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.projectType}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Budget:</td>
          <td style="padding: 8px 0; color: #495057; font-weight: 600;">${formData.budget}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600;">Timeline:</td>
          <td style="padding: 8px 0; color: #212529;">${formData.timeline}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 8px 0; color: #6c757d; font-weight: 600; vertical-align: top;">Features:</td>
          <td style="padding: 8px 0; color: #212529;">${features}</td>
        </tr>
      </table>
      
      ${formData.description ? `
      <!-- Project Description -->
      <h2 style="color: #212529; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #e9ecef; padding-bottom: 8px;">Project Description</h2>
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; border-left: 4px solid #495057; margin-bottom: 24px;">
        <p style="color: #212529; margin: 0;">${formData.description}</p>
      </div>
      ` : ''}
      
      <!-- Contact Actions -->
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; text-align: center; margin-top: 24px;">
        <p style="color: #6c757d; margin: 0 0 12px 0; font-size: 14px;">Contact Information:</p>
        <p style="margin: 0; color: #495057;">
          Email: ${formData.email}<br>
          Phone: ${formData.phone || 'Not provided'}
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 16px 24px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
      <p style="color: #6c757d; margin: 0; font-size: 12px;">
        Request submitted: ${new Date().toLocaleString()}<br>
        DevTone Agency - Web Development Services
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
  <title>Estimate Request Received - DevTone Agency</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px;">
    
    <!-- Header -->
    <div style="background-color: #495057; color: #ffffff; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Thank You</h1>
      <p style="margin: 8px 0 0 0; color: #ced4da; font-size: 16px;">We have received your estimate request</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 32px 24px;">
      
      <p style="color: #212529; font-size: 16px; margin: 0 0 16px 0;">
        Hello ${formData.name},
      </p>
      
      <p style="color: #212529; font-size: 16px; margin: 0 0 24px 0;">
        Thank you for choosing DevTone Agency for your ${formData.projectType} project. We appreciate your interest in working with us.
      </p>
      
      <!-- Process Timeline -->
      <div style="background-color: #f8f9fa; padding: 24px; border-radius: 4px; margin: 24px 0; border-left: 4px solid #495057;">
        <h2 style="color: #212529; margin: 0 0 20px 0; font-size: 20px; text-align: center;">What Happens Next</h2>
        
        <div style="margin-bottom: 16px;">
          <h3 style="color: #495057; margin: 0 0 4px 0; font-size: 16px;">
            Step 1: Project Review (2-4 hours)
          </h3>
          <p style="color: #6c757d; margin: 0; font-size: 14px;">
            Our team will carefully review your requirements and project details.
          </p>
        </div>
        
        <div style="margin-bottom: 16px;">
          <h3 style="color: #495057; margin: 0 0 4px 0; font-size: 16px;">
            Step 2: Custom Proposal (Within 24 hours)
          </h3>
          <p style="color: #6c757d; margin: 0; font-size: 14px;">
            You will receive a detailed proposal with pricing and timeline information.
          </p>
        </div>
        
        <div>
          <h3 style="color: #495057; margin: 0 0 4px 0; font-size: 16px;">
            Step 3: Consultation Call (Within 48 hours)
          </h3>
          <p style="color: #6c757d; margin: 0; font-size: 14px;">
            We will schedule a call to discuss your project and answer questions.
          </p>
        </div>
      </div>
      
      <!-- Important Notice -->
      <div style="background-color: #fff3cd; padding: 16px; border-radius: 4px; border-left: 4px solid #ffc107; margin: 24px 0;">
        <p style="color: #856404; margin: 0; font-size: 14px;">
          <strong>Please Note:</strong> Check your email regularly for our response. If you do not see our email within 24 hours, please check your spam folder.
        </p>
      </div>
      
      <!-- Project Summary -->
      <h3 style="color: #212529; margin: 24px 0 12px 0; font-size: 18px;">Your Project Summary</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #e9ecef; border-radius: 4px;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; color: #6c757d; font-weight: 600; border-bottom: 1px solid #e9ecef;">Project Type:</td>
          <td style="padding: 12px; color: #212529; border-bottom: 1px solid #e9ecef;">${formData.projectType}</td>
        </tr>
        <tr>
          <td style="padding: 12px; color: #6c757d; font-weight: 600; border-bottom: 1px solid #e9ecef;">Budget Range:</td>
          <td style="padding: 12px; color: #212529; border-bottom: 1px solid #e9ecef;">${formData.budget}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; color: #6c757d; font-weight: 600;">Timeline:</td>
          <td style="padding: 12px; color: #212529;">${formData.timeline}</td>
        </tr>
      </table>
      
      <!-- Contact Information -->
      <div style="text-align: center; margin: 32px 0;">
        <p style="color: #6c757d; margin: 0 0 16px 0; font-size: 16px;">Need to contact us?</p>
        <p style="margin: 0; color: #212529; font-size: 14px;">
          Email: team@devtone.agency<br>
          WhatsApp: +1 (917) 741-3468<br>
          Website: devtone.agency
        </p>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
      <p style="color: #6c757d; margin: 0 0 8px 0; font-size: 14px;">
        Best regards,<br>
        <strong>The DevTone Team</strong>
      </p>
      <p style="color: #6c757d; margin: 0; font-size: 12px;">
        DevTone Agency | Professional Web Development Services<br>
        This is an automated response to your estimate request.
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};