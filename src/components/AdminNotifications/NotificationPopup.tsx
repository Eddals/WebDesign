import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertTriangle, User, MessageCircle, DollarSign, RefreshCw, Folder } from 'lucide-react';
import {
  AdminNotification,
  adminNotificationService,
  formatNotificationTime,
  getPriorityColor,
  ClientRegistrationData
} from '../../lib/admin-notifications';

interface NotificationPopupProps {
  notification: AdminNotification;
  onClose: () => void;
  onAction: (actionType: string, data?: any) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notification,
  onClose,
  onAction
}) => {
  const [loading, setLoading] = useState(false);
  const [actionResult, setActionResult] = useState<string | null>(null);

  const getIcon = () => {
    switch (notification.type) {
      case 'new_client_registration':
        return <User className="w-6 h-6 text-blue-400" />;
      case 'new_project_request':
        return <Folder className="w-6 h-6 text-green-400" />;
      case 'client_message':
        return <MessageCircle className="w-6 h-6 text-purple-400" />;
      case 'payment_received':
        return <DollarSign className="w-6 h-6 text-green-400" />;
      case 'project_update':
        return <RefreshCw className="w-6 h-6 text-orange-400" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    }
  };

  const handleAction = async (actionType: string, actionData?: any) => {
    setLoading(true);
    setActionResult(null);

    try {
      let success = false;

      switch (actionType) {
        case 'approve_client':
          success = await adminNotificationService.approveClient(
            notification.id,
            notification.client_registration_id!
          );
          setActionResult(success ? 'Cliente aprovado com sucesso!' : 'Erro ao aprovar cliente');
          break;

        case 'reject_client':
          const reason = actionData?.reason || 'Não especificado';
          success = await adminNotificationService.rejectClient(
            notification.id,
            notification.client_registration_id!,
            reason
          );
          setActionResult(success ? 'Cliente rejeitado' : 'Erro ao rejeitar cliente');
          break;

        case 'mark_read':
          success = await adminNotificationService.markAsRead(notification.id);
          setActionResult(success ? 'Marcado como lido' : 'Erro ao marcar como lido');
          break;

        default:
          const actionId = await adminNotificationService.executeAction(
            notification.id,
            actionType,
            actionData || {}
          );
          success = !!actionId;
          setActionResult(success ? 'Ação executada com sucesso!' : 'Erro ao executar ação');
      }

      if (success) {
        onAction(actionType, actionData);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      setActionResult('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const renderClientRegistrationActions = () => {
    const clientData = notification.data as ClientRegistrationData;
    
    return (
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Informações do Cliente</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-purple-200">Nome:</span>
              <span className="text-white">{clientData.user_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Email:</span>
              <span className="text-white">{clientData.user_email}</span>
            </div>
            {clientData.company_name && (
              <div className="flex justify-between">
                <span className="text-purple-200">Empresa:</span>
                <span className="text-white">{clientData.company_name}</span>
              </div>
            )}
            {clientData.phone && (
              <div className="flex justify-between">
                <span className="text-purple-200">Telefone:</span>
                <span className="text-white">{clientData.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-purple-200">Registro:</span>
              <span className="text-white">{formatNotificationTime(clientData.registration_time)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleAction('approve_client')}
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Aprovar</span>
          </button>
          
          <button
            onClick={() => {
              const reason = prompt('Motivo da rejeição:');
              if (reason) {
                handleAction('reject_client', { reason });
              }
            }}
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Rejeitar</span>
          </button>
        </div>

        <button
          onClick={() => handleAction('schedule_call')}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
        >
          Agendar Ligação
        </button>
      </div>
    );
  };

  const renderDefaultActions = () => (
    <div className="flex space-x-3">
      <button
        onClick={() => handleAction('mark_read')}
        disabled={loading}
        className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all disabled:opacity-50"
      >
        Marcar como Lida
      </button>
      
      {notification.action_required && (
        <button
          onClick={() => handleAction(notification.action_type || 'default_action')}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-50"
        >
          Executar Ação
        </button>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      className="fixed bottom-6 right-6 w-96 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl z-50"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div>
            <h3 className="text-white font-semibold text-sm">{notification.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                {notification.priority.toUpperCase()}
              </span>
              <span className="text-purple-200 text-xs">
                {formatNotificationTime(notification.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-purple-100 text-sm mb-4">{notification.message}</p>

        {/* Action Result */}
        {actionResult && (
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <p className="text-white text-sm">{actionResult}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
            <span className="ml-2 text-purple-200 text-sm">Processando...</span>
          </div>
        )}

        {/* Actions */}
        {!loading && !actionResult && (
          <>
            {notification.type === 'new_client_registration' 
              ? renderClientRegistrationActions()
              : renderDefaultActions()
            }
          </>
        )}
      </div>
    </motion.div>
  );
};

// Notification Manager Component
interface NotificationManagerProps {
  isAdmin?: boolean;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ isAdmin = false }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [activeNotification, setActiveNotification] = useState<AdminNotification | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    // Initialize notification service
    adminNotificationService.initialize();

    // Listen for new notifications
    const handleNewNotification = (notification: AdminNotification) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Show popup for high priority notifications
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        setActiveNotification(notification);
      }
    };

    adminNotificationService.on('new_notification', handleNewNotification);

    // Load existing unread notifications
    adminNotificationService.getUnreadNotifications().then(setNotifications);

    // Listen for custom notification events
    const handleCustomNotification = (event: CustomEvent) => {
      setActiveNotification(event.detail);
    };

    window.addEventListener('admin-notification', handleCustomNotification as EventListener);

    return () => {
      adminNotificationService.off('new_notification', handleNewNotification);
      adminNotificationService.cleanup();
      window.removeEventListener('admin-notification', handleCustomNotification as EventListener);
    };
  }, [isAdmin]);

  const handleCloseNotification = () => {
    setActiveNotification(null);
  };

  const handleNotificationAction = (actionType: string, data?: any) => {
    console.log('Ação executada:', actionType, data);
    
    // Remove notification from list if it was marked as read
    if (actionType === 'mark_read' || actionType === 'approve_client' || actionType === 'reject_client') {
      setNotifications(prev => 
        prev.filter(n => n.id !== activeNotification?.id)
      );
    }
  };

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {activeNotification && (
        <NotificationPopup
          notification={activeNotification}
          onClose={handleCloseNotification}
          onAction={handleNotificationAction}
        />
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
