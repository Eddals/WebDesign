import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface EstimateFormData {
  full_name: string;
  email: string;
  phone: string;
  service_type: string;
  project_description: string;
  estimated_budget: string;
  preferred_timeline: string;
  property_type: string;
  property_size: string;
  location: string;
}

const EstimateForm: React.FC = () => {
  const [formData, setFormData] = useState<EstimateFormData>({
    full_name: '',
    email: '',
    phone: '',
    service_type: '',
    project_description: '',
    estimated_budget: '',
    preferred_timeline: '',
    property_type: '',
    property_size: '',
    location: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      console.log('Submitting form data...');
      
      // Format data for the estimate API
      const estimateData = {
        name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        company: '', // Not collected in this form
        country: formData.location, // Using location as country
        industry: '', // Not collected in this form
        projectType: formData.service_type,
        budget: formData.estimated_budget,
        timeline: formData.preferred_timeline,
        description: formData.project_description,
        features: [] // Not collected in this form
      };

      // Additional data for ActivePieces webhook
      const webhookData = {
        nome: formData.full_name,
        email: formData.email,
        telefone: formData.phone,
        tipo_servico: formData.service_type,
        descricao_projeto: formData.project_description,
        orcamento: formData.estimated_budget,
        prazo: formData.preferred_timeline,
        tipo_propriedade: formData.property_type,
        tamanho_propriedade: formData.property_size,
        localizacao: formData.location,
        data_envio: new Date().toISOString(),
        origem: 'formulario-estimate'
      };

      // Send to estimate API (which will handle email notifications)
      try {
        const apiUrl = import.meta.env.VITE_ESTIMATE_API_URL || 'http://localhost:3002';
        const response = await fetch(`${apiUrl}/api/estimate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(estimateData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit estimate');
        }

        const result = await response.json();
        console.log('Estimate API response:', result);
      } catch (apiError) {
        console.error('Error sending to estimate API:', apiError);
        // Continue even if API fails - we'll still try ActivePieces
      }
      
      // Also send to ActivePieces webhook
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('https://cloud.activepieces.com/api/v1/webhooks/Eo8FG9ZTw1kVqILR0GxRg', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('ActivePieces webhook response status:', response.status);
      } catch (webhookError) {
        console.error('Error sending to ActivePieces:', webhookError);
        // Continue even if webhook fails
      }

      // Show success message
      setSubmitStatus({
        type: 'success',
        message: 'Your estimate request has been submitted successfully! We will contact you soon.'
      });
      
      // Reset form after successful submission
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        service_type: '',
        project_description: '',
        estimated_budget: '',
        preferred_timeline: '',
        property_type: '',
        property_size: '',
        location: ''
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle specific error types
      if (error.name === 'AbortError') {
        setSubmitStatus({
          type: 'error',
          message: 'Request timed out. Please try again later.'
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: error instanceof Error 
            ? error.message 
            : 'An error occurred while submitting the form. Please try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              required
              value={formData.full_name}
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
              placeholder="Enter your email"
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
            <label htmlFor="service_type" className="block text-sm font-medium text-white mb-2">
              Service Type *
            </label>
            <select
              id="service_type"
              name="service_type"
              required
              value={formData.service_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="">Select a service</option>
              <option value="Technical SEO">Technical SEO</option>
              <option value="On-Page SEO">On-Page SEO</option>
              <option value="Off-Page SEO">Off-Page SEO</option>
              <option value="Local SEO">Local SEO</option>
              <option value="Content Strategy">Content Strategy</option>
              <option value="SEO Audit">SEO Audit</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="project_description" className="block text-sm font-medium text-white mb-2">
              Project Description
            </label>
            <textarea
              id="project_description"
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Describe your project and goals"
            />
          </div>

          <div>
            <label htmlFor="estimated_budget" className="block text-sm font-medium text-white mb-2">
              Estimated Budget
            </label>
            <input
              type="text"
              id="estimated_budget"
              name="estimated_budget"
              value={formData.estimated_budget}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter your budget"
            />
          </div>

          <div>
            <label htmlFor="preferred_timeline" className="block text-sm font-medium text-white mb-2">
              Preferred Timeline
            </label>
            <select
              id="preferred_timeline"
              name="preferred_timeline"
              value={formData.preferred_timeline}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="">Select timeline</option>
              <option value="ASAP">ASAP</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>

          <div>
            <label htmlFor="property_type" className="block text-sm font-medium text-white mb-2">
              Property Type
            </label>
            <input
              type="text"
              id="property_type"
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter property type"
            />
          </div>

          <div>
            <label htmlFor="property_size" className="block text-sm font-medium text-white mb-2">
              Property Size
            </label>
            <input
              type="text"
              id="property_size"
              name="property_size"
              value={formData.property_size}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter property size"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-white mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              placeholder="Enter location"
            />
          </div>
        </div>

        {submitStatus.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              submitStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
            }`}
          >
            <div className="flex items-start gap-3">
              {submitStatus.type === 'success' ? (
                <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div>
                <p className={submitStatus.type === 'success' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                  {submitStatus.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={submitStatus.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                  {submitStatus.message}
                </p>
                {submitStatus.type === 'success' && (
                  <p className="text-green-300 mt-2">
                    We'll review your request and get back to you shortly.
                  </p>
                )}
              </div>
            </div>
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
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Get Your Estimate <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default EstimateForm; 