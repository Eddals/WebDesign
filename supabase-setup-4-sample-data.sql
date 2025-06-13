-- EXECUTE NO SQL EDITOR DO SUPABASE - PARTE 4: DADOS DE EXEMPLO
-- DevTone Agency - Sample Data for Testing

-- =====================================================
-- DADOS DE EXEMPLO PARA TESTE
-- =====================================================

-- Inserir usuários de exemplo
INSERT INTO client_users (id, email, full_name, company_name, phone, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@techstartup.com', 'John Doe', 'Tech Startup Inc', '+1-555-0101', 'client', true),
('550e8400-e29b-41d4-a716-446655440002', 'sarah.wilson@retailco.com', 'Sarah Wilson', 'Retail Co', '+1-555-0102', 'client', true),
('550e8400-e29b-41d4-a716-446655440003', 'admin@devtone.agency', 'DevTone Admin', 'DevTone Agency', '+1-555-0100', 'admin', true);

-- Inserir clientes de exemplo
INSERT INTO clients (id, user_id, company_name, industry, website_url, address, city, state, country, business_description) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Tech Startup Inc', 'Technology', 'https://techstartup.com', '123 Innovation Drive', 'San Francisco', 'CA', 'USA', 'Innovative tech solutions for modern businesses'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Retail Co', 'E-commerce', 'https://retailco.com', '456 Commerce Street', 'New York', 'NY', 'USA', 'Premium retail products and services');

-- Inserir projetos de exemplo
INSERT INTO projects (id, client_id, title, description, project_type, status, priority, budget, start_date, estimated_completion_date, progress_percentage) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Corporate Website Redesign', 'Complete redesign of the company website with modern UI/UX', 'website', 'in_progress', 'high', 15000.00, '2024-01-15', '2024-03-15', 65),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Mobile App Development', 'Native mobile application for iOS and Android', 'app', 'planning', 'medium', 25000.00, '2024-02-01', '2024-06-01', 15),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'E-commerce Platform', 'Full-featured e-commerce website with payment integration', 'ecommerce', 'in_progress', 'high', 20000.00, '2024-01-01', '2024-04-01', 45);

-- Inserir marcos de exemplo
INSERT INTO project_milestones (id, project_id, title, description, status, due_date, order_index, deliverables, is_billable, amount) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Design Phase', 'UI/UX design and wireframes', 'completed', '2024-02-01', 1, ARRAY['Wireframes', 'Design mockups', 'Style guide'], true, 5000.00),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', 'Development Phase', 'Frontend and backend development', 'in_progress', '2024-02-28', 2, ARRAY['Frontend development', 'Backend API', 'Database setup'], true, 8000.00),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Testing & Launch', 'Quality assurance and deployment', 'pending', '2024-03-15', 3, ARRAY['Testing', 'Bug fixes', 'Deployment'], true, 2000.00),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', 'E-commerce Setup', 'Product catalog and payment integration', 'in_progress', '2024-02-15', 1, ARRAY['Product catalog', 'Payment gateway', 'Shopping cart'], true, 8000.00);

-- Inserir tarefas de exemplo
INSERT INTO project_tasks (id, project_id, milestone_id, title, description, status, priority, assigned_to, estimated_hours, due_date) VALUES
('990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'Homepage Development', 'Develop responsive homepage with hero section', 'completed', 'high', 'Alex Rodriguez', 16, '2024-02-10'),
('990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'Contact Form Integration', 'Implement contact form with validation', 'in_progress', 'medium', 'Maria Silva', 8, '2024-02-20'),
('990e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'SEO Optimization', 'Implement SEO best practices', 'todo', 'medium', 'David Chen', 12, '2024-02-25'),
('990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', 'Product Catalog Setup', 'Configure product categories and listings', 'in_progress', 'high', 'Sarah Johnson', 20, '2024-02-12');

-- Inserir feedbacks de exemplo
INSERT INTO client_feedbacks (id, project_id, milestone_id, client_id, feedback_type, subject, message, status, priority) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'approval', 'Design Approval', 'The design looks fantastic! I love the modern approach and color scheme. Please proceed with development.', 'reviewed', 'medium'),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'revision', 'Homepage Feedback', 'The homepage looks great, but could we make the hero section a bit larger and add our company video?', 'pending', 'medium'),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'general', 'Product Categories', 'We need to add a few more product categories. Can we schedule a call to discuss this?', 'pending', 'low');

-- Inserir arquivos de exemplo
INSERT INTO project_files (id, project_id, milestone_id, uploaded_by_client_id, file_name, file_type, file_size, file_url, file_category, description, is_public, version) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'company-logo.png', 'image/png', 245760, 'https://via.placeholder.com/400x200/6366f1/ffffff?text=Company+Logo', 'assets', 'Official company logo in high resolution', true, 1),
('bb0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'brand-guidelines.pdf', 'application/pdf', 1048576, 'https://via.placeholder.com/400x200/10b981/ffffff?text=Brand+Guidelines', 'documents', 'Complete brand guidelines and style guide', true, 1),
('bb0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'product-images.zip', 'application/zip', 5242880, 'https://via.placeholder.com/400x200/f59e0b/ffffff?text=Product+Images', 'assets', 'High-quality product images for e-commerce', true, 1);

-- Inserir comentários de exemplo
INSERT INTO client_comments (id, project_id, client_id, message, sender_type, sender_name, is_read) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Hi team! Just wanted to check on the progress of the homepage development. Looking forward to seeing the updates.', 'client', 'John Doe', true),
('cc0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', NULL, 'Hi John! The homepage is coming along great. We''ve implemented the hero section and are working on the contact form. Should have an update for you by end of week.', 'admin', 'DevTone Team', false),
('cc0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'The product catalog is looking amazing! Can we add a wishlist feature as well?', 'client', 'Sarah Wilson', false),
('cc0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', NULL, 'Absolutely! We can add the wishlist feature. It will be included in the next milestone. Thanks for the suggestion!', 'admin', 'DevTone Team', false);

-- Atualizar datas de conclusão para itens completados
UPDATE project_milestones SET completion_date = '2024-01-28' WHERE status = 'completed';
UPDATE project_tasks SET completion_date = '2024-02-08', actual_hours = 14 WHERE status = 'completed';

-- Atualizar respostas de admin para feedbacks revisados
UPDATE client_feedbacks SET 
    admin_response = 'Thank you for the approval! We''re excited to move forward with the development phase.',
    admin_responded_by = 'DevTone Team',
    admin_responded_at = NOW()
WHERE status = 'reviewed';

-- =====================================================
-- CRIAR USUÁRIO ADMIN PADRÃO
-- =====================================================

-- Função para criar usuário admin (execute após configurar auth)
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS TEXT AS $$
BEGIN
  -- Esta função deve ser executada após configurar a autenticação
  -- O usuário admin será criado via interface do Supabase Auth
  RETURN 'Admin user should be created via Supabase Auth interface with email: admin@devtone.agency';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICAÇÃO DE DADOS
-- =====================================================

-- Verificar se os dados foram inseridos corretamente
DO $$
DECLARE
  user_count INTEGER;
  client_count INTEGER;
  project_count INTEGER;
  milestone_count INTEGER;
  task_count INTEGER;
  feedback_count INTEGER;
  file_count INTEGER;
  comment_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM client_users;
  SELECT COUNT(*) INTO client_count FROM clients;
  SELECT COUNT(*) INTO project_count FROM projects;
  SELECT COUNT(*) INTO milestone_count FROM project_milestones;
  SELECT COUNT(*) INTO task_count FROM project_tasks;
  SELECT COUNT(*) INTO feedback_count FROM client_feedbacks;
  SELECT COUNT(*) INTO file_count FROM project_files;
  SELECT COUNT(*) INTO comment_count FROM client_comments;
  
  RAISE NOTICE '✅ Dados de exemplo inseridos com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Resumo dos dados:';
  RAISE NOTICE '👥 Usuários: %', user_count;
  RAISE NOTICE '🏢 Clientes: %', client_count;
  RAISE NOTICE '📁 Projetos: %', project_count;
  RAISE NOTICE '🎯 Marcos: %', milestone_count;
  RAISE NOTICE '✅ Tarefas: %', task_count;
  RAISE NOTICE '💬 Feedbacks: %', feedback_count;
  RAISE NOTICE '📎 Arquivos: %', file_count;
  RAISE NOTICE '💭 Comentários: %', comment_count;
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Sistema pronto para uso!';
  RAISE NOTICE '';
  RAISE NOTICE '🔗 Acesse: /client-portal para testar';
  RAISE NOTICE '👤 Crie uma conta ou use os dados de exemplo';
  RAISE NOTICE '📧 Emails de exemplo: john.doe@techstartup.com, sarah.wilson@retailco.com';
END $$;
