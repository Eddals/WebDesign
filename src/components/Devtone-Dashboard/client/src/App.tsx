import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Signup from "@/pages/signup";
import SignIn from "@/pages/signin";
import ClientDashboard from "@/pages/client-dashboard";
import ClientProjects from "@/pages/client-projects";
import ClientMessages from "@/pages/client-messages";
import ClientFeedback from "@/pages/client-feedback";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminClients from "@/pages/admin-clients";
import AdminProjects from "@/pages/admin-projects";
import AdminCommunications from "@/pages/admin-communications";
import AdminSettings from "@/pages/admin-settings";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Devtone</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={SignIn} />
        </>
      ) : (
        <>
          {(user as any)?.role === "admin" ? (
            <>
              <Route path="/" component={AdminDashboard} />
              <Route path="/admin/clients" component={AdminClients} />
              <Route path="/admin/projects" component={AdminProjects} />
              <Route path="/admin/communications" component={AdminCommunications} />
              <Route path="/admin/settings" component={AdminSettings} />
            </>
          ) : (
            <>
              <Route path="/" component={ClientDashboard} />
              <Route path="/client/projects" component={ClientProjects} />
              <Route path="/client/messages" component={ClientMessages} />
              <Route path="/client/feedback" component={ClientFeedback} />
            </>
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen dark">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
