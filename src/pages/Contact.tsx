"use client"

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import SEO from '@/components/SEO';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: 'info@matheusweb.com',
      link: 'mailto:info@matheusweb.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location',
      details: 'São Paulo, Brazil',
      link: 'https://maps.google.com/?q=São+Paulo,+Brazil'
    }
  ];

  return (
    <>
      <SEO 
        title="Contact Me | Web Development Services"
        description="Get in touch for web development services, project inquiries, or consultations. I'm here to help bring your digital vision to life."
        keywords={['contact', 'web development', 'hire developer', 'project inquiry', 'consultation']}
        ogUrl="https://matheusweb.com/contact"
      />
      <div className="min-h-screen pt-24 pb-16 bg-[#030718]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Get in Touch</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-purple-500/20 rounded-full p-3 w-fit mb-4">
                  <div className="text-purple-400">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{info.title}</h3>
                <p className="text-white/70">{info.details}</p>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Contact;
