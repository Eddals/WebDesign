import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  FolderOpen,
  User,
  Calendar,
  Paperclip,
  Plus,
  X,
  Check,
  CheckCheck
} from 'lucide-react';
import { commentsService, projectsService, realtimeService } from '../../lib/client-dashboard-api';
import type { ClientComment, Project, AuthSession, CreateCommentForm } from '../../types/client-dashboard';

interface MessagesListProps {
  clientId: string;
  session: AuthSession;
}

const MessagesList: React.FC<MessagesListProps> = ({ clientId, session }) => {
  const [comments, setComments] = useState<ClientComment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [clientId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  useEffect(() => {
    // Set up real-time subscriptions for all projects
    const channels: any[] = [];
    
    projects.forEach(project => {
      const channel = realtimeService.subscribeToProject(project.id, (event) => {
        if (event.table === 'client_comments') {
          loadCommentsForProject(project.id);
        }
      });
      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => {
        realtimeService.unsubscribe(channel);
      });
    };
  }, [projects]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const projectsResponse = await projectsService.getProjects(clientId, undefined, undefined, 1, 50);
      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data.data);
        
        // Load comments for all projects
        const allComments: ClientComment[] = [];
        for (const project of projectsResponse.data.data) {
          const commentsResponse = await commentsService.getComments(project.id);
          if (commentsResponse.success && commentsResponse.data) {
            const commentsWithProject = commentsResponse.data.map(comment => ({
              ...comment,
              project
            }));
            allComments.push(...commentsWithProject);
          }
        }
        
        // Sort by creation date
        allComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setComments(allComments);
        
        // Auto-select first project if available
        if (projectsResponse.data.data.length > 0 && !selectedConversation) {
          setSelectedConversation(projectsResponse.data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommentsForProject = async (projectId: string) => {
    try {
      const commentsResponse = await commentsService.getComments(projectId);
      if (commentsResponse.success && commentsResponse.data) {
        const project = projects.find(p => p.id === projectId);
        const commentsWithProject = commentsResponse.data.map(comment => ({
          ...comment,
          project
        }));
        
        // Update comments for this project
        setComments(prev => {
          const filtered = prev.filter(c => c.project_id !== projectId);
          const updated = [...filtered, ...commentsWithProject];
          return updated.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });
      }
    } catch (error) {
      console.error('Failed to load comments for project:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await commentsService.createComment({
        project_id: selectedConversation,
        message: newMessage.trim(),
        client_id: clientId,
        sender_name: session.user.full_name
      } as CreateCommentForm);
      
      if (response.success && response.data) {
        const project = projects.find(p => p.id === selectedConversation);
        const commentWithProject = { ...response.data, project };
        setComments(prev => [...prev, commentWithProject]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (commentId: string) => {
    try {
      await commentsService.markAsRead(commentId);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, is_read: true } : comment
        )
      );
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (searchTerm) {
      return project.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const selectedProjectComments = comments.filter(comment => 
    comment.project_id === selectedConversation
  );

  const getProjectUnreadCount = (projectId: string) => {
    return comments.filter(comment => 
      comment.project_id === projectId && 
      !comment.is_read && 
      comment.sender_type === 'admin'
    ).length;
  };

  if (loading) {
    return (
      <div className="flex h-[600px]">
        <div className="w-1/3 bg-white/10 backdrop-blur-lg rounded-l-2xl p-4 animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/20 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-r-2xl p-4 animate-pulse">
          <div className="h-full bg-white/20 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Messages</h2>
          <p className="text-purple-200">Communicate with our team about your projects</p>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="flex h-[600px] bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
        {/* Projects Sidebar */}
        <div className="w-1/3 border-r border-white/20 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-white/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto">
            {filteredProjects.map((project) => {
              const unreadCount = getProjectUnreadCount(project.id);
              const isSelected = selectedConversation === project.id;
              
              return (
                <motion.div
                  key={project.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  className={`p-4 border-b border-white/10 cursor-pointer transition-all ${
                    isSelected ? 'bg-purple-600/20 border-l-4 border-l-purple-500' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setSelectedConversation(project.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FolderOpen className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="text-white font-medium truncate">{project.title}</h4>
                        <p className="text-purple-200 text-xs">{project.project_type}</p>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center space-x-3">
                  <FolderOpen className="w-6 h-6 text-purple-400" />
                  <div>
                    <h3 className="text-white font-semibold">
                      {projects.find(p => p.id === selectedConversation)?.title}
                    </h3>
                    <p className="text-purple-200 text-sm">Project Discussion</p>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedProjectComments.length > 0 ? (
                  selectedProjectComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${comment.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          comment.sender_type === 'client'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/10 text-white border border-white/20'
                        }`}
                        onClick={() => {
                          if (comment.sender_type === 'admin' && !comment.is_read) {
                            markAsRead(comment.id);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">{comment.sender_name}</span>
                          <span className="text-xs opacity-70">
                            {new Date(comment.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                        {comment.sender_type === 'client' && (
                          <div className="flex justify-end mt-1">
                            {comment.is_read ? (
                              <CheckCheck className="w-4 h-4 text-green-300" />
                            ) : (
                              <Check className="w-4 h-4 text-white/50" />
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                    <p className="text-purple-200">No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/20">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Select a Project</h3>
                <p className="text-purple-200">Choose a project to start messaging with our team</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesList;
