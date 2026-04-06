import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Brain, Zap, Activity, TrendingUp, AlertCircle, 
  Search, Cpu, ArrowUpRight, DollarSign, Clock
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIUsageLog {
  id: number;
  user: string | null;
  tokens: number;
  cost: number;
  type: string;
  timestamp: string;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"];

export default function AIUsageControl() {
  const { data: logs, isLoading: loadingLogs } = useQuery<AIUsageLog[]>({
    queryKey: ["/api/admin/ai/logs"],
  });

  const { data: stats, isLoading: loadingStats } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
  });

  const pieData = [
    { name: "Repo Chat", value: 65 },
    { name: "Repo Analysis", value: 25 },
    { name: "Code Review", value: 10 },
  ];

  const cards = [
    { title: "Tokens/Month", value: (stats?.totalTokens || 0).toLocaleString(), sub: "+12.5%", icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Monthly Compute", value: `$${((stats?.totalCost || 0) / 100000).toFixed(2)}`, sub: "-2.4%", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Avg. Latency", value: "342ms", sub: "Optimized", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Reliability", value: "99.98%", sub: "Stable", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Usage & Control</h1>
        <p className="text-slate-500 font-medium">Monitor Gemini AI consumption, token costs, and model performance metrics.</p>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${card.bg}`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <span className={`text-xs font-bold ${card.sub.startsWith("+") ? "text-green-400" : "text-blue-400"}`}>
                    {card.sub}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{card.title}</p>
                  <h3 className="text-2xl font-bold text-white mt-1 underline decoration-blue-500/20 decoration-2 underline-offset-4">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-200">Consumption Trends</CardTitle>
            <CardDescription className="text-slate-500 font-medium italic">Token consumption across all models for the current billing cycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={logs?.slice(0, 7).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="tokens" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                    {logs?.slice(0, 7).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-slate-200">Allocation</CardTitle>
            <CardDescription className="text-slate-500">Usage by operation type</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 w-full mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-200">Direct Consumption Logs</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Real-time AI compute logs via Gemini 2.0 API.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="bg-blue-500/5 border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-all">
            <Search className="w-3.5 h-3.5 mr-2" /> Inspect All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] py-4">Transaction ID</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] py-4">Identity</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] py-4 text-center">Load (TOK)</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] py-4 text-center">Module</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] py-4 text-right">Timecode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingLogs ? (
                  [1, 2, 3].map(i => (
                    <TableRow key={i} className="border-white/5"><TableCell colSpan={5} className="py-8"><div className="h-4 w-full bg-white/5 animate-pulse rounded" /></TableCell></TableRow>
                  ))
                ) : (
                  logs?.map((log) => (
                    <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-all duration-300">
                      <TableCell className="font-mono text-xs text-blue-400">#LOG_{log.id.toString().padStart(4, '0')}</TableCell>
                      <TableCell className="text-slate-200 font-medium">{log.user || "System"}</TableCell>
                      <TableCell className="text-center font-bold text-yellow-500">{(log.tokens).toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-indigo-500/5 text-indigo-400 border-indigo-500/20 capitalize font-medium">
                          {log.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-500 tabular-nums">
                        {format(new Date(log.timestamp), "HH:mm:ss · dd MMM")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Footer Info */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <AlertCircle className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-slate-300">
            Compute quotas are shared across the team. <span className="text-blue-400 underline underline-offset-4 decoration-blue-500/40 font-bold cursor-pointer hover:text-blue-300 transition-colors">Upgrade Plan</span> to increase throughput.
          </p>
        </div>
        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-white group">
          View Detail Reports <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
