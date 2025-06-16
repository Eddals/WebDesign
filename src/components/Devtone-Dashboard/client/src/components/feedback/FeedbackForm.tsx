import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFeedbackSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface FeedbackFormProps {
  projectId: number;
  onSuccess?: () => void;
}

export default function FeedbackForm({ projectId, onSuccess }: FeedbackFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      content: "",
      projectId,
      type: "client_feedback" as const,
      isRead: false,
    },
  });

  const createFeedbackMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/feedback", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback", projectId] });
      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createFeedbackMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Your Feedback</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-[hsl(249,57%,14%)] border-gray-600 text-white placeholder-gray-400"
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Feedback Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-[hsl(249,57%,14%)] border-gray-600 text-white">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[hsl(249,57%,14%)] border-gray-600">
                  <SelectItem value="client_feedback">Client Feedback</SelectItem>
                  <SelectItem value="team_comment">Team Comment</SelectItem>
                  <SelectItem value="status_update">Status Update</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-secondary"
          disabled={createFeedbackMutation.isPending}
        >
          {createFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
}
