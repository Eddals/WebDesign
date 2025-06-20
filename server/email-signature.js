// Centralized email signature configuration
const getEmailSignature = () => {
  const currentYear = new Date().getFullYear();
  
  return {
    html: `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e5e5; font-family: Arial, sans-serif;">
        <table style="width: 100%; border-spacing: 0;">
          <tr>
            <td style="vertical-align: top; padding-right: 30px; width: 200px;">
              <img src="https://i.imgur.com/EzON3zo.png" alt="DevTone Logo" style="max-width: 180px; height: auto;">
            </td>
            <td style="vertical-align: top;">
              <div style="color: #333; line-height: 1.6;">
                <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #6B46C1;">Devtone Agency</p>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #666;">Team Department</p>
                
                <p style="margin: 0 0 8px 0; font-size: 14px; display: flex; align-items: center;">
                  <img src="https://img.icons8.com/material-rounded/48/6B46C1/phone.png" alt="Phone" style="width: 16px; height: 16px; margin-right: 8px;">
                  <a href="tel:+19177413468" style="color: #6B46C1; text-decoration: none;">+1 (917)-741-3468</a>
                </p>
                <p style="margin: 0 0 20px 0; font-size: 14px; display: flex; align-items: center;">
                  <img src="https://img.icons8.com/material-rounded/48/6B46C1/mail.png" alt="Email" style="width: 16px; height: 16px; margin-right: 8px;">
                  <a href="mailto:team@devtone.agency" style="color: #6B46C1; text-decoration: none;">team@devtone.agency</a>
                </p>
          
          <div style="margin-bottom: 20px;">
                  <a href="https://www.tiktok.com/@devtone" style="display: inline-block; margin-right: 10px;">
                    <img src="https://img.icons8.com/fluency/32/000000/tiktok.png" alt="TikTok" style="width: 28px; height: 28px;">
                  </a>
                  <a href="https://instagram.com/devtone" style="display: inline-block; margin-right: 10px;">
                    <img src="https://img.icons8.com/fluency/32/000000/instagram-new.png" alt="Instagram" style="width: 28px; height: 28px;">
                  </a>
                  <a href="https://facebook.com/devtone" style="display: inline-block; margin-right: 10px;">
                    <img src="https://img.icons8.com/fluency/32/000000/facebook-new.png" alt="Facebook" style="width: 28px; height: 28px;">
                  </a>
                  <a href="https://linkedin.com/company/devtone" style="display: inline-block;">
                    <img src="https://img.icons8.com/fluency/32/000000/linkedin.png" alt="LinkedIn" style="width: 28px; height: 28px;">
                  </a>
                </div>
              </div>
            </td>
          </tr>
        </table>
        
        <div style="background-color: #f3f4f6; padding: 12px 18px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.5;">
            <strong>Need help?</strong><br>
            Visit us at <a href="https://devtone.agency" style="color: #6B46C1; text-decoration: none;">devtone.agency</a> or contact us directly at <a href="mailto:support@devtone.agency" style="color: #6B46C1; text-decoration: none;">support@devtone.agency</a>
          </p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e5e5; text-align: center; font-size: 11px; color: #999;">
          <p style="margin: 5px 0;">
            © ${currentYear} DevTone Agency. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `

Devtone Agency
Team Department
+1 (917)-741-3468
team@devtone.agency

Need help?
Visit us at devtone.agency or contact us directly at support@devtone.agency

Follow us:
TikTok: https://www.tiktok.com/@devtone
Instagram: https://instagram.com/devtone
Facebook: https://facebook.com/devtone
LinkedIn: https://linkedin.com/company/devtone

© ${currentYear} DevTone Agency. All rights reserved.
    `
  };
};

// Function to append signature to email content
const addSignatureToEmail = (emailContent) => {
  const signature = getEmailSignature();
  
  return {
    html: emailContent.html ? `${emailContent.html}${signature.html}` : signature.html,
    text: emailContent.text ? `${emailContent.text}${signature.text}` : signature.text
  };
};

module.exports = {
  getEmailSignature,
  addSignatureToEmail
};