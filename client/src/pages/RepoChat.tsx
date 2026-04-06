import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AppNavbar } from "@/components/Navigation";
import { useRepoDetails } from "@/hooks/use-github";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User as UserIcon, Loader2, Code2, ExternalLink, MessageSquare, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ChatMessage } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepoInsights } from "@/components/RepoInsights";

export default function RepoChat() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/chat/:owner/:name");

  const owner = params?.owner || "";
  const name = params?.name || "";

  const { data: repo, isLoading: repoLoading } = useRepoDetails(owner, name);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLocation("/login"); return; }
    if (!match) { setLocation("/search"); return; }
  }, [authLoading, isAuthenticated, match, setLocation]);

  // Welcome message when repo loads
  useEffect(() => {
    if (!repo?.full_name || !isAuthenticated) return;
    setMessages([
      {
        id: "welcome",
        role: "ai",
        content: `Hello! I'm your AI assistant for **${repo.full_name}**. This is a ${repo.language || "code"} repository${repo.description ? ` — ${repo.description}` : ""}. Ask me anything about the code, architecture, or how to use it!`,
        timestamp: Date.now(),
      },
    ]);
  }, [repo?.full_name, isAuthenticated]);

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
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const aiId = (Date.now() + 1).toString();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: repo?.full_name,
          message: input,
          context: `Repository: ${repo?.full_name}\nLanguage: ${repo?.language || "unknown"}\nDescription: ${repo?.description || "No description"}`,
        }),
      });

      const json = await response.json().catch(() => ({}));
      const aiContent = json.reply || json.content || "Sorry, I could not get a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: aiId, role: "ai", content: aiContent, timestamp: Date.now() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: aiId,
          role: "ai",
          content: "Sorry, I had trouble connecting to the AI. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !match || !owner || !name) return null;

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

      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 md:p-6 min-h-0">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-display">{repo?.full_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <TabsList className="bg-white/5 border border-white/10 h-10 p-1 shadow-sm rounded-lg">
                    <TabsTrigger value="chat" className="text-sm font-medium h-8 px-4">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="text-sm font-medium h-8 px-4">
                      <Info className="w-4 h-4 mr-2" />
                      AI Insights
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              {repo?.html_url && (
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="h-8 gap-2 border-white/10 hover:bg-white/5 text-xs">
                    <ExternalLink className="w-3 h-3" />
                    GitHub
                  </Button>
                </a>
              )}
            </div>
          </div>

          <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col m-0 data-[state=inactive]:hidden">
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-6 pr-4 scroll-smooth custom-scrollbar"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-4 max-w-3xl",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                      msg.role === "ai" ? "bg-primary text-primary-foreground" : "bg-white/10"
                    )}
                  >
                    {msg.role === "ai" ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>

                  <div
                    className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "ai"
                        ? "bg-white/5 border border-white/5 rounded-tl-none"
                        : "bg-primary text-primary-foreground rounded-tr-none shadow-lg shadow-primary/10"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              <form onSubmit={handleSend} className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about this repository..."
                  className="h-14 pl-6 pr-14 rounded-2xl bg-white/5 border-white/10 focus:ring-primary/20 text-base shadow-2xl relative"
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="flex-1 overflow-y-auto pr-4 custom-scrollbar m-0 data-[state=inactive]:hidden">
            <RepoInsights
              repoName={repo.full_name}
              description={repo.description}
              language={repo.language}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
