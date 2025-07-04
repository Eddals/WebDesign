import React, { useState } from 'react';

const TestHubSpot: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    industry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);
    setError(null);

    try {
      console.log('Enviando dados para o HubSpot:', formData);
      
      // Enviar para nossa API que encaminhará para o webhook do HubSpot
      const webhookUrl = 'https://api-na2.hubapi.com/automation/v4/webhook-triggers/243199316/JHi6t1H';
      console.log('Enviando para API que encaminhará para o webhook:', webhookUrl);
      
      const response = await fetch('/api/hubspot-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          webhookUrl: webhookUrl
        })
      });

      console.log('Status da resposta:', response.status);
      
      const data = await response.json();
      console.log('Resposta da API:', data);
      
      setResponse(data);
    } catch (err) {
      console.error('Erro ao enviar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste do Webhook do HubSpot</h1>
      <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md">
        <p className="text-green-800">Este formulário envia dados para o webhook do HubSpot <code>243199316/JHi6t1H</code> através da nossa API</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1">Empresa</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">País</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="industry" className="block text-sm font-medium mb-1">Indústria</label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Evento de Teste para o Webhook'}
        </button>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md">
          <h2 className="text-lg font-semibold text-red-700">Erro</h2>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <h2 className="text-lg font-semibold">Resposta da API</h2>
          <pre className="mt-2 p-2 bg-white border border-gray-200 rounded-md overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestHubSpot;