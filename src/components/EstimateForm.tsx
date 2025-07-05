import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Phone, Building, Calendar, DollarSign, FileText, CheckCircle, Send, MapPin } from 'lucide-react';

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
  const [isSubmitted, setIsSubmitted] = useState(false);
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

      // Format data for HubSpot API
      const hubspotData = {
        name: formData.full_name,
        email: formData.email,
        phone: formData.phone || '',
        company: formData.property_type || '', // Using property_type as company if available
        country: formData.location || '',
        industry: formData.service_type || '' // Using service_type as industry
      };
      
      // Garantir que todos os campos estão definidos, mesmo que vazios
      Object.keys(hubspotData).forEach(key => {
        if (hubspotData[key] === undefined || hubspotData[key] === null) {
          hubspotData[key] = '';
        }
      });

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

      // Send to HubSpot API
      try {
        console.log('Sending data to HubSpot...', hubspotData);
        
        // Definir a URL completa para a API do HubSpot
        const apiUrl = window.location.origin + '/api/hubspot';
        console.log('HubSpot API URL:', apiUrl);
        
        const hubspotResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(hubspotData)
        });

        console.log('HubSpot API status:', hubspotResponse.status);
        
        // Tentar obter a resposta como JSON
        let errorData;
        try {
          errorData = await hubspotResponse.json();
        } catch (jsonError) {
          console.error('Erro ao processar resposta JSON:', jsonError);
          errorData = { error: 'Erro ao processar resposta' };
        }
        
        if (!hubspotResponse.ok) {
          console.error('HubSpot API error:', {
            status: hubspotResponse.status,
            statusText: hubspotResponse.statusText,
            data: errorData
          });
          // Continue even if HubSpot API fails
        } else {
          console.log('HubSpot API response:', errorData);
        }
      } catch (hubspotError) {
        console.error('Error sending to HubSpot API:', hubspotError);
        // Continue even if HubSpot API fails
      }

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
      
      // Send to N8N webhook
      // PRIORIDADE 1: Enviar diretamente para o webhook do HubSpot
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        console.log('Enviando dados diretamente para o webhook do HubSpot...');
        
        // Formatar os dados para o webhook do HubSpot
        const hubspotWebhookData = {
          submittedAt: Date.now(),
          fields: [
            { name: "firstname", value: formData.full_name.split(' ')[0] || '' },
            { name: "lastname", value: formData.full_name.split(' ').slice(1).join(' ') || '' },
            { name: "email", value: formData.email },
            { name: "phone", value: formData.phone || '' },
            { name: "company", value: formData.property_type || '' },
            { name: "country", value: formData.location || '' },
            { name: "industry", value: formData.service_type || '' },
            { name: "budget", value: formData.estimated_budget || '' },
            { name: "timeline", value: formData.preferred_timeline || '' },
            { name: "message", value: formData.project_description || '' },
            { name: "property_size", value: formData.property_size || '' },
            { name: "source", value: "estimate_form" }
          ],
          context: {
            pageUri: "estimate-form",
            pageName: "Estimate Request Form"
          }
        };
        
        // Enviar diretamente para o webhook do HubSpot
        const response = await fetch('https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/TVURhgi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hubspotWebhookData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('HubSpot webhook direct response status:', response.status);
        
        // Verificar se a requisição foi bem-sucedida
        if (response.ok) {
          console.log('✅ Dados enviados com sucesso para o webhook do HubSpot!');
        } else {
          console.error('❌ Falha ao enviar dados diretamente para o webhook do HubSpot');
          // Se falhar, tentar o proxy como backup
          await sendToHubSpotViaProxy();
        }
      } catch (directWebhookError) {
        console.error('Erro ao enviar diretamente para o webhook do HubSpot:', directWebhookError);
        // Se falhar com exceção, tentar o proxy como backup
        await sendToHubSpotViaProxy();
      }
      
      // BACKUP 1: Enviar via proxy webhook
      async function sendToHubSpotViaProxy() {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          console.log('Tentando enviar via proxy webhook...');
          
          // Usar nosso proxy webhook com o parâmetro target=hubspot
          const response = await fetch('/api/webhook-proxy?target=hubspot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // Enviar todos os campos do formulário
              firstname: formData.full_name.split(' ')[0] || '',
              lastname: formData.full_name.split(' ').slice(1).join(' ') || '',
              email: formData.email,
              phone: formData.phone || '',
              company: formData.property_type || '',
              country: formData.location || '',
              industry: formData.service_type || '',
              budget: formData.estimated_budget || '',
              timeline: formData.preferred_timeline || '',
              message: formData.project_description || '',
              property_size: formData.property_size || '',
              source: 'estimate_form',
              form_submission_date: new Date().toISOString()
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log('HubSpot webhook proxy response status:', response.status);
          
          if (!response.ok) {
            console.error('HubSpot webhook proxy error:', response.statusText);
            // Se o proxy falhar, tentar a API direta como último recurso
            await sendToHubSpotAPI();
          }
        } catch (proxyError) {
          console.error('Erro ao enviar via proxy webhook:', proxyError);
          // Se o proxy falhar com exceção, tentar a API direta
          await sendToHubSpotAPI();
        }
      }
      
      // BACKUP 2: Enviar via API do HubSpot
      async function sendToHubSpotAPI() {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          console.log('Tentando enviar via API do HubSpot (último recurso)...');
          
          // Usar a API do HubSpot diretamente
          const response = await fetch('/api/hubspot', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.full_name,
              email: formData.email,
              phone: formData.phone || '',
              company: formData.property_type || '',
              country: formData.location || '',
              industry: formData.service_type || ''
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log('HubSpot API response status:', response.status);
          
          if (!response.ok) {
            console.error('HubSpot API error:', response.statusText);
          }
        } catch (apiError) {
          console.error('Erro ao enviar via API do HubSpot:', apiError);
        }
      }
      
      // Enviar para o N8N webhook como backup adicional
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        console.log('Enviando para o N8N webhook (backup adicional)...');
        
        const response = await fetch('https://eae.app.n8n.cloud/webhook/12083862-0339-4d6e-9168-288d61e7cd52', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('N8N webhook response status:', response.status);
      } catch (n8nError) {
        console.error('Erro ao enviar para o N8N webhook:', n8nError);
        // Continuar mesmo se o webhook falhar
      }
      
      // Also send to ActivePieces webhook (keeping as backup)
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
      
      // Set form as submitted
      setIsSubmitted(true);
      
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
      if (error instanceof Error && error.name === 'AbortError') {
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
    <div className="max-w-4xl mx-auto">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Estimate Request Sent!</h3>
          <p className="text-white mb-6">
            Thank you for your request. We&apos;ll prepare a detailed estimate and get back to you within 24-48 hours.
          </p>
          
          <div className="max-w-md mx-auto bg-green-50 border-l-4 border-green-400 p-4 text-green-800 rounded text-left">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  Confirmation Sent
                </p>
                <p className="text-xs mt-1">
                  We&apos;ve sent a confirmation email to your address and our team has been notified of your request.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Phone and Service Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Service Type *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <select
                  id="service_type"
                  name="service_type"
                  required
                  value={formData.service_type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="" className="bg-gray-800">Select a service</option>
                  <option value="Technical SEO" className="bg-gray-800">Technical SEO</option>
                  <option value="On-Page SEO" className="bg-gray-800">On-Page SEO</option>
                  <option value="Off-Page SEO" className="bg-gray-800">Off-Page SEO</option>
                  <option value="Local SEO" className="bg-gray-800">Local SEO</option>
                  <option value="Content Strategy" className="bg-gray-800">Content Strategy</option>
                  <option value="SEO Audit" className="bg-gray-800">SEO Audit</option>
                  <option value="Web Development" className="bg-gray-800">Web Development</option>
                  <option value="Web Design" className="bg-gray-800">Web Design</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget and Timeline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Estimated Budget
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  id="estimated_budget"
                  name="estimated_budget"
                  value={formData.estimated_budget}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter your budget"
                />
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Preferred Timeline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <select
                  id="preferred_timeline"
                  name="preferred_timeline"
                  value={formData.preferred_timeline}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="" className="bg-gray-800">Select a timeline</option>
                  <option value="ASAP" className="bg-gray-800">As soon as possible</option>
                  <option value="1-2 weeks" className="bg-gray-800">1-2 weeks</option>
                  <option value="1 month" className="bg-gray-800">1 month</option>
                  <option value="2-3 months" className="bg-gray-800">2-3 months</option>
                  <option value="Flexible" className="bg-gray-800">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Type and Size Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Property Type
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                >
                  <option value="" className="bg-gray-800">Select property type</option>
                  <option value="Residential" className="bg-gray-800">Residential</option>
                  <option value="Commercial" className="bg-gray-800">Commercial</option>
                  <option value="Industrial" className="bg-gray-800">Industrial</option>
                  <option value="Land" className="bg-gray-800">Land</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Property Size
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  id="property_size"
                  name="property_size"
                  value={formData.property_size}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g., 1500 sq ft"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="City, State, Country"
              />
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Project Description
            </label>
            <textarea
              id="project_description"
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="Please describe your project in detail, including your goals, requirements, and any specific features you need..."
            />
          </div>

          {submitStatus.type && (
            <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {submitStatus.message}
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-full font-semibold text-white transition-all duration-300 ${
              isSubmitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
            }`}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending Request...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Request Estimate
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </motion.button>
        </motion.form>
      )}
    </div>
  );
};

export default EstimateForm;