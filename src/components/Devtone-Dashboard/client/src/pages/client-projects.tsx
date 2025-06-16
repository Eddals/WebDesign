import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@dashboard/hooks/useAuth";
import { useToast } from "@dashboard/hooks/use-toast";
import { isUnauthorizedError } from "@dashboard/lib/authUtils";
import Navigation from "@dashboard/components/layout/Navigation";
import Sidebar from "@dashboard/components/layout/Sidebar";
import ProjectCard from "@dashboard/components/projects/ProjectCard";
import { Activity, MessageSquare, CheckCircle, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboard/components/ui/card";
import { Badge } from "@dashboard/components/ui/badge";
import { Button } from "@dashboard/components/ui/button";

export default function ClientProjects() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const { data: messages } = useQuery({
    queryKey: ["/api/messages"],
    retry: false,
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  const userProjects = (projects as any[])?.filter((project: any) => project.clientId === user.id) || [];
  const unreadMessages = (messages as any[])?.filter((msg: any) => 
    msg.receiverId === user.id && !msg.isRead
  ).length || 0;

  const sidebarItems = [
    { label: "Dashboard", icon: Activity, href: "/" },
    { label: "Projects", icon: CheckCircle, active: true, href: "/client/projects" },
    { label: "Messages", icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined, href: "/client/messages" },
    { label: "Feedback", icon: Clock, href: "/client/feedback" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "in_progress": return "bg-blue-500/20 text-blue-400";
      case "review": return "bg-yellow-500/20 text-yellow-400";
      case "planning": return "bg-gray-500/20 text-gray-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation user={user} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
            <p className="text-gray-400">Track the progress of all your projects with Devtone.</p>
          </div>

          {projectsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading projects...</p>
            </div>
          ) : userProjects.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                <p className="text-gray-400 mb-6">
                  Contact our team to get started with your first project.
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
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {userProjects.map((project: any) => (
                <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description || "No description available"}
                    </p>
                    
                    <div className="space-y-3">
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
                      
                      {project.dueDate && (
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = `/client/feedback?project=${project.id}`}
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Give Feedback
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => window.location.href = "/client/messages"}
                          className="flex-1 bg-primary hover:bg-primary/80"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}