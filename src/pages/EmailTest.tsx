import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function EmailTest() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState<{
    loading: boolean;
    success: boolean | null;
    error: string | null;
  }>({
    loading: false,
    success: null,
    error: null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      // Enviar para o endpoint simplificado
      const response = await fetch('/api/simple-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Falha ao enviar o email');
      }

      console.log('✅ Email enviado com sucesso:', result);
      setStatus({ loading: false, success: true, error: null });
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      setStatus({ 
        loading: false, 
        success: false, 
        error: error instanceof Error ? error.message : 'Ocorreu um erro ao enviar o email' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Teste de Email - DevTone Agency</title>
      </Helmet>
      
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Teste de Envio de Email
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Use este formulário para testar o envio de emails diretamente pela API
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          {status.success === true && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
              <p className="font-medium">Email enviado com sucesso!</p>
              <p className="text-sm mt-1">Verifique a caixa de entrada de sweepeasellc@gmail.com</p>
            </div>
          )}
          
          {status.error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
              <p className="font-medium">Erro ao enviar email</p>
              <p className="text-sm mt-1">{status.error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assunto
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={status.loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  status.loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {status.loading ? 'Enviando...' : 'Enviar Email de Teste'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Informações de Depuração
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
              <pre className="text-xs text-gray-800 dark:text-gray-300">
                API Endpoint: /api/simple-email
                Método: POST
                Remetente: team@devtone.agency
                Destinatário: sweepeasellc@gmail.com
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}