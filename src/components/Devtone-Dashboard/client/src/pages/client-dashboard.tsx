import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@dashboard/hooks/useAuth";
import { useToast } from "@dashboard/hooks/use-toast";
import { isUnauthorizedError } from "@dashboard/lib/authUtils";
import Navigation from "@dashboard/components/layout/Navigation";
import Sidebar from "@dashboard/components/layout/Sidebar";
import StatsCard from "@dashboard/components/analytics/StatsCard";
import ProjectCard from "@dashboard/components/projects/ProjectCard";
import ChatWidget from "@dashboard/components/chat/ChatWidget";
import { Activity, MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function ClientDashboard() {
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

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages"],
    retry: false,
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status === "in_progress" || p.status === "review") || [];
  const completedProjects = projects?.filter((p: any) => p.status === "completed") || [];
  const pendingFeedback = projects?.filter((p: any) => p.status === "review") || [];
  const unreadMessages = messages?.length || 0;

  const sidebarItems = [
    { label: "Dashboard", icon: Activity, active: true, href: "/" },
    { label: "Projects", icon: CheckCircle, href: "/client/projects" },
    { label: "Messages", icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined, href: "/client/messages" },
    { label: "Feedback", icon: Clock, href: "/client/feedback" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation user={user} />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.firstName || "Client"}!
            </h2>
            <p className="text-gray-400">Here's what's happening with your projects today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Active Projects"
              value={activeProjects.length}
              icon={Activity}
              color="primary"
            />
            <StatsCard
              title="Completed"
              value={completedProjects.length}
              icon={CheckCircle}
              color="green"
            />
            <StatsCard
              title="Pending Feedback"
              value={pendingFeedback.length}
              icon={Clock}
              color="amber"
            />
            <StatsCard
              title="Messages"
              value={unreadMessages}
              icon={MessageSquare}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Projects */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Current Projects</h3>
                <button className="text-primary hover:text-secondary text-sm">View All</button>
              </div>
              
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading projects...</p>
                  </div>
                ) : projects && projects.length > 0 ? (
                  projects.slice(0, 3).map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No projects found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Widget */}
            <ChatWidget />
          </div>

          {/* Recent Updates */}
          <div className="mt-6 glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Updates & Feedback</h3>
            
            <div className="space-y-4">
              {projects && projects.length > 0 ? (
                projects.slice(0, 2).map((project: any) => (
                  <div key={project.id} className="bg-[hsl(249,57%,14%)] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white">Project Update</span>
                          <span className="text-xs text-gray-400">{project.name}</span>
                          <span className="text-xs text-gray-500">• Recently updated</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          Project status: {project.status.replace('_', ' ')} - {project.progress}% complete
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="text-primary hover:text-secondary text-sm font-medium">View Details</button>
                          <button className="text-green-400 hover:text-green-300 text-sm font-medium">Provide Feedback</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent updates</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
