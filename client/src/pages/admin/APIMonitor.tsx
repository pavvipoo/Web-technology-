import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, Zap, Globe, Github, Database, 
  AlertCircle, CheckCircle2, Wifi, Server, 
  BarChart3, Clock, Share2 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line 
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const latencyData = [
  { time: "00:00", github: 120, gemini: 450, db: 12 },
  { time: "04:00", github: 110, gemini: 410, db: 15 },
  { time: "08:00", github: 180, gemini: 600, db: 45 },
  { time: "12:00", github: 140, gemini: 480, db: 22 },
  { time: "16:00", github: 130, gemini: 440, db: 18 },
  { time: "20:00", github: 125, gemini: 430, db: 14 },
  { time: "23:59", github: 115, gemini: 420, db: 11 },
];

export default function APIMonitor() {
  const apiStatuses = [
    { name: "GitHub API v3", status: "Operational", uptime: "99.99%", latency: "125ms", icon: Github, color: "text-white" },
    { name: "Gemini 2.0 API", status: "Operational", uptime: "99.95%", latency: "420ms", icon: Zap, color: "text-blue-400" },
    { name: "SaaS Database (PG)", status: "Operational", uptime: "100%", latency: "12ms", icon: Database, color: "text-blue-500" },
    { name: "Vercel Edge Functions", status: "Operational", uptime: "99.99%", latency: "65ms", icon: Server, color: "text-indigo-400" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">System & API Monitoring</h1>
        <p className="text-slate-500 font-medium">Real-time health status, latency analysis, and uptime monitoring for all core services.</p>
      </div>

      {/* Hero Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {apiStatuses.map((api, i) => (
          <motion.div
            key={api.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 hover:border-blue-500/30 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <api.icon className={`w-5 h-5 ${api.color}`} />
                   </div>
                   <Badge className="bg-green-500/20 text-green-500 border-green-500/20 text-[10px] py-0 px-2 font-bold">{api.status}</Badge>
                </div>
                <h3 className="text-sm font-bold text-white mb-4">{api.name}</h3>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Uptime</span>
                      <span className="text-slate-200 font-bold">{api.uptime}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">Latency</span>
                      <span className="text-blue-400 font-bold">{api.latency}</span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latency Analysis */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
          <CardHeader>
             <CardTitle className="text-slate-200">Global Response Time (ms)</CardTitle>
             <CardDescription className="text-slate-500 italic">Network latency trends across primary infrastructure nodes.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={latencyData}>
                      <defs>
                         <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="time" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px" }}
                      />
                      <Area type="monotone" dataKey="gemini" stroke="#3b82f6" fill="url(#colorGemini)" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#020617" }} />
                      <Area type="monotone" dataKey="github" stroke="#f59e0b" fill="transparent" strokeWidth={2} strokeDasharray="10 5" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        {/* Integration Status Sidebar */}
        <div className="space-y-6">
           <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
              <CardHeader className="pb-3 border-b border-white/5">
                 <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Endpoint Health</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>Database Pool</span>
                       <span className="text-green-500">100% OK</span>
                    </div>
                    <Progress value={100} className="h-1 bg-white/5" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>WebSocket Conn</span>
                       <span className="text-blue-400">Stable</span>
                    </div>
                    <Progress value={85} className="h-1 bg-white/5" />
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>Gemini Quota</span>
                       <span className="text-yellow-500">72% Left</span>
                    </div>
                    <Progress value={72} className="h-1 bg-white/5" />
                 </div>
              </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-white/10 backdrop-blur-xl border-t-white/20">
              <CardContent className="p-6 text-center space-y-4">
                 <div className="inline-flex p-3 rounded-2xl bg-blue-500/20 border border-blue-500/20">
                    <Wifi className="w-6 h-6 text-blue-400" />
                 </div>
                 <h4 className="text-lg font-bold text-white underline decoration-blue-500/30 underline-offset-4 decoration-2">System Diagnostics</h4>
                 <p className="text-xs text-slate-500 italic mt-2">All primary system paths are currently operational with zero significant bottlenecks.</p>
                 <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-bold uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20 mt-4">
                    Run Full System Check
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Recent Alerts */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
         <CardHeader>
            <CardTitle className="text-slate-200">System Event Logs</CardTitle>
            <CardDescription className="text-slate-500">Recent API handshake and synchronization events.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {[
                 { event: "Gemini Sync", status: "Success", time: "2 mins ago", msg: "Model gemini-2.0-flash re-connected successfully." },
                 { event: "PG Cleanup", status: "Warning", time: "14 mins ago", msg: "Database maintenance task completed with 12 skipped items." },
                 { event: "Auth Gateway", status: "Success", time: "1 hour ago", msg: "Token validation relay nodes refreshed across US-East." },
               ].map((log, i) => (
                 <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors">
                    <div className={log.status === "Success" ? "text-green-500" : "text-yellow-500"}>
                       {log.status === "Success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-bold text-white">{log.event}</h5>
                          <span className="text-[10px] font-bold text-slate-500 tabular-nums uppercase tracking-widest">{log.time}</span>
                       </div>
                       <p className="text-xs text-slate-400 italic">{log.msg}</p>
                    </div>
                 </div>
               ))}
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
