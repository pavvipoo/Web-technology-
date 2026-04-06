import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Rocket, Search, MessageSquare, Bookmark, 
  TrendingUp, Zap, HardDrive, ShieldCheck, 
  BarChart, Activity, Globe, Cpu 
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export default function RepoMonitoring() {
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
  });

  const repoMetrics = [
    { label: "Active Analyzed Repos", value: "124", icon: Rocket, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Search Index Size", value: "3.2 TB", icon: HardDrive, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "API Uptime", value: "99.98%", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Vector Embeddings", value: "2.5M", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  const trendingRepos = [
    { name: "shadcn-ui", owner: "shadcn", stars: "45k", chats: 1240, bookmarks: 450, health: "HEALTHY" },
    { name: "next.js", owner: "vercel", stars: "115k", chats: 980, bookmarks: 320, health: "HEALTHY" },
    { name: "tailwind-merge", owner: "dcastil", stars: "5k", chats: 450, bookmarks: 120, health: "INDEXING" },
    { name: "framer-motion", owner: "framer", stars: "22k", chats: 320, bookmarks: 85, health: "HEALTHY" },
    { name: "drizzle-orm", owner: "drizzle-team", stars: "12k", chats: 280, bookmarks: 65, health: "DEGRADED" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Repository Monitoring</h1>
        <p className="text-slate-500 font-medium">Analyze repository discovery trends and system-wide interaction metrics.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {repoMetrics.map((met, i) => (
          <motion.div
            key={met.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 hover:bg-white/10 transition-all cursor-default group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${met.bg} group-hover:scale-110 transition-transform`}>
                    <met.icon className={`w-5 h-5 ${met.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{met.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{met.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Repos Table */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-200">System Trending Repositories</CardTitle>
              <CardDescription className="text-slate-500 font-medium italic">Repositories with highest interaction frequency across all users.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20">
              <Globe className="w-3.5 h-3.5 mr-2" /> Global Heatmap
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 pl-6">Repository Identifier</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Interactions</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Health</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-right pr-6">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingRepos.map((repo, i) => (
                    <TableRow key={repo.name} className="border-white/5 hover:bg-white/5 transition-all group">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer">{repo.owner}/{repo.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono italic">ID: GH_REPO_{i.toString().padStart(3, '0')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-300">
                        <div className="flex items-center justify-center gap-4">
                           <div className="flex items-center gap-1.5"><MessageSquare size={12} className="text-blue-400" /> {repo.chats}</div>
                           <div className="flex items-center gap-1.5"><Bookmark size={12} className="text-indigo-400" /> {repo.bookmarks}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] px-2 py-0.5 font-bold",
                            repo.health === "HEALTHY" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                            repo.health === "INDEXING" ? "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse" :
                            "bg-red-500/10 text-red-500 border-red-500/20"
                          )}
                        >
                          {repo.health}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-bold text-white">High</span>
                           <div className="w-16 h-1 bg-white/5 rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: i === 0 ? "90%" : i === 1 ? "75%" : "40%" }} />
                           </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Search Statistics */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-900/20 to-transparent border-white/10 backdrop-blur-3xl overflow-hidden relative border-t-white/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-slate-200">Search Velocity</CardTitle>
              <CardDescription className="text-slate-500">Live search query throughput</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-20 mb-6">
                {[45, 60, 35, 80, 50, 90, 40, 70, 55, 85].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                    className="flex-1 bg-blue-500/40 rounded-t-sm border-t border-blue-400/30"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center px-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Avg. Search Latency</p>
                  <p className="text-lg font-bold text-white">42ms</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Cache Hit Rate</p>
                  <p className="text-lg font-bold text-green-500">92.4%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
             <CardHeader>
                <CardTitle className="text-slate-200">System Integration</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 pt-0 text-sm">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400"><Search size={14} /> Search Handler</div>
                   <Badge className="bg-green-500/20 text-green-500 border-green-500/20 text-[10px]">ACTIVE</Badge>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400"><Zap size={14} /> Cache Sync</div>
                   <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20 text-[10px]">SYNCING</Badge>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400"><ShieldCheck size={14} /> Rate Limiter</div>
                   <Badge className="bg-green-500/20 text-green-500 border-green-500/20 text-[10px]">SAFE</Badge>
                </div>
                <Button className="w-full mt-4 bg-[#0f172a] hover:bg-slate-800 border border-white/5 h-10 font-bold uppercase text-[10px] tracking-widest text-slate-400 hover:text-white transition-all">
                  Re-Index Repositories
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

