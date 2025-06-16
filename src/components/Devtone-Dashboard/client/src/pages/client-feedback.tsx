import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboard/components/ui/card";
import { Button } from "@dashboard/components/ui/button";
import { Badge } from "@dashboard/components/ui/badge";
import { Textarea } from "@dashboard/components/ui/textarea";
import { useToast } from "@dashboard/hooks/use-toast";
import { useAuth } from "@dashboard/hooks/useAuth";
import Navigation from "@dashboard/components/layout/Navigation";
import Sidebar from "@dashboard/components/layout/Sidebar";
import FeedbackForm from "@dashboard/components/feedback/FeedbackForm";
import { Activity, MessageSquare, CheckCircle, Clock, Plus, Star, MessageCircleMore } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@dashboard/components/ui/select";

export default function ClientFeedback() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const { data: feedback = [], isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/feedback", selectedProject],
    retry: false,
    enabled: !!selectedProject,
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/messages"],
    retry: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const userProjects = (projects as any[])?.filter((project: any) => project.clientId === user.id) || [];
  const unreadMessages = (messages as any[])?.filter((msg: any) => 
    msg.receiverId === user.id && !msg.isRead
  ).length || 0;

  const sidebarItems = [
    { label: "Dashboard", icon: Activity, href: "/" },
    { label: "Projects", icon: CheckCircle, href: "/client/projects" },
    { label: "Messages", icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined, href: "/client/messages" },
    { label: "Feedback", icon: Clock, active: true, href: "/client/feedback" },
  ];

  const handleFeedbackSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
    toast({
      title: "Feedback submitted",
      description: "Thank you for your feedback! The team will review it shortly.",
    });
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type) {
      case "client_feedback": return "bg-blue-500/20 text-blue-400";
      case "team_comment": return "bg-green-500/20 text-green-400";
      case "status_update": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getFeedbackTypeLabel = (type: string) => {
    switch (type) {
      case "client_feedback": return "Your Feedback";
      case "team_comment": return "Team Response";
      case "status_update": return "Status Update";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation user={user} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Project Feedback</h2>
            <p className="text-gray-400">Share your thoughts and track feedback on your projects.</p>
          </div>

          {projectsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading projects...</p>
            </div>
          ) : userProjects.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-12">
                <MessageCircleMore className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                <p className="text-gray-400 mb-6">
                  You need to have active projects to provide feedback.
                </p>
                <Button 
                  onClick={() => window.location.href = "/client/messages"}
                  className="bg-primary hover:bg-primary/80"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Project Selection & Feedback Form */}
              <div className="lg:col-span-1">
                <Card className="bg-gray-800 border-gray-700 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Give Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Select Project
                      </label>
                      <Select 
                        value={selectedProject?.toString() || ""} 
                        onValueChange={(value) => setSelectedProject(parseInt(value))}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Choose a project..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          {userProjects.map((project: any) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedProject && (
                      <FeedbackForm 
                        projectId={selectedProject} 
                        onSuccess={handleFeedbackSuccess}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Project Overview */}
                {selectedProject && (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const project = userProjects.find((p: any) => p.id === selectedProject);
                        if (!project) return null;
                        
                        return (
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-white">{project.name}</h4>
                              <p className="text-gray-400 text-sm mt-1">
                                {project.description || "No description available"}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">Status</span>
                              <Badge className={
                                project.status === "completed" ? "bg-green-500/20 text-green-400" :
                                project.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                                project.status === "review" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-gray-500/20 text-gray-400"
                              }>
                                {project.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-white">{project.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Feedback History */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700 h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircleMore className="w-5 h-5" />
                      Feedback History
                      {selectedProject && (
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {userProjects.find((p: any) => p.id === selectedProject)?.name}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden">
                    {!selectedProject ? (
                      <div className="text-center py-12">
                        <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">Select a Project</h3>
                        <p className="text-gray-400">Choose a project to view and manage feedback.</p>
                      </div>
                    ) : feedbackLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-300 mt-4">Loading feedback...</p>
                      </div>
                    ) : (feedback as any[]).length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircleMore className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Feedback Yet</h3>
                        <p className="text-gray-400">Be the first to provide feedback on this project!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 h-full overflow-y-auto">
                        {(feedback as any[]).map((item: any) => (
                          <div 
                            key={item.id} 
                            className={`p-4 rounded-lg border ${
                              item.type === "client_feedback" 
                                ? "bg-blue-500/10 border-blue-500/20" 
                                : "bg-gray-700/50 border-gray-600"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getFeedbackTypeColor(item.type)}>
                                  {getFeedbackTypeLabel(item.type)}
                                </Badge>
                                {!item.isRead && item.type !== "client_feedback" && (
                                  <Badge variant="destructive" className="text-xs">New</Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(item.createdAt).toLocaleDateString()} at{' '}
                                {new Date(item.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{item.content}</p>
                            {item.author && (
                              <div className="mt-2 text-xs text-gray-400">
                                by {item.author.firstName} {item.author.lastName}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}