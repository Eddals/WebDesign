import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import logoPath from "@assets/Marketing Site Launch Website (1)_1750102650283.png";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async (data: SignInFormData) => {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Invalid email or password");
      }
      return response.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Sign In Successful",
        description: "Welcome back! Redirecting to your dashboard...",
      });
      // Redirect to appropriate dashboard based on user role
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    onError: (error) => {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignInFormData) => {
    setIsLoading(true);
    signInMutation.mutate(data);
    setIsLoading(false);
  };

  const handleOAuthSignIn = () => {
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
          <p className="text-purple-300 text-sm">Digital Excellence</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-300 backdrop-blur-sm focus:border-purple-400 focus:ring-purple-400/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading || signInMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 py-3 px-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                >
                  {isLoading || signInMutation.isPending ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-transparent px-2 text-gray-300">or</span>
              </div>
            </div>

            <Button
              onClick={handleOAuthSignIn}
              variant="outline"
              className="w-full border-white/20 text-gray-300 hover:bg-white/10 hover:text-white py-3 px-4 rounded-full font-medium transition-all duration-300 backdrop-blur-sm"
            >
              Continue with Replit
            </Button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => window.location.href = "/signup"}
                  className="text-primary hover:text-secondary p-0 h-auto font-normal"
                >
                  Sign up here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}