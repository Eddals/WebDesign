import { useState } from 'react';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testEmail = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = '/api/test-email';
      
      console.log('📡 Enviando teste para:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📧 Resposta:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Erro no teste de email:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const testContactEmail = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = '/api/send-contact-email';
      
      console.log('📡 Enviando teste para:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📧 Resposta:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Erro no teste de email de contato:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Teste de Email</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testEmail}
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Email de Teste Simples'}
          </button>
          
          <button
            onClick={testContactEmail}
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Testar Formulário de Contato'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {result && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Sucesso</h3>
                <div className="mt-2 text-sm text-green-700">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Instruções</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Clique em "Enviar Email de Teste Simples" para testar o envio básico de email</li>
            <li>Clique em "Testar Formulário de Contato" para testar o endpoint usado pelo formulário de contato</li>
            <li>Verifique o console do navegador para logs detalhados</li>
            <li>Os emails de teste serão enviados para <strong>sweepeasellc@gmail.com</strong></li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
            <h3 className="font-bold">ℹ️ Sobre o Sistema de Email</h3>
            <p className="mt-2">
              Este sistema de email usa o Resend para enviar emails automaticamente quando um cliente preenche o formulário de contato.
            </p>
            <p className="mt-2">
              Dois emails são enviados automaticamente:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Um email de confirmação para o cliente que preencheu o formulário</li>
              <li>Um email de notificação para o administrador (sweepeasellc@gmail.com)</li>
            </ol>
            <p className="mt-2">
              Configuração atual:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Remetente: <strong>team@devtone.agency</strong></li>
              <li>Destinatários: o email do cliente e sweepeasellc@gmail.com</li>
            </ul>
            <p className="mt-2">
              Use esta página para testar se o sistema de email está funcionando corretamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEmail;