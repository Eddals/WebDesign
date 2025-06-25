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
                <h2 style="color: #333; margin: 0 0 25px 0; font-size: 22px; text-align: center;">
                  <img src="https://img.icons8.com/fluency/48/000000/process.png" alt="Process" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 10px;">
                  What Happens Next?
                </h2>
                
                <div style="margin-bottom: 25px; padding-left: 10px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 50px; vertical-align: top;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">1</div>
                      </td>
                      <td style="padding-left: 15px;">
                        <h3 style="color: #333; margin: 0 0 8px 0; font-size: 17px;">
                          <img src="https://img.icons8.com/fluency/24/000000/task-planning.png" alt="Review" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                          Project Review (2-4 hours)
                        </h3>
                        <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">Our team will carefully review your requirements and project details.</p>
                      </td>
                    </tr>
                  </table>
                </div>
                
                <div style="margin-bottom: 25px; padding-left: 10px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 50px; vertical-align: top;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">2</div>
                      </td>
                      <td style="padding-left: 15px;">
                        <h3 style="color: #333; margin: 0 0 8px 0; font-size: 17px;">
                          <img src="https://img.icons8.com/fluency/24/000000/document.png" alt="Proposal" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                          Custom Proposal (Within 24 hours)
                        </h3>
                        <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">You'll receive a detailed proposal with pricing breakdown and timeline.</p>
                      </td>
                    </tr>
                  </table>
                </div>
                
                <div style="padding-left: 10px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="width: 50px; vertical-align: top;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px;">3</div>
                      </td>
                      <td style="padding-left: 15px;">
                        <h3 style="color: #333; margin: 0 0 8px 0; font-size: 17px;">
                          <img src="https://img.icons8.com/fluency/24/000000/video-call.png" alt="Call" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                          Consultation Call (Within 48 hours)
                        </h3>
                        <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5;">We'll schedule a call to discuss your project in detail and answer any questions.</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 5px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>💡 Pro Tip:</strong> Check your spam folder if you don't see our response within 24 hours.
                </p>
              </div>
              
              <h3 style="color: #333; margin: 30px 0 20px 0; font-size: 18px;">
                <img src="https://img.icons8.com/fluency/24/000000/summary-list.png" alt="Summary" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                Your Project Summary:
              </h3>
              <table width="100%" cellpadding="12" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold; width: 150px;">
                    <img src="https://img.icons8.com/fluency/16/000000/project.png" alt="Project" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;">
                    Project Type:
                  </td>
                  <td style="color: #333; font-weight: 500;">${formData.projectType}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-weight: bold;">
                    <img src="https://img.icons8.com/fluency/16/000000/money-bag.png" alt="Budget" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;">
                    Budget Range:
                  </td>
                  <td style="color: #333; font-weight: 500;">${formData.budget}</td>
                </tr>
                <tr style="background-color: #f8f9fa;">
                  <td style="color: #666; font-weight: bold;">
                    <img src="https://img.icons8.com/fluency/16/000000/calendar.png" alt="Timeline" style="width: 16px; height: 16px; vertical-align: middle; margin-right: 6px;">
                    Timeline:
                  </td>
                  <td style="color: #333; font-weight: 500;">${formData.timeline}</td>
                </tr>
              </table>
              
              <div style="text-align: center; margin: 40px 0;">
                <p style="color: #666; margin: 0 0 25px 0; font-size: 16px;">Need to reach us sooner?</p>
                <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="padding: 0 10px;">
                      <a href="https://wa.me/19177413468" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); transition: all 0.3s ease;">
                        <img src="https://img.icons8.com/color/24/000000/whatsapp--v1.png" alt="WhatsApp" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        WhatsApp Us
                      </a>
                    </td>
                    <td style="padding: 0 10px;">
                      <a href="mailto:team@devtone.agency" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); transition: all 0.3s ease;">
                        <img src="https://img.icons8.com/fluency/24/000000/mail.png" alt="Email" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px;">
                        Email Us
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 40px 30px; border-top: 1px solid #e5e7eb;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <!-- Signature -->
                    <div style="margin-bottom: 30px;">
                      <p style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-style: italic;">
                        "Thank you for choosing DevTone Agency for your ${formData.projectType} project. We're excited about the opportunity to work with you!"
                      </p>
                      <p style="color: #666; margin: 0 0 5px 0; font-size: 15px;">
                        Best regards,
                      </p>
                      <p style="color: #333; margin: 0; font-size: 18px; font-weight: 600;">
                        The DevTone Team
                      </p>
                    </div>
                    
                    <!-- Company Info -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                      <img src="https://img.icons8.com/fluency/48/000000/domain.png" alt="DevTone" style="width: 40px; height: 40px; margin-bottom: 15px;">
                      <p style="color: #666; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                        DevTone Agency
                      </p>
                      <p style="color: #999; margin: 0 0 5px 0; font-size: 13px;">
                        Professional Web Development & Digital Solutions
                      </p>
                      <p style="color: #999; margin: 0 0 20px 0; font-size: 13px;">
                        <a href="https://devtone.agency" style="color: #6366f1; text-decoration: none;">www.devtone.agency</a> | 
                        <a href="tel:+19177413468" style="color: #6366f1; text-decoration: none;">+1 (917) 741-3468</a>
                      </p>
                      
                      <!-- Social Media Icons -->
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td style="padding: 0 5px;">
                            <a href="https://linkedin.com/company/devtone-agency" style="text-decoration: none;">
                              <img src="https://img.icons8.com/fluency/32/000000/linkedin.png" alt="LinkedIn" style="width: 28px; height: 28px;">
                            </a>
                          </td>
                          <td style="padding: 0 5px;">
                            <a href="https://twitter.com/devtoneagency" style="text-decoration: none;">
                              <img src="https://img.icons8.com/fluency/32/000000/twitter.png" alt="Twitter" style="width: 28px; height: 28px;">
                            </a>
                          </td>
                          <td style="padding: 0 5px;">
                            <a href="https://instagram.com/devtoneagency" style="text-decoration: none;">
                              <img src="https://img.icons8.com/fluency/32/000000/instagram-new.png" alt="Instagram" style="width: 28px; height: 28px;">
                            </a>
                          </td>
                          <td style="padding: 0 5px;">
                            <a href="https://facebook.com/devtoneagency" style="text-decoration: none;">
                              <img src="https://img.icons8.com/fluency/32/000000/facebook-new.png" alt="Facebook" style="width: 28px; height: 28px;">
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
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