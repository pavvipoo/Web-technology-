import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, Send, X, Minimize2, Maximize2, 
  Loader2, Sparkles, User, Database, TrendingUp 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function AdminAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        }),
      });

      if (!response.ok) throw new Error("Failed to connect to AI");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let currentModelMsg: Message = { role: "model", content: "" };
      setMessages((prev) => [...prev, currentModelMsg]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break;
              if (data.content) {
                currentModelMsg.content += data.content;
                setMessages((prev) => [
                  ...prev.slice(0, -1),
                  { ...currentModelMsg }
                ]);
              }
            } catch (e) {
              console.error("Error parsing SSE chunk", e);
            }
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Error: I'm unable to connect to the primary system core. Please check API credentials." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30 group"
            >
              <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-[400px] h-[550px] bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t-white/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">Admin Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Online</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div 
              className="flex-1 p-4 overflow-y-auto" 
              ref={scrollRef}
            >
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full pt-12 text-center px-8">
                     <Bot className="w-16 h-16 text-slate-700 mb-4" />
                     <h4 className="text-white font-bold mb-2">How can I help you, Admin?</h4>
                     <p className="text-xs text-slate-500 leading-relaxed italic">
                       I'm connected to the live system core. I can analyze user growth, calculate AI costs, and audit logs in real-time.
                     </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border border-white/10",
                      msg.role === "user" ? "bg-white/5 text-slate-300" : "bg-blue-600/20 text-blue-400"
                    )}>
                      {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={cn(
                      "max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white/5 text-slate-200 border border-white/5 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Bot size={14} />
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                      <Loader2 size={16} className="animate-spin text-blue-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20">
              <div className="flex gap-2 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask system metrics..."
                  className="bg-black/40 border-white/10 text-white pr-12 h-12 focus:border-blue-500/50"
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 h-9 w-9 p-0 rounded-lg shadow-lg shadow-blue-500/10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
