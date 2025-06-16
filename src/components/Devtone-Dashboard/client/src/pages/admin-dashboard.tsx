import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@dashboard/hooks/useAuth";
import { useToast } from "@dashboard/hooks/use-toast";
import { isUnauthorizedError } from "@dashboard/lib/authUtils";
import Navigation from "@dashboard/components/layout/Navigation";
import Sidebar from "@dashboard/components/layout/Sidebar";
import StatsCard from "@dashboard/components/analytics/StatsCard";
import ProjectForm from "@dashboard/components/projects/ProjectForm";
import { 
  Activity, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Settings,
  CheckCircle,
  DollarSign,
  Zap,
  Plus
} from "lucide-react";
import { Button } from "@dashboard/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@dashboard/components/ui/dialog";

export default function AdminDashboard() {
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

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
    retry: false,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
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

  const sidebarItems = [
    { label: "Analytics", icon: Activity, active: true, href: "/" },
    { label: "Clients", icon: Users, badge: analytics?.totalClients, href: "/admin/clients" },
    { label: "Projects", icon: FolderOpen, badge: analytics?.activeProjects, href: "/admin/projects" },
    { label: "Communications", icon: MessageSquare, badge: analytics?.unreadMessages, href: "/admin/communications" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation 
        user={user} 
        isAdmin={true}
        extra={
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-secondary">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-0">
              <ProjectForm />
            </DialogContent>
          </Dialog>
        }
      />
      
      <div className="flex">
        <Sidebar items={sidebarItems} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
            <p className="text-gray-400">Real-time insights into your agency's performance and client activity.</p>
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <StatsCard
              title="Total Clients"
              value={analytics?.totalClients || 0}
              icon={Users}
              color="primary"
              subtitle="+3 this month"
            />
            <StatsCard
              title="Active Projects"
              value={analytics?.activeProjects || 0}
              icon={FolderOpen}
              color="amber"
              subtitle="2 starting soon"
            />
            <StatsCard
              title="Completed"
              value={analytics?.completedProjects || 0}
              icon={CheckCircle}
              color="green"
              subtitle="+5 this week"
            />
            <StatsCard
              title="Revenue"
              value="$47,850"
              icon={DollarSign}
              color="purple"
              subtitle="+12% from last month"
            />
            <StatsCard
              title="Team Load"
              value="78%"
              icon={Zap}
              color="red"
              subtitle="High capacity"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Clients */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Recent Clients</h3>
                <button className="text-primary hover:text-secondary text-sm">Manage All</button>
              </div>
              
              <div className="space-y-4">
                {analyticsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading clients...</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recent client activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Management */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Project Management</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full real-time-indicator"></div>
                  <span className="text-sm text-gray-400">Live Updates</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading projects...</p>
                  </div>
                ) : projects && projects.length > 0 ? (
                  projects.slice(0, 2).map((project: any) => (
                    <div key={project.id} className="bg-[hsl(249,57%,14%)] rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{project.name}</h4>
                          <p className="text-gray-400 text-sm">Client ID: {project.clientId}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          project.status === 'completed' ? 'bg-green-500 text-white' :
                          project.status === 'in_progress' ? 'bg-amber-500 text-amber-900' :
                          'bg-primary text-white'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-primary hover:bg-secondary px-3 py-1 rounded text-xs font-medium transition-colors">
                          Update Status
                        </button>
                        <button className="bg-[hsl(249,57%,14%)] hover:bg-gray-600 px-3 py-1 rounded text-xs transition-colors border border-gray-600">
                          Send Update
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No projects found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Real-time Activity Feed</h3>
              <div className="flex items-center space-x-4">
                <button className="text-primary hover:text-secondary text-sm">Filter</button>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full real-time-indicator"></div>
                  <span className="text-sm text-gray-400">WebSocket Connected</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-gray-400">No recent activity</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
