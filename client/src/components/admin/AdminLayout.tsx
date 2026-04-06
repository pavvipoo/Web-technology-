import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, Brain, Shield, BarChart3, Database, 
  Settings, Bell, LogOut, Menu, X, Rocket, Activity, 
  Search, Bookmark, Terminal, Layers, Globe, Zap, Cpu
} from "lucide-react";
import { useAdminStore } from "@/stores/useAdminStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import AdminAIAssistant from "./AdminAIAssistant";

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "ai", label: "AI Usage", icon: Brain, href: "/admin/ai-usage" },
  { id: "repos", label: "Repositories", icon: Rocket, href: "/admin/repos" },
  { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { id: "security", label: "Security", icon: Shield, href: "/admin/security" },
  { id: "api", label: "API Monitor", icon: Activity, href: "/admin/api-monitor" },
  { id: "logs", label: "System Logs", icon: Terminal, href: "/admin/logs" },
  { id: "roles", label: "Roles", icon: Layers, href: "/admin/roles" },
  { id: "notifications", label: "Notifications", icon: Bell, href: "/admin/notifications" },
  { id: "database", label: "Database", icon: Database, href: "/admin/database" },
  { id: "content", label: "CMS Lite", icon: Globe, href: "/admin/content" },
  { id: "ai-assistant", label: "AI Assistant", icon: Cpu, href: "/admin/ai-assistant" },
  { id: "monetization", label: "Monetization", icon: Zap, href: "/admin/monetization" },
  { id: "ui-custom", label: "UI Settings", icon: Settings, href: "/admin/ui-settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { logout, admin } = useAdminStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar - Glassmorphism */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className={cn(
          "relative flex flex-col h-full border-r border-white/5 bg-black/40 backdrop-blur-xl z-50 transition-all duration-300",
          !isSidebarOpen && "items-center"
        )}
      >
        <div className="flex items-center justify-between p-6">
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent"
            >
              ADMIN PRO
            </motion.h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-white hover:bg-white/5"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-2 py-4">
            {menuItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.id} href={item.href}>
                  <a className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}>
                    <Icon size={20} className={cn(isActive ? "text-blue-400" : "group-hover:scale-110 transition-transform")} />
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-full"
                      />
                    )}
                  </a>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className={cn("flex items-center gap-3 p-3", !isSidebarOpen && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
              {admin?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">{admin?.username || "Admin"}</p>
                <p className="text-xs text-slate-500 truncate">{admin?.role || "SUPER_ADMIN"}</p>
              </div>
            )}
            {isSidebarOpen && (
              <Button size="icon" variant="ghost" onClick={logout} className="text-slate-400 hover:text-red-400 hover:bg-red-400/10">
                <LogOut size={18} />
              </Button>
            )}
          </div>
          {!isSidebarOpen && (
            <Button size="icon" variant="ghost" onClick={logout} className="w-full mt-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10">
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
        {/* Background Gradients for Neon Look */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-40">
          <div>
            <h2 className="text-lg font-semibold text-slate-200 capitalize">
              {location.split("/").pop()?.replace("-", " ")}
            </h2>
            <p className="text-xs text-slate-500">System is running normally</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#09090b]" />
            </Button>
            <div className="h-8 w-px bg-white/10" />
            <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AdminAIAssistant />
    </div>
  );
}
