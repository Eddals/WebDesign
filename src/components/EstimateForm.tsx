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
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('/submit_estimate.php', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Your estimate request has been submitted successfully!'
        });
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
      } else {
        throw new Error(result.message || 'Failed to submit form');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred while submitting the form'
      });
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
            'Submitting...'
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