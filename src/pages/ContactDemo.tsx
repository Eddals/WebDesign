import React from 'react';
import ContactFormResend from '@/components/ContactFormResend';
import SEO from '@/components/SEO';

const ContactDemo = () => {
  return (
    <>
      <SEO
        title="Demonstração - Formulário de Contato com Resend"
        description="Teste nosso sistema de automação de e-mail com Resend"
        keywords={['contato', 'formulário', 'resend', 'automação']}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Automação de E-mail
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quando você preencher o formulário abaixo, receberá automaticamente um e-mail de confirmação
              através do nosso sistema integrado com Resend.
            </p>
          </div>

          <ContactFormResend />

          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Como funciona?</h2>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Você preenche o formulário com suas informações</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Os dados são enviados para nosso webhook em https://devtone.agency/api/webhooks/resend-simple</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>O webhook processa os dados usando a API da Resend</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Você recebe um e-mail de confirmação personalizado</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <span>Nossa equipe recebe uma notificação sobre o novo contato</span>
                </li>
              </ol>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mt-6">
              <h3 className="font-semibold text-purple-900 mb-2">Informações Técnicas</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>• API Key Resend: re_NYdGRFDW_JWvwsxuMkTR1QSNkjbTE7AVR</li>
                <li>• Domínio verificado: devtone.agency</li>
                <li>• E-mail de envio: team@devtone.agency</li>
                <li>• Webhook endpoint: /api/webhooks/resend-simple</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactDemo;