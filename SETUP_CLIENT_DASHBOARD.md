# Configuração Rápida - Sistema de Painel do Cliente

## ⚡ Setup Rápido (5 minutos)

### 1. Configurar Banco de Dados Supabase

```sql
-- Execute no SQL Editor do Supabase
-- Copie e cole o conteúdo do arquivo: client-project-management-schema.sql
```

### 2. Inserir Dados de Exemplo

```sql
-- Execute no SQL Editor do Supabase
-- Copie e cole o conteúdo do arquivo: client-project-sample-data.sql
```

### 3. Configurar Storage

No painel do Supabase:

1. Vá para **Storage**
2. Clique em **Create bucket**
3. Nome: `project-files`
4. Marque como **Public**
5. Clique em **Create bucket**

### 4. Configurar Políticas de Storage

```sql
-- Execute no SQL Editor do Supabase

-- Política para upload
CREATE POLICY "Enable upload for authenticated users" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para visualização
CREATE POLICY "Enable read for authenticated users" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para download
CREATE POLICY "Enable download for authenticated users" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');
```

### 5. Configurar Autenticação

No painel do Supabase:

1. Vá para **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:5173`
3. Em **Redirect URLs**, adicione: `http://localhost:5173/client-portal`
4. Salve as configurações

### 6. Testar o Sistema

1. Acesse: `http://localhost:5173/client-portal`
2. Clique em **Register** para criar uma conta
3. Use os dados de exemplo:
   - Email: `test@example.com`
   - Nome: `Test User`
   - Empresa: `Test Company`
   - Senha: `password123`

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Configuração de Email (Opcional)

Para emails de verificação e recuperação de senha:

1. No Supabase, vá para **Authentication** > **Settings**
2. Configure **SMTP Settings** com seu provedor de email
3. Ou use o serviço de email do Supabase

### Real-time (Já Configurado)

O sistema já está configurado para real-time. Para verificar:

1. Vá para **Database** > **Replication**
2. Certifique-se de que as tabelas estão habilitadas para replicação

## 🎯 Acessos do Sistema

### Portal do Cliente
- **URL**: `/client-portal`
- **Funcionalidades**: Dashboard, projetos, mensagens, arquivos

### Painel Administrativo
- **URL**: `/admin-client-dashboard`
- **Funcionalidades**: Gerenciamento de clientes e projetos

### Dashboard de Suporte (Existente)
- **URL**: `/chat-dashboard`
- **Senha**: `devtone2024`

## 📊 Dados de Exemplo

O sistema vem com dados de exemplo pré-configurados:

### Clientes de Exemplo
- **John Doe** (Tech Startup Inc)
- **Sarah Wilson** (Retail Co)

### Projetos de Exemplo
- Corporate Website Redesign
- Mobile App Development
- E-commerce Platform

### Credenciais de Teste
Após executar o script de dados de exemplo, você pode usar:
- Email: `john.doe@techstartup.com`
- Senha: Será necessário criar via registro

## 🚀 Funcionalidades Principais

### ✅ Implementado
- [x] Autenticação completa
- [x] Dashboard do cliente
- [x] Gerenciamento de projetos
- [x] Sistema de mensagens
- [x] Upload de arquivos
- [x] Feedback e aprovações
- [x] Painel administrativo
- [x] Real-time updates

### 🔄 Em Desenvolvimento
- [ ] Notificações push
- [ ] Calendário integrado
- [ ] Relatórios avançados
- [ ] App mobile

## 🛠️ Troubleshooting

### Problema: Erro de Autenticação
**Solução**: Verifique se as URLs estão configuradas corretamente no Supabase

### Problema: Upload de Arquivos Falha
**Solução**: Certifique-se de que o bucket `project-files` foi criado e é público

### Problema: Real-time Não Funciona
**Solução**: Verifique se a replicação está habilitada para as tabelas

### Problema: Dados Não Aparecem
**Solução**: Execute os scripts SQL na ordem correta e verifique as políticas RLS

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🔒 Segurança

### Implementado
- Row Level Security (RLS)
- Autenticação JWT
- Políticas de acesso granular
- Validação de inputs
- Sanitização de dados

### Recomendações
- Use HTTPS em produção
- Configure rate limiting
- Monitore logs de acesso
- Faça backups regulares

## 📈 Performance

### Otimizações Implementadas
- Lazy loading de componentes
- Paginação inteligente
- Cache de dados
- Compressão de imagens

### Métricas Esperadas
- Tempo de carregamento: < 2s
- First Contentful Paint: < 1s
- Time to Interactive: < 3s

## 🎨 Customização

### Cores e Tema
As cores podem ser customizadas em:
- `src/types/client-dashboard.ts` (STATUS_COLORS)
- `tailwind.config.js` (tema global)

### Componentes
Todos os componentes estão em:
- `src/components/ClientDashboard/`

### API
Todas as funções de API estão em:
- `src/lib/client-dashboard-api.ts`

## 📞 Suporte

Para suporte técnico:
- Email: hello@devtone.agency
- Documentação: Ver `CLIENT_DASHBOARD_SYSTEM.md`
- Issues: GitHub repository

---

**Sistema pronto para produção!** 🚀

Desenvolvido com ❤️ pela DevTone Agency
