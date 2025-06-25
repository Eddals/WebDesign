// Email templates for estimate notifications

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
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Estimate Request</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">DevTone Agency</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Client Information</h2>
              
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-weight: bold; width: 150px;">Name:</td>
                  <td style="color: #333;">${formData.name}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold;">Email:</td>
                  <td style="color: #333;"><a href="mailto:${formData.email}" style="color: #6366f1;">${formData.email}</a></td>
                </tr>
                <tr>
                  <td style="color: #666; font-weight: bold;">Phone:</td>
                  <td style="color: #333;">${formData.phone || 'Not provided'}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold;">Company:</td>
                  <td style="color: #333;">${formData.company || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-weight: bold;">Country:</td>
                  <td style="color: #333;">${formData.country || 'Not provided'}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold;">Industry:</td>
                  <td style="color: #333;">${formData.industry || 'Not provided'}</td>
                </tr>
              </table>
              
              <h2 style="color: #333; margin: 30px 0 20px 0;">Project Details</h2>
              
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-weight: bold; width: 150px;">Project Type:</td>
                  <td style="color: #333;">${formData.projectType}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold;">Budget:</td>
                  <td style="color: #333; font-weight: bold; color: #6366f1;">${formData.budget}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-weight: bold;">Timeline:</td>
                  <td style="color: #333;">${formData.timeline}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold; vertical-align: top;">Features:</td>
                  <td style="color: #333;">${features}</td>
                </tr>
              </table>
              
              ${formData.description ? `
              <h2 style="color: #333; margin: 30px 0 20px 0;">Project Description</h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                <p style="color: #333; margin: 0; line-height: 1.6;">${formData.description}</p>
              </div>
              ` : ''}
              
              <!-- Quick Actions -->
              <div style="margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 5px; text-align: center;">
                <p style="color: #666; margin: 0 0 15px 0;">Quick Actions:</p>
                <a href="mailto:${formData.email}" style="display: inline-block; padding: 12px 30px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 0 10px;">Reply to Client</a>
                <a href="tel:${formData.phone}" style="display: inline-block; padding: 12px 30px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 0 10px;">Call Client</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                This estimate request was submitted on ${new Date().toLocaleString()}
              </p>
              <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
                DevTone Agency - Professional Web Development
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
  <title>Thank You for Your Estimate Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Thank You!</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 18px;">We've received your estimate request</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${formData.name},
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for choosing DevTone Agency for your ${formData.projectType} project. We're excited about the opportunity to work with you!
              </p>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 5px; margin: 30px 0;">
                <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">What Happens Next?</h2>
                
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; align-items: flex-start;">
                    <div style="background-color: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">1</div>
                    <div>
                      <h3 style="color: #333; margin: 0 0 5px 0; font-size: 16px;">Project Review (2-4 hours)</h3>
                      <p style="color: #666; margin: 0; font-size: 14px;">Our team will carefully review your requirements and project details.</p>
                    </div>
                  </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; align-items: flex-start;">
                    <div style="background-color: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</div>
                    <div>
                      <h3 style="color: #333; margin: 0 0 5px 0; font-size: 16px;">Custom Proposal (Within 24 hours)</h3>
                      <p style="color: #666; margin: 0; font-size: 14px;">You'll receive a detailed proposal with pricing and timeline.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div style="display: flex; align-items: flex-start;">
                    <div style="background-color: #6366f1; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</div>
                    <div>
                      <h3 style="color: #333; margin: 0 0 5px 0; font-size: 16px;">Consultation Call (Within 48 hours)</h3>
                      <p style="color: #666; margin: 0; font-size: 14px;">We'll schedule a call to discuss your project in detail.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>💡 Pro Tip:</strong> Check your spam folder if you don't see our response within 24 hours.
                </p>
              </div>
              
              <h3 style="color: #333; margin: 30px 0 15px 0;">Your Project Summary:</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 5px;">
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold; width: 150px;">Project Type:</td>
                  <td style="color: #333;">${formData.projectType}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-weight: bold;">Budget Range:</td>
                  <td style="color: #333;">${formData.budget}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold;">Timeline:</td>
                  <td style="color: #333;">${formData.timeline}</td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 40px 0;">
                <p style="color: #666; margin: 0 0 20px 0;">Need to reach us sooner?</p>
                <a href="https://wa.me/19177413468" style="display: inline-block; padding: 12px 30px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 0 10px;">WhatsApp Us</a>
                <a href="mailto:team@devtone.agency" style="display: inline-block; padding: 12px 30px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 5px; margin: 0 10px;">Email Us</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
                Best regards,<br>
                <strong>The DevTone Team</strong>
              </p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                DevTone Agency | Professional Web Development<br>
                <a href="https://devtone.agency" style="color: #6366f1;">devtone.agency</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};