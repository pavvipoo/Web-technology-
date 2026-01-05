import { useState, useEffect, useRef, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppNavbar } from "@/components/Navigation";
import { useRepoDetails } from "@/hooks/use-github";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User as UserIcon, Loader2, Code2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ChatMessage } from "@shared/schema";

export default function RepoChat() {
  // === STEP 1: CALL ALL HOOKS FIRST ===
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/chat/:owner/:name");
  
  // Safely extract params
  const owner = params?.owner || "";
  const name = params?.name || "";
  
  // Query hook ALWAYS called
  const { data: repo, isLoading: repoLoading } = useRepoDetails(owner, name);
  
  // All state hooks
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // === STEP 2: GUARD EFFECTS (CHECKS AFTER ALL HOOKS) ===
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (!match) {
      setLocation("/search");
      return;
    }
  }, [authLoading, isAuthenticated, match, setLocation]);

  // === STEP 3: BUSINESS LOGIC EFFECTS ===
  useEffect(() => {
    if (repo && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "ai",
          content: `Hello! I've analyzed the codebase for ${repo.full_name}. Ask me anything about the architecture, functions, or specific files.`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [repo?.full_name]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Call real Gemini API with repo context
      const context = `Repository: ${repo?.full_name}
Language: ${repo?.language || "unknown"}
Description: ${repo?.description || "No description"}
URL: ${repo?.html_url}

User question: ${input}

Please provide a helpful answer about this repository.`;

      // Call the configured RepoChat function (Supabase Edge Function)
      const REPOCHAT_URL = import.meta.env.VITE_REPOCHAT_URL || "/api/chat";
      const response = await fetch(REPOCHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: context }),
      });

      if (!response.ok) {
        // Try to extract error details from JSON or text to display to user and aid debugging
        let details = "";
        try {
          const j = await response.json().catch(() => null);
          if (j && j.error) details = typeof j.error === "string" ? j.error : JSON.stringify(j.error);
          else if (j && j.details) details = typeof j.details === "string" ? j.details : JSON.stringify(j.details);
        } catch {}
        if (!details) {
          try {
            details = await response.text();
          } catch {}
        }
        throw new Error(`Upstream error: ${response.status} ${details}`);
      }

      const contentType = response.headers.get("content-type") || "";

      // Prepare a streaming AI message so UI can update incrementally
      const aiId = (Date.now() + 1).toString();
      const initialAiMsg: ChatMessage = { id: aiId, role: "ai", content: "", timestamp: Date.now() };
      setMessages((prev) => [...prev, initialAiMsg]);

      if (contentType.includes("text/event-stream") || contentType.includes("stream") || response.body) {
        // Streamed response: read chunks and append to the last AI message
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let aiContent = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n");
          buffer = parts.pop() || ""; // keep last partial

          for (const part of parts) {
            const line = part.trim();
            if (!line) continue;

            // support SSE 'data: {...}' lines
            if (line.startsWith("data: ")) {
              const payload = line.slice(6).trim();
              try {
                const parsed = JSON.parse(payload);
                if (parsed.content) {
                  aiContent += parsed.content;
                }
              } catch {
                aiContent += payload;
              }
            } else {
              // raw chunk
              aiContent += line;
            }
          }

          // update the last AI message
          setMessages((prev) => {
            const copy = [...prev];
            const idx = copy.findIndex((m) => m.id === aiId);
            if (idx !== -1) {
              copy[idx] = { ...copy[idx], content: aiContent };
            }
            return copy;
          });
        }

        // flush remaining buffer
        if (buffer.trim()) {
          let final = buffer;
          if (buffer.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(buffer.slice(6));
              final = parsed.content || "";
            } catch {}
          }
          aiContent += final;
          setMessages((prev) => {
            const copy = [...prev];
            const idx = copy.findIndex((m) => m.id === aiId);
            if (idx !== -1) {
              copy[idx] = { ...copy[idx], content: aiContent };
            }
            return copy;
          });
        }
      } else {
        // Non-streaming fallback: parse JSON { content }
        const json = await response.json().catch(() => ({}));
        const aiContent = json.content || "";
        setMessages((prev) => {
          const copy = [...prev];
          const idx = copy.findIndex((m) => m.id === aiId);
          if (idx !== -1) {
            copy[idx] = { ...copy[idx], content: aiContent };
            return copy;
          }
          return [...prev, { id: aiId, role: "ai", content: aiContent, timestamp: Date.now() }];
        });
      }
    } catch (error) {
        console.error("Error getting AI response:", error);
        const messageText = error instanceof Error ? error.message : String(error);
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `Sorry, I had trouble analyzing the repository: ${messageText}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // === STEP 4: CONDITIONAL RENDER (SAFE - AFTER ALL HOOKS & EFFECTS) ===
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !match || !owner || !name) {
    return null;
  }

  if (repoLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Repository not found</p>
          <Button onClick={() => setLocation("/search")}>Back to Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AppNavbar />
      
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">{repo?.full_name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Codebase Indexed • {repo?.language}
              </p>
            </div>
          </div>
          {repo?.html_url && (
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/5">
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </Button>
            </a>
          )}
        </div>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 pr-4 scroll-smooth"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex gap-4 max-w-3xl",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === "ai" ? "bg-primary text-primary-foreground" : "bg-white/10"
              )}>
                {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === "ai" 
                  ? "bg-white/5 border border-white/5 rounded-tl-none" 
                  : "bg-primary text-primary-foreground rounded-tr-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="pt-6 mt-2">
          <form onSubmit={handleSend} className="relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this repository..."
              className="h-14 pl-6 pr-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 text-base shadow-2xl"
              autoFocus
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-3">
            AI can make mistakes. Please verify important information in the code.
          </p>
        </div>
      </div>
    </div>
  );
}
