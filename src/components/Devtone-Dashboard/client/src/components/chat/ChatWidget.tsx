import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

export default function ChatWidget() {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["/api/messages"],
    retry: false,
  });

  const { socket, isConnected } = useWebSocket();

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/messages", {
        content,
        isSystemMessage: false,
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      
      // Send via WebSocket for real-time updates
      if (socket && isConnected) {
        socket.send(JSON.stringify({
          type: "new_message",
          message: {
            content: message,
            sender: user,
            timestamp: new Date().toISOString(),
          },
        }));
      }
      
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Team Chat</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full real-time-indicator ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}></div>
          <span className="text-sm text-gray-400">
            {isConnected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>
      
      <ScrollArea className="h-64 mb-4">
        <div className="space-y-3 pr-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading messages...</p>
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg: any) => (
              <div key={msg.id} className="chat-message">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">{getInitials(msg.sender)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {msg.sender?.firstName 
                          ? `${msg.sender.firstName} ${msg.sender.lastName || ''}` 
                          : msg.sender?.email || "Unknown"
                        }
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No messages yet. Start a conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[hsl(249,57%,14%)] border-gray-600 text-white placeholder-gray-400"
          disabled={sendMessageMutation.isPending || !isConnected}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary hover:bg-secondary"
          disabled={sendMessageMutation.isPending || !message.trim() || !isConnected}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
