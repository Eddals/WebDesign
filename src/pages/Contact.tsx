
import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  User,
  Building,
  Calendar,
  CheckCircle,
  ArrowRight,
  MapPin
} from "lucide-react"
import SEO from '@/components/SEO'
import GoogleMapsWidget from '@/components/GoogleMapsWidget'
import { submitContactForm } from '@/lib/contact-service'

const Contact = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Animation references and effects
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  // State for form
  
  // Componente de alerta para o formulário de contato
  // ContactAlert removido conforme solicitado

  // Creative contact methods section
  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Send us an email anytime',
      details: 'support@devtone.agency',
      link: 'mailto:support@devtone.agency',
      color: 'from-purple-400 to-purple-600',
      response: 'Response within 24 hours'
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Phone Support',
      description: 'Mon-Fri from 12am to 6pm EST',
      details: '+1 (718) 419-3863',
      link: 'tel: +17184193863',
      color: 'from-purple-500 to-purple-700',
      response: 'Available during business hours only'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      details: 'info@devtone.agency',
      link: 'mailto:info@devtone.agency',
      color: 'from-purple-600 to-purple-800',
      response: 'Response within 24 hours'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Schedule Call',
      description: 'Book a support call',
      details: 'Free consultation',
      link: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ090688oDQPcvG5Wxi-vZugSIP1LGHQrZxgk5fB5rM46mgFZP1fVoq8xT70bguxDkjBy09qswqj',
      color: 'from-purple-500 to-purple-700',
      response: 'Available slots this week'
    }
  ]

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    console.log('🚀 Sending contact form...');
    console.log('📋 Form data:', formData);

    try {
      // Send data to N8N webhook
      try {
        const webhookData = {
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone || '',
          empresa: formData.company || '',
          assunto: formData.subject,
          mensagem: formData.message,
          contato_preferido: formData.preferredContact,
          data_envio: new Date().toISOString(),
          origem: 'formulario-contato'
        };
        
        console.log('Sending data to N8N webhook:', webhookData);
        
        // Direct webhook call to the new URL
        const webhookUrl = 'https://hook.us2.make.com/9e3cokwmwww6kbxu27awfncy4hvfnja6';
        const n8nWebhookUrl = 'https://devtone.app.n8n.cloud/webhook-test/42fe2df8-50cc-499e-b1c7-0ffdac9f3454';
        
        // Send to Make.com webhook
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });
        console.log('Make.com webhook response status:', webhookResponse.status);

        // Send to N8N webhook
        try {
          const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
          });
          console.log('N8N webhook response status:', n8nResponse.status);
        } catch (n8nError) {
          console.error('Error sending to N8N webhook:', n8nError);
        }
      } catch (webhookError) {
        console.error('Error sending to webhooks:', webhookError);
        // Continue even if webhook fails
      }
      
      // Prepare data for Resend webhook
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        company: formData.company || '',
        subject: formData.subject,
        message: formData.message
      };

      console.log('📧 Sending contact form with data:', emailData);

      // Use the contact service with fallback handling
      const result = await submitContactForm(emailData);
      
      console.log('📧 Contact form response:', result);
      
      // Check if the result was successful
      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
      
      // SMTP email is handled server-side in the API endpoint
      console.log('✅ Form submitted successfully, confirmation email will be sent by the server')
      
      // Show warning if message was stored locally
      if (result.error === 'API temporarily unavailable') {
        alert('Note: Your message has been saved and will be sent automatically when the connection is restored. You can also email us directly at team@devtone.agency');
      }
      
      console.log('✅ Email sent successfully via Resend!');
      console.log('📧 Confirmation email ID:', result.confirmationId);
      console.log('📧 Team notification ID:', result.notificationId);
      
      setIsSubmitted(true);

      // Reset form after success
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          subject: '',
          message: '',
          preferredContact: 'email'
        })
      }, 5000)

    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      
      // More detailed error message
      let errorMessage = 'There was an error sending your message. ';
      if (error instanceof Error) {
        errorMessage += error.message;
      }
      
      // Adicionar informação sobre como entrar em contato diretamente
      errorMessage += '\n\nIf the problem persists, please try again in a few minutes.';
      errorMessage += '\n\nPlease try again or contact us directly at team@devtone.agency';
      
      alert(errorMessage);
      
      // Log more details for debugging
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: formData
      });
    } finally {
      setIsSubmitting(false)
      console.log('🏁 Contact submission completed');
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  // Custom styles
  const customStyles = `
    .animate-gradient-text {
      background-image: linear-gradient(to right, #a855f7, #ec4899, #a855f7);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      animation: gradientText 3s linear infinite;
    }
    
    @keyframes gradientText {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }
    
    .card-hover-effect {
      transition: all 0.3s ease;
    }
    
    .card-hover-effect:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.3);
    }
    
    .text-glow {
      text-shadow: 0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3);
    }
  `;

  return (
    <>
      {/* Live Chat Component */}

      
      <SEO
        title="Contact Devtone Agency - Your Digital Marketing Partner"
        description="Ready to propel your business forward? Partner with Devtone Agency for cutting-edge web development & SEO services. Reach us at team@devtone.agency or call +19295591729."
        keywords={['contact DevTone', 'web development support', 'project consultation', 'technical support', 'get in touch', 'DevTone contact', 'SEO services', 'branding agency', 'PPC advertising', 'social media management', 'email marketing']}
        ogUrl="https://devtone.agency/contact"
      />
      <div className="min-h-screen pt-24 bg-[#030718] overflow-hidden">
        {/* Add the custom styles */}
        <style>{customStyles}</style>

        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-purple-700 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          className="relative pt-12 pb-16 overflow-hidden"
          style={{ opacity, scale }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block px-6 py-2 mb-6 text-purple-300 border border-purple-500/50 rounded-full text-sm backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-500">💬 Let's Talk</span>
                <motion.div
                  className="absolute inset-0 bg-purple-500/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Get In Touch
              </motion.h1>

              <motion.p
                className="text-xl text-white max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Have questions, need support, or want to say hello? We're here to help and would love to hear from you.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 pb-24">
          {/* Contact Methods */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -5 }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${method.color} rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500`}></div>
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 text-center h-full">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${method.color} bg-opacity-20 flex items-center justify-center`}>
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-white mb-3 text-sm">{method.description}</p>
                  <div className="text-purple-400 font-semibold mb-2">{method.details}</div>
                  <div className="text-xs text-white">{method.response}</div>

                  <motion.a
                    href={method.link}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connect
                    <ArrowRight className="w-3 h-3" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">Send Us a Message</h2>
                  <p className="text-white">
                    Whether you have questions, need support, or just want to connect, we're here to help. We'll get back to you within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
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
                            Email Confirmation Sent
                          </p>
                          <p className="text-xs mt-1">
                            We've sent a confirmation email to your address and our team has been notified of your message.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
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
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
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
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="support@adevtone.agency.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company and Phone Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Company
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Your company"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                        >
                          <option value="" className="bg-gray-800">Select a topic</option>
                          <option value="general-inquiry" className="bg-gray-800">General Inquiry</option>
                          <option value="technical-support" className="bg-gray-800">Technical Support</option>
                          <option value="billing-question" className="bg-gray-800">Billing Question</option>
                          <option value="website-issue" className="bg-gray-800">Website Issue</option>
                          <option value="feedback" className="bg-gray-800">Feedback</option>
                          <option value="partnership" className="bg-gray-800">Partnership Opportunity</option>
                          <option value="other" className="bg-gray-800">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        placeholder="Please provide details about your inquiry, question, or how we can assist you..."
                      />
                    </div>

                    {/* Preferred Contact Method */}
                    <div>
                      <label className="block text-white text-sm font-medium mb-3">
                        Preferred Contact Method
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, preferredContact: 'email' }))}
                          className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm
                            ${formData.preferredContact === 'email'
                              ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-600 shadow-lg'
                              : 'bg-white/10 text-white border-white/20 hover:bg-purple-500/10'}
                          `}
                          aria-pressed={formData.preferredContact === 'email'}
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, preferredContact: 'phone' }))}
                          className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm
                            ${formData.preferredContact === 'phone'
                              ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-600 shadow-lg'
                              : 'bg-white/10 text-white border-white/20 hover:bg-purple-500/10'}
                          `}
                          aria-pressed={formData.preferredContact === 'phone'}
                        >
                          <Phone className="w-4 h-4" />
                          Phone
                        </button>
                      </div>
                    </div>

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
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Google Maps Widget */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">Find Us</h3>
                </div>
                <GoogleMapsWidget 
                  mapUrl="https://www.google.com/maps/place/Devtone+Agency/@38.4717772,-170.9868608,4z/data=!4m16!1m9!3m8!1s0x8e862144bbfe7805:0x1d5d4a141863603a!2sDevtone+Agency!8m2!3d46.423669!4d-129.9427086!9m1!1b1!16s%2Fg%2F11xmdlj435!3m5!1s0x8e862144bbfe7805:0x1d5d4a141863603a!8m2!3d46.423669!4d-129.9427086!16s%2Fg%2F11xmdlj435?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D"
                  businessName="Devtone Agency"
                  rating={5.0}
                  address="Digital Headquarters"
                />
              </div>
              
              {/* Support Information */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">How We Can Help</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Technical Support</h4>
                      <p className="text-white text-sm">Help with website issues and troubleshooting or bugs related to your website</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">General Questions</h4>
                      <p className="text-white text-sm">Information about our services and process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Quick Response</h4>
                      <p className="text-white text-sm">We respond to all inquiries within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

            
              {/* Need a Project Estimate */}
              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">Need a Project Estimate?</h3>
                <p className="text-white text-sm mb-4">
                  Looking to start a new project? Get a detailed estimate with our project calculator.
                </p>
                <motion.a
                  href="/estimate"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full font-semibold text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="w-4 h-4" />
                  Get Estimate
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
