import React from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

interface ContactFormIntegratedProps {
  formData: {
    name: string;
    email: string;
    company: string;
    phone: string;
    subject: string;
    message: string;
    preferredContact: string;
  };
  isSubmitting: boolean;
  isSubmitted: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ContactFormIntegrated: React.FC<ContactFormIntegratedProps> = ({
  formData,
  isSubmitting,
  isSubmitted,
  onInputChange,
  onSubmit
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Chamar o webhook do Make.com
    try {
      const response = await fetch('https://hook.us2.make.com/9e3cokwmwww6kbxu27awfncy4hvfnja6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar e-mail');
      }

      // Chamar o onSubmit original para manter a lógica existente
      onSubmit(e);
    } catch (error) {
      console.error('Erro ao enviar para webhook Make.com:', error);
      // Ainda assim, chamar o onSubmit para tentar o método alternativo
      onSubmit(e);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Mensagem Enviada!</h3>
        <p className="text-white mb-6">
          Obrigado por entrar em contato. Você receberá um e-mail de confirmação em breve.
        </p>
        <div className="max-w-md mx-auto bg-green-50 border-l-4 border-green-400 p-4 text-green-800 rounded text-left">
          <p className="text-sm font-medium">E-mail de Confirmação Automático</p>
          <p className="text-xs mt-1">
            Enviamos um e-mail de confirmação para seu endereço e nossa equipe foi notificada.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alerta sobre e-mail automático */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-blue-800 rounded">
        <p className="text-sm font-medium">Sistema de E-mail Automático</p>
        <p className="text-xs mt-1">
          Ao enviar este formulário, você receberá automaticamente um e-mail de confirmação.
        </p>
      </div>

      {/* Campos do formulário (mantendo a estrutura original) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Seu nome completo"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            E-mail *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Empresa
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={onInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Nome da empresa"
          />
        </div>
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="+55 (11) 99999-9999"
          />
        </div>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Assunto *
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={onInputChange}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
        >
          <option value="" className="bg-gray-800">Selecione um assunto</option>
          <option value="general-inquiry" className="bg-gray-800">Consulta Geral</option>
          <option value="technical-support" className="bg-gray-800">Suporte Técnico</option>
          <option value="billing-question" className="bg-gray-800">Questão Financeira</option>
          <option value="website-issue" className="bg-gray-800">Problema no Site</option>
          <option value="feedback" className="bg-gray-800">Feedback</option>
          <option value="partnership" className="bg-gray-800">Parceria</option>
          <option value="other" className="bg-gray-800">Outro</option>
        </select>
      </div>

      <div>
        <label className="block text-white text-sm font-medium mb-2">
          Mensagem *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onInputChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          placeholder="Descreva como podemos ajudá-lo..."
        />
      </div>

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
            Enviando Mensagem...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            Enviar Mensagem
          </div>
        )}
      </motion.button>
    </form>
  );
};

export default ContactFormIntegrated;