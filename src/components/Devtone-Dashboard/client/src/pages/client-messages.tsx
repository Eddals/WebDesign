import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboard/components/ui/card";
import { Button } from "@dashboard/components/ui/button";
import { Badge } from "@dashboard/components/ui/badge";
import { Input } from "@dashboard/components/ui/input";
import { Textarea } from "@dashboard/components/ui/textarea";
import { useToast } from "@dashboard/hooks/use-toast";
import { useWebSocket } from "@dashboard/hooks/useWebSocket";
import { useAuth } from "@dashboard/hooks/useAuth";
import Navigation from "@dashboard/components/layout/Navigation";
import Sidebar from "@dashboard/components/layout/Sidebar";
import { Send, MessageCircle, Activity, CheckCircle, Clock, Search, Paperclip, Image, FileText, Download, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@dashboard/components/ui/avatar";
import { ScrollArea } from "@dashboard/components/ui/scroll-area";

export default function ClientMessages() {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, toast]);

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", selectedProject],
    retry: false,
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; projectId?: number; fileUrl?: string; fileType?: string; fileName?: string }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      return response.json();
    },
  });

  useEffect(() => {
    if (socket && isConnected) {
      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
          toast({
            title: "New Message",
            description: "You received a new message from the team",
          });
        }
      };

      socket.addEventListener("message", handleMessage);
      return () => socket.removeEventListener("message", handleMessage);
    }
  }, [socket, isConnected, queryClient, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    
    let fileData = null;
    if (selectedFile) {
      try {
        const uploadResult = await uploadFileMutation.mutateAsync(selectedFile);
        fileData = {
          fileUrl: uploadResult.url,
          fileType: selectedFile.type,
          fileName: selectedFile.name,
        };
      } catch (error) {
        toast({
          title: "File upload failed",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }
    }
    
    sendMessageMutation.mutate({
      content: message || `Shared file: ${selectedFile?.name}`,
      projectId: selectedProject || undefined,
      ...fileData,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getUserName = (userId: string) => {
    if (userId === user?.id) return "You";
    return "Team Member";
  };

  const getUserInitials = (userId: string) => {
    if (userId === user?.id) return user.firstName?.[0] || 'Y';
    return 'T';
  };

  const filteredMessages = (messages as any[]).filter((msg: any) => {
    if (selectedProject) {
      return msg.projectId === selectedProject;
    } else {
      return !msg.projectId && !msg.receiverId;
    }
  }).filter((msg: any) => {
    return msg.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const userProjects = (projects as any[])?.filter((project: any) => project.clientId === user?.id) || [];
  const unreadMessages = (messages as any[])?.filter((msg: any) => 
    msg.receiverId === user?.id && !msg.isRead
  ).length || 0;

  const sidebarItems = [
    { label: "Dashboard", icon: Activity, href: "/" },
    { label: "Projects", icon: CheckCircle, href: "/client/projects" },
    { label: "Messages", icon: MessageCircle, active: true, badge: unreadMessages > 0 ? unreadMessages : undefined, href: "/client/messages" },
    { label: "Feedback", icon: Clock, href: "/client/feedback" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation user={user} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Messages</h2>
            <p className="text-gray-400">Communicate with your project team in real-time.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Project Channels */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800 border-gray-700 h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {/* General Chat */}
                      <Button
                        variant={selectedProject === null ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedProject(null)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        General Chat
                        <Badge variant="secondary" className="ml-auto">
                          {(messages as any[]).filter((m: any) => !m.projectId && !m.receiverId).length}
                        </Badge>
                      </Button>

                      {/* Project Channels */}
                      <div className="pt-2">
                        <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Your Projects</h4>
                        {userProjects.map((project: any) => (
                          <Button
                            key={project.id}
                            variant={selectedProject === project.id ? "default" : "ghost"}
                            className="w-full justify-start mb-1"
                            onClick={() => setSelectedProject(project.id)}
                          >
                            <MessageCircle className="w-3 h-3 mr-2" />
                            <span className="truncate text-xs">{project.name}</span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {(messages as any[]).filter((m: any) => m.projectId === project.id).length}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Messages */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-800 border-gray-700 h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {selectedProject 
                        ? userProjects.find((p: any) => p.id === selectedProject)?.name || "Project Chat"
                        : "General Chat"
                      }
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        {isConnected ? "Live" : "Offline"}
                      </Badge>
                      <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search messages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
                    {messagesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-300 mt-4">Loading messages...</p>
                      </div>
                    ) : filteredMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      filteredMessages.map((msg: any) => (
                        <div key={msg.id} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {getUserInitials(msg.senderId)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">
                                {getUserName(msg.senderId)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-300">{msg.content}</div>
                            
                            {/* File Attachment Display */}
                            {msg.fileUrl && (
                              <div className="mt-2">
                                {msg.fileType?.startsWith('image/') ? (
                                  <div className="relative max-w-xs">
                                    <img 
                                      src={msg.fileUrl} 
                                      alt={msg.fileName}
                                      className="rounded-lg max-h-48 object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-6 w-6 p-0"
                                        onClick={() => window.open(msg.fileUrl, '_blank')}
                                      >
                                        <Download className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg max-w-xs">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs text-gray-300 truncate flex-1">
                                      {msg.fileName}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                      onClick={() => window.open(msg.fileUrl, '_blank')}
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* File Preview */}
                  {selectedFile && (
                    <div className="mb-3 p-3 bg-gray-700 rounded-lg flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-300 flex-1 truncate">
                        {selectedFile.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={removeSelectedFile}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Type a message to the team..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[40px] max-h-[120px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-gray-600 text-gray-300"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={sendMessageMutation.isPending || (!message.trim() && !selectedFile)}
                        className="bg-primary hover:bg-primary/80"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}