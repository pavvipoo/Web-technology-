import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Terminal, Activity, Shield, AlertTriangle, 
  Search, Filter, Trash2, Download, RefreshCw,
  Cpu, HardDrive, Database
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export default function SystemLogs() {
  const { data: logs, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/audit"],
  });

  const systemMetrics = [
    { label: "CPU Load", value: "14%", status: "NORMAL", icon: Cpu },
    { label: "Memory", value: "2.4GB / 8GB", status: "NORMAL", icon: HardDrive },
    { label: "DB Connections", value: "42 / 100", status: "STABLE", icon: Database },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Logs & Health</h1>
        <p className="text-slate-500 font-medium">Real-time audit trail and hardware resource monitoring.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systemMetrics.map((met) => (
          <Card key={met.label} className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <met.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{met.label}</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
                  {met.status}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-white mt-4">{met.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl flex flex-col h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
          <div>
            <CardTitle className="text-slate-200">Audit Trail</CardTitle>
            <CardDescription className="text-slate-500 italic">Live stream of administrative actions and system events.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input placeholder="Search logs..." className="bg-black/40 border-white/10 pl-9 w-64 h-9 text-xs" />
            </div>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-slate-400">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full font-mono text-[11px]">
            <div className="p-4 space-y-1">
              {isLoading ? (
                <div className="text-center py-20 text-slate-500">Decrypting system stream...</div>
              ) : (
                logs?.map((log, i) => (
                  <div key={i} className="flex gap-4 py-1.5 px-4 group hover:bg-white/5 border-l-2 border-transparent hover:border-blue-500 transition-all">
                    <span className="text-slate-600 shrink-0 w-32">[{new Date(log.timestamp).toISOString()}]</span>
                    <span className="text-blue-400 shrink-0 w-20">SYS_EXEC</span>
                    <span className="text-slate-300">
                      <span className="text-indigo-400 font-bold">{log.admin}</span>
                      <span className="text-slate-500 mx-2">{" >> "}</span>
                      {log.action}
                    </span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] scale-90">INFO</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
