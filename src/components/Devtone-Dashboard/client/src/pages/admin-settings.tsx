import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboard/components/ui/card";
import { Button } from "@dashboard/components/ui/button";
import { Badge } from "@dashboard/components/ui/badge";
import { Input } from "@dashboard/components/ui/input";
import { Label } from "@dashboard/components/ui/label";
import { Switch } from "@dashboard/components/ui/switch";
import { Textarea } from "@dashboard/components/ui/textarea";
import { useToast } from "@dashboard/hooks/use-toast";
import { useWebSocket } from "@dashboard/hooks/useWebSocket";
import { useAuth } from "@dashboard/hooks/useAuth";
import Navigation from "@dashboard/components/layout/Navigation";
import { Settings, Save, Shield, Bell, Database, Globe, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@dashboard/components/ui/tabs";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    companyName: "Devtone Agency",
    companyEmail: "admin@devtone.com",
    companyAddress: "",
    allowClientRegistration: true,
    requireAdminApproval: false,
    enableEmailNotifications: true,
    enableSlackIntegration: false,
    maxProjectsPerClient: 10,
    defaultProjectStatus: "planning",
    maintenanceMode: false,
    backupFrequency: "daily",
    sessionTimeout: 24,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { socket, isConnected } = useWebSocket();

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    retry: false,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settingsData: typeof settings) => {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation user={user} isAdmin={true} />
      
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
              <p className="text-gray-400">Configure and manage your Devtone platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                {isConnected ? "Live" : "Offline"}
              </Badge>
              <Button 
                onClick={handleSaveSettings}
                disabled={saveSettingsMutation.isPending}
                className="bg-primary hover:bg-secondary"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveSettingsMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-primary">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-primary">
              <Database className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyEmail" className="text-gray-300">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={settings.companyEmail}
                      onChange={(e) => handleInputChange("companyEmail", e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="companyAddress" className="text-gray-300">Company Address</Label>
                  <Textarea
                    id="companyAddress"
                    value={settings.companyAddress}
                    onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Client Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Allow Client Registration</Label>
                    <p className="text-sm text-gray-500">Enable new clients to register accounts</p>
                  </div>
                  <Switch
                    checked={settings.allowClientRegistration}
                    onCheckedChange={(checked) => handleInputChange("allowClientRegistration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Require Admin Approval</Label>
                    <p className="text-sm text-gray-500">New registrations need admin approval</p>
                  </div>
                  <Switch
                    checked={settings.requireAdminApproval}
                    onCheckedChange={(checked) => handleInputChange("requireAdminApproval", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxProjects" className="text-gray-300">Max Projects per Client</Label>
                  <Input
                    id="maxProjects"
                    type="number"
                    value={settings.maxProjectsPerClient}
                    onChange={(e) => handleInputChange("maxProjectsPerClient", parseInt(e.target.value))}
                    className="bg-gray-700 border-gray-600 text-white max-w-xs"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout" className="text-gray-300">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange("sessionTimeout", parseInt(e.target.value))}
                    className="bg-gray-700 border-gray-600 text-white max-w-xs"
                  />
                  <p className="text-sm text-gray-500 mt-1">How long users stay logged in</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Disable client access for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Admin Code Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-amber-300 text-sm">
                    Current admin registration code: <span className="font-mono bg-gray-700 px-2 py-1 rounded">DEVTONEADMINS</span>
                  </p>
                  <p className="text-amber-300/70 text-xs mt-2">
                    Share this code only with trusted team members who need admin access.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email alerts for important events</p>
                  </div>
                  <Switch
                    checked={settings.enableEmailNotifications}
                    onCheckedChange={(checked) => handleInputChange("enableEmailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300">Slack Integration</Label>
                    <p className="text-sm text-gray-500">Send notifications to Slack channels</p>
                  </div>
                  <Switch
                    checked={settings.enableSlackIntegration}
                    onCheckedChange={(checked) => handleInputChange("enableSlackIntegration", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-gray-300 text-sm">Total Clients</div>
                    <div className="text-2xl font-bold text-white">{analytics?.totalClients || 0}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-gray-300 text-sm">Active Projects</div>
                    <div className="text-2xl font-bold text-white">{analytics?.activeProjects || 0}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-gray-300 text-sm">Completed Projects</div>
                    <div className="text-2xl font-bold text-white">{analytics?.completedProjects || 0}</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="text-gray-300 text-sm">Pending Feedback</div>
                    <div className="text-2xl font-bold text-white">{analytics?.pendingFeedback || 0}</div>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Backup Frequency</Label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange("backupFrequency", e.target.value)}
                    className="w-full mt-1 bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}