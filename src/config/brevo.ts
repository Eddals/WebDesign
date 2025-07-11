export const BREVO_CONFIG = {
  API_KEY: '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',
  API_URL: 'https://api.brevo.com/v3/smtp/email',
  TEAM_EMAIL: 'team@devtone.agency',
  SMTP_SERVER: 'smtp-relay.brevo.com',
  SMTP_PORT: 587,
  SMTP_LOGIN: '91558b001@smtp-brevo.com'
};

export const EMAIL_TEMPLATES = {
  ESTIMATE_NOTIFICATION: {
    subject: (name: string, company: string) => `New Estimate Request - ${name} from ${company}`,
    sender: {
      name: 'DevTone Estimate Form',
      email: 'team@devtone.agency'  // Using verified domain
    }
  },
  ESTIMATE_CONFIRMATION: {
    subject: 'Thank you for your estimate request - DevTone Agency',
    sender: {
      name: 'DevTone Agency',
      email: 'team@devtone.agency'  // Using verified domain
    }
  },
  CONTACT_NOTIFICATION: {
    subject: (subject: string) => `New Contact Form Submission: ${subject}`,
    sender: {
      name: 'DevTone Website',
      email: 'team@devtone.agency'  // Using verified domain
    }
  },
  CONTACT_CONFIRMATION: {
    subject: 'Thank you for contacting DevTone Agency',
    sender: {
      name: 'DevTone Agency',
      email: 'team@devtone.agency'  // Using verified domain
    }
  }
}; 