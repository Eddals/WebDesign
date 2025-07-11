import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  company?: string;
  preferredContact?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Use the full URL for the API endpoint
      const apiUrl = '/api/contact-brevo';
      
      console.log('Submitting contact form to:', apiUrl);
      console.log('Form data:', formData);
      
      // Send to Make.com webhook
      try {
        const webhookData = {
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          assunto: formData.subject,
          mensagem: formData.message,
          data_envio: new Date().toISOString(),
          origem: 'formulario-contato'
        };
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const webhookResponse = await fetch('https://hook.us2.make.com/9e3cokwmwww6kbxu27awfncy4hvfnja6', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('Make.com webhook response status:', webhookResponse.status);
      } catch (webhookError) {
        console.error('Error sending to Make.com webhook:', webhookError);
        // Continue even if webhook fails
      }
      
      // Also send to the original API endpoint
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('API response status:', response.status);
      
      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error submitting contact form:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText || 'No error details'}`);
      }
      
      // Try to parse the JSON response
      let result;
      try {
        const text = await response.text();
        console.log('Response text:', text);
        result = text ? JSON.parse(text) : { success: false, message: 'Empty response' };
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Your message has been sent successfully! We\'ll get back to you soon.'
        });
        
        // Clear form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email'
        });
        
        // Log success for analytics
        if (window.gtag) {
          window.gtag('event', 'contact_form_submission', {
            event_category: 'engagement',
            event_label: formData.subject
          });
        }
      } else {
        throw new Error(result.message || result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      console.log('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: formData
      });
      
      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setSubmitStatus({
          type: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      } else if (error instanceof Error && error.message.includes('405')) {
        setSubmitStatus({
          type: 'error',
          message: 'The server rejected this request. Please try again later or contact us directly.'
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: error instanceof Error ? error.message : 'An error occurred while sending the message'
        });
      }
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Contact submission completed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter your emails"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter message subject"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter your message"
            />
          </div>
        </div>

        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              submitStatus.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {submitStatus.message}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            'Sending...'
          ) : (
            <>
              Send Message <Send className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ContactForm; 