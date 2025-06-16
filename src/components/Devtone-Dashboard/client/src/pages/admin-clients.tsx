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
import { Users, Search, Mail, Building, Calendar, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@dashboard/components/ui/dropdown-menu";

export default function AdminClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
    retry: false,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "User has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (socket && isConnected) {
      const handleUserUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["/api/users"] });
        if (data.type === "user_registered") {
          toast({
            title: "New User Registered",
            description: `${data.user.firstName} ${data.user.lastName} just signed up`,
          });
        }
      };

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "user_update" || data.type === "user_registered") {
          handleUserUpdate(data);
        }
      });
    }
  }, [socket, isConnected, queryClient, toast]);

  const filteredUsers = users.filter((user: any) =>
    user.role === "client" &&
    (user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.company?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation user={user} isAdmin={true} />
        <div className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading clients...</div>
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
              <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
              <p className="text-gray-400">Manage and monitor all registered clients</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                {isConnected ? "Live" : "Offline"}
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {filteredUsers.length} Clients
              </Badge>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((client: any) => (
            <Card key={client.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">
                        {client.firstName} {client.lastName}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">{client.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem
                        onClick={() => deleteUserMutation.mutate(client.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {client.company && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{client.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    Joined {new Date(client.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-2">
                  <Badge 
                    variant={client.role === "admin" ? "default" : "secondary"}
                    className={client.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}
                  >
                    {client.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No clients found</h3>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search criteria" : "No clients have registered yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}