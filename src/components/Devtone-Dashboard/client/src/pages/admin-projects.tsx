import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboard/components/ui/card";
import { Button } from "@dashboard/components/ui/button";
import { Badge } from "@dashboard/components/ui/badge";
import { Input } from "@dashboard/components/ui/input";
import { useToast } from "@dashboard/hooks/use-toast";
import { useWebSocket } from "@dashboard/hooks/useWebSocket";
import { useAuth } from "@dashboard/hooks/useAuth";
import Navigation from "@dashboard/components/layout/Navigation";
import ProjectForm from "@dashboard/components/projects/ProjectForm";
import { Plus, Search, Calendar, User, BarChart3, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dashboard/components/ui/dialog";

export default function AdminProjects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  useEffect(() => {
    if (socket && isConnected) {
      const handleProjectUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        if (data.type === "project_created") {
          toast({
            title: "New Project Created",
            description: `Project "${data.project.name}" has been created`,
          });
        } else if (data.type === "project_updated") {
          toast({
            title: "Project Updated",
            description: `Project "${data.project.name}" has been updated`,
          });
        }
      };

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "project_created" || data.type === "project_updated") {
          handleProjectUpdate(data);
        }
      });
    }
  }, [socket, isConnected, queryClient, toast]);

  const filteredProjects = projects.filter((project: any) =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "bg-blue-500/20 text-blue-400";
      case "in_progress": return "bg-yellow-500/20 text-yellow-400";
      case "review": return "bg-purple-500/20 text-purple-400";
      case "completed": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getClientName = (clientId: string) => {
    const client = users.find((u: any) => u.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation user={user} isAdmin={true} />
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation user={user} isAdmin={true} />
      
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Project Management</h1>
              <p className="text-gray-400">Create and manage all client projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  {isConnected ? "Live" : "Offline"}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {filteredProjects.length} Projects
                </Badge>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Project</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Add a new project for a client with timeline and requirements.
                    </DialogDescription>
                  </DialogHeader>
                  <ProjectForm 
                    onSuccess={() => {
                      setIsCreateDialogOpen(false);
                      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: any) => (
            <Card key={project.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-lg mb-2">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{project.progress}%</div>
                    <div className="text-xs text-gray-400">complete</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                )}
                
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{getClientName(project.clientId)}</span>
                </div>

                {project.startDate && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Started {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {project.dueDate && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "No projects have been created yet"}
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary hover:bg-secondary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}