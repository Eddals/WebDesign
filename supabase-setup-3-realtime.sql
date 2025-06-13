-- EXECUTE NO SQL EDITOR DO SUPABASE - PARTE 3: REALTIME COM LOGICAL REPLICATION
-- DevTone Agency - Realtime Configuration

-- =====================================================
-- HABILITAR REALTIME COM LOGICAL REPLICATION
-- =====================================================

-- Adicionar todas as tabelas à publicação do Realtime
-- Isso habilita Logical Replication automática

ALTER PUBLICATION supabase_realtime ADD TABLE client_users;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE project_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE client_feedbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE project_files;
ALTER PUBLICATION supabase_realtime ADD TABLE client_comments;

-- =====================================================
-- FUNÇÕES DE NOTIFICAÇÃO PARA REALTIME
-- =====================================================

-- Função para notificar mudanças em projetos
CREATE OR REPLACE FUNCTION notify_project_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Notifica sobre mudanças em projetos
  PERFORM pg_notify(
    'project_changes',
    json_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', extract(epoch from now())
    )::text
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar mudanças em comentários
CREATE OR REPLACE FUNCTION notify_comment_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Notifica sobre novas mensagens/comentários
  PERFORM pg_notify(
    'comment_changes',
    json_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', extract(epoch from now())
    )::text
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-- Função para notificar mudanças em feedbacks
CREATE OR REPLACE FUNCTION notify_feedback_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Notifica sobre mudanças em feedbacks
  PERFORM pg_notify(
    'feedback_changes',
    json_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'record', CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE row_to_json(NEW) END,
      'old_record', CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD) ELSE NULL END,
      'timestamp', extract(epoch from now())
    )::text
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS PARA REALTIME
-- =====================================================

-- Triggers para projetos e relacionados
CREATE TRIGGER projects_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION notify_project_changes();

CREATE TRIGGER milestones_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION notify_project_changes();

CREATE TRIGGER tasks_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_tasks
  FOR EACH ROW EXECUTE FUNCTION notify_project_changes();

CREATE TRIGGER files_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON project_files
  FOR EACH ROW EXECUTE FUNCTION notify_project_changes();

-- Triggers para comentários
CREATE TRIGGER comments_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON client_comments
  FOR EACH ROW EXECUTE FUNCTION notify_comment_changes();

-- Triggers para feedbacks
CREATE TRIGGER feedbacks_realtime_trigger
  AFTER INSERT OR UPDATE OR DELETE ON client_feedbacks
  FOR EACH ROW EXECUTE FUNCTION notify_feedback_changes();

-- =====================================================
-- CONFIGURAÇÃO DE STORAGE
-- =====================================================

-- Criar bucket para arquivos de projeto
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-files',
  'project-files',
  true,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed'
  ]
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POLÍTICAS DE STORAGE
-- =====================================================

-- Política para upload de arquivos
CREATE POLICY "Authenticated users can upload project files" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- Política para visualização de arquivos
CREATE POLICY "Authenticated users can view project files" ON storage.objects
FOR SELECT USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- Política para atualização de arquivos
CREATE POLICY "Authenticated users can update project files" ON storage.objects
FOR UPDATE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- Política para exclusão de arquivos
CREATE POLICY "Authenticated users can delete project files" ON storage.objects
FOR DELETE USING (
  auth.role() = 'authenticated' AND
  bucket_id = 'project-files'
);

-- =====================================================
-- FUNÇÕES AUXILIARES PARA DASHBOARD
-- =====================================================

-- Função para obter estatísticas do cliente
CREATE OR REPLACE FUNCTION get_client_dashboard_stats(client_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_projects', (
      SELECT COUNT(*) FROM projects WHERE client_id = client_uuid
    ),
    'active_projects', (
      SELECT COUNT(*) FROM projects 
      WHERE client_id = client_uuid AND status = 'in_progress'
    ),
    'completed_projects', (
      SELECT COUNT(*) FROM projects 
      WHERE client_id = client_uuid AND status = 'completed'
    ),
    'pending_feedbacks', (
      SELECT COUNT(*) FROM client_feedbacks 
      WHERE client_id = client_uuid AND status = 'pending'
    ),
    'unread_messages', (
      SELECT COUNT(*) FROM client_comments 
      WHERE client_id = client_uuid AND sender_type = 'admin' AND is_read = false
    ),
    'upcoming_milestones', (
      SELECT COUNT(*) FROM project_milestones pm
      JOIN projects p ON pm.project_id = p.id
      WHERE p.client_id = client_uuid 
        AND pm.status = 'pending' 
        AND pm.due_date >= CURRENT_DATE
    ),
    'total_files', (
      SELECT COUNT(*) FROM project_files pf
      JOIN projects p ON pf.project_id = p.id
      WHERE p.client_id = client_uuid AND pf.is_public = true
    ),
    'overall_progress', (
      SELECT COALESCE(AVG(progress_percentage), 0)::INTEGER 
      FROM projects WHERE client_id = client_uuid
    )
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MENSAGEM DE CONCLUSÃO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ DevTone Client Dashboard - Realtime configurado com sucesso!';
  RAISE NOTICE '📡 Logical Replication habilitada para todas as tabelas';
  RAISE NOTICE '🔄 Triggers de notificação criados';
  RAISE NOTICE '📁 Storage bucket "project-files" configurado';
  RAISE NOTICE '🔐 Políticas de segurança aplicadas';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Próximo passo: Execute supabase-setup-4-sample-data.sql';
END $$;
