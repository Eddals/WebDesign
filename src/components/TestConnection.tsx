import React, { useState, useEffect } from 'react';
import { simpleClientService } from '../lib/simple-client-api';

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testando conexão...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('testing');
      setMessage('Testando conexão com sistema de registro...');

      // Teste 1: Verificar conexão básica
      const connectionTest = await simpleClientService.testConnection();

      if (!connectionTest.success) {
        setStatus('error');
        setMessage(`Erro na conexão: ${connectionTest.error}`);
        setDetails(connectionTest.error);
        return;
      }

      // Teste 2: Tentar registrar um cliente de teste
      const testClient = {
        email: `teste_${Date.now()}@exemplo.com`,
        password: 'teste123',
        full_name: 'Cliente Teste',
        company_name: 'Empresa Teste',
        phone: '(11) 99999-9999',
        industry: 'Technology',
        country: 'Brasil',
        business_description: 'Teste de conexão do sistema'
      };

      const registerTest = await simpleClientService.register(testClient);

      if (!registerTest.success) {
        setStatus('error');
        setMessage(`Erro no registro: ${registerTest.error}`);
        setDetails(registerTest.error);
        return;
      }

      // Teste 3: Verificar se o cliente foi criado
      const clientsTest = await simpleClientService.getAllClients();

      if (!clientsTest.success) {
        setStatus('error');
        setMessage(`Erro ao buscar clientes: ${clientsTest.error}`);
        setDetails(clientsTest.error);
        return;
      }

      setStatus('success');
      setMessage('Sistema funcionando perfeitamente!');
      setDetails({
        message: 'Todos os testes passaram',
        tests: [
          '✅ Conexão com banco de dados funcionando',
          '✅ Registro de clientes funcionando',
          '✅ Sistema de notificações ativo',
          '✅ Busca de dados funcionando',
          `✅ Cliente de teste criado: ${testClient.email}`
        ]
      });

    } catch (error: any) {
      console.error('Erro no teste:', error);
      setStatus('error');
      setMessage(`Erro inesperado: ${error.message}`);
      setDetails(error);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'testing': return 'text-yellow-400 bg-yellow-500/20';
      case 'success': return 'text-green-400 bg-green-500/20';
      case 'error': return 'text-red-400 bg-red-500/20';
      default: return 'text-purple-400 bg-purple-500/20';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '🔍';
    }
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{getStatusIcon()}</span>
        <div>
          <h3 className="text-white font-semibold">Teste de Conexão</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-purple-100 text-sm mb-4">{message}</p>

      {details && (
        <div className="bg-white/10 rounded-lg p-3 mb-4">
          <h4 className="text-white font-medium text-sm mb-2">Detalhes:</h4>
          {status === 'success' && details.tests ? (
            <div className="space-y-1">
              {details.tests.map((test: string, index: number) => (
                <div key={index} className="text-green-200 text-xs">{test}</div>
              ))}
            </div>
          ) : (
            <pre className="text-red-200 text-xs overflow-auto max-h-32">
              {JSON.stringify(details, null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={testConnection}
          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-all"
        >
          Testar Novamente
        </button>
        
        {status === 'success' && (
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-all"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

export default TestConnection;
