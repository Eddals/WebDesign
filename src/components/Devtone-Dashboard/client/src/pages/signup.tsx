import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users } from "lucide-react";
import logoPath from "@assets/Marketing Site Launch Website (1)_1750102650283.png";

const clientSignupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  projectDescription: z.string().min(10, "Please provide more details about your project"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const adminSignupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  adminCode: z.string().min(1, "Admin code is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
  const [activeTab, setActiveTab] = useState("client");
  const { toast } = useToast();

  const clientForm = useForm({
    resolver: zodResolver(clientSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      projectDescription: "",
      password: "",
    },
  });

  const adminForm = useForm({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      adminCode: "",
      password: "",
    },
  });

  const clientSignupMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/auth/signup", {
        ...data,
        role: "client",
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Registration Successful",
        description: "Please proceed to sign in with your account.",
      });
      clientForm.reset();
      // Redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const adminSignupMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.adminCode !== "DEVTONEADMINS") {
        throw new Error("Invalid admin code");
      }
      return await apiRequest("POST", "/api/auth/signup", {
        ...data,
        role: "admin",
      });
    },
    onSuccess: (response) => {
      toast({
        title: "Admin Registration Successful",
        description: "Please proceed to sign in with your admin account.",
      });
      adminForm.reset();
      // Redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    },
  });

  const handleClientSubmit = (data: any) => {
    clientSignupMutation.mutate(data);
  };

  const handleAdminSubmit = (data: any) => {
    adminSignupMutation.mutate(data);
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-[#030718] bg-gradient-to-br from-[#030718] via-purple-900/30 to-[#030718] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section with Creative Effects */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="relative">
              <img
                src={logoPath}
                alt="Devtone Agency"
                className="w-24 h-24 mx-auto animate-bounce-slow hover:scale-110 transition-all duration-500 drop-shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))',
                  animation: 'glow 2s ease-in-out infinite alternate'
                }}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 tracking-wider">
            DEVTONE
          </h1>
          <p className="text-purple-300 text-sm">Join Our Agency Platform</p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-white">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm border-white/20 rounded-full">
                <TabsTrigger 
                  value="client" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 text-gray-300 data-[state=active]:text-white transition-all duration-300 rounded-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Client
                </TabsTrigger>
                <TabsTrigger 
                  value="admin"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-700 text-gray-300 data-[state=active]:text-white transition-all duration-300 rounded-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="client" className="mt-6">
                <Form {...clientForm}>
                  <form onSubmit={clientForm.handleSubmit(handleClientSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={clientForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                                placeholder="John"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={clientForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                                placeholder="Doe"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={clientForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="john@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Company Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="Your Company Ltd."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Project Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="Tell us about your project requirements..."
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clientForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="Create a secure password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 py-3 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                      disabled={clientSignupMutation.isPending}
                    >
                      {clientSignupMutation.isPending ? "Creating Account..." : "Create Client Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-6">
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(handleAdminSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={adminForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">First Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                                placeholder="Admin"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={adminForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Last Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                                placeholder="User"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="admin@devtone.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="adminCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Admin Access Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="Enter admin code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                              placeholder="Create a secure password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-amber-300 text-sm">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Admin registration requires a valid access code.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 py-3 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                      disabled={adminSignupMutation.isPending}
                    >
                      {adminSignupMutation.isPending ? "Creating Account..." : "Create Admin Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm mb-3">Already have an account?</p>
              <Button 
                variant="outline" 
                onClick={handleLogin}
                className="w-full border-gray-600 text-gray-300 hover:bg-[hsl(249,57%,14%)] hover:text-white"
              >
                Sign In Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}