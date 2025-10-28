import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, Image as ImageIcon, Zap, Loader2, MessageCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "voice" | "image";
}

interface AIChatProps {
  userId: string;
  context?: {
    currentSubject?: string;
    currentTopic?: string;
    recentTest?: string;
  };
  className?: string;
}

export default function AIChat({ userId, context, className }: AIChatProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get chat sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["/api/users", userId, "chat-sessions"],
    queryFn: async () => {
      const response = await apiRequest("GET", `https://asli-stud-back-production.up.railway.app/api/users/${userId}/chat-sessions`);
      return response.json();
    },
  });

  const currentSession = sessions?.[0];
  const messages: Message[] = (currentSession?.messages as Message[]) || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; context?: any }) => {
      const response = await apiRequest("POST", "https://asli-stud-back-production.up.railway.app/api/ai-chat", {
        userId,
        message: data.message,
        context: data.context || context,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "chat-sessions"] });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Image analysis mutation
  const analyzeImageMutation = useMutation({
    mutationFn: async (data: { image: string; context?: string }) => {
      const response = await apiRequest("POST", "https://asli-stud-back-production.up.railway.app/api/ai-chat/analyze-image", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Send the analysis as a message
      sendMessageMutation.mutate({
        message: `Image Analysis: ${data.analysis}`,
        context,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate({ message });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(",")[1]; // Remove data:image/jpeg;base64, prefix
      analyzeImageMutation.mutate({
        image: base64Data,
        context: "Please analyze this educational image and help me understand the concepts.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        sendMessageMutation.mutate({ message: transcript });
      }
    };

    recognition.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-lg">AI Tutor</CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-64 w-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation with your AI tutor!</p>
                <p className="text-sm mt-2">Ask questions, upload images, or use voice input.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-xs ${
                      msg.role === "user" ? "chat-message-user" : "chat-message-ai"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        msg.role === "user" ? "text-primary-200" : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-white">AK</span>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {(sendMessageMutation.isPending || analyzeImageMutation.isPending) && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="chat-message-ai">
                  <p className="text-sm">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Context Display */}
        {context && (context.currentSubject || context.currentTopic) && (
          <div className="flex flex-wrap gap-2">
            {context.currentSubject && (
              <Badge variant="outline">Subject: {context.currentSubject}</Badge>
            )}
            {context.currentTopic && (
              <Badge variant="outline">Topic: {context.currentTopic}</Badge>
            )}
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything about your studies..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              size="icon"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleVoiceInput}
              disabled={isListening || sendMessageMutation.isPending}
              className="flex-1"
            >
              {isListening ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Mic className="w-4 h-4 mr-2" />
              )}
              {isListening ? "Listening..." : "Voice"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={analyzeImageMutation.isPending}
              className="flex-1"
            >
              {analyzeImageMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4 mr-2" />
              )}
              Image
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
