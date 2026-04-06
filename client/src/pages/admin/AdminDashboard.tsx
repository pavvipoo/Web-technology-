import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Brain, Zap, Activity, TrendingUp, 
  Search, ShieldAlert, Cpu, Database, Bookmark
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from "recharts";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { name: "Mon", users: 40, ai: 24, cost: 2400 },
  { name: "Tue", users: 30, ai: 13, cost: 2210 },
  { name: "Wed", users: 20, ai: 98, cost: 2290 },
  { name: "Thu", users: 27, ai: 39, cost: 2000 },
  { name: "Fri", users: 18, ai: 48, cost: 2181 },
  { name: "Sat", users: 23, ai: 38, cost: 2500 },
  { name: "Sun", users: 34, ai: 43, cost: 2100 },
];

interface SystemStats {
  totalUsers: number;
  totalAIRequests: number;
  totalTokens: number;
  totalCost: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<SystemStats>({
    queryKey: ["/api/admin/stats"],
  });


  const cards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "AI Requests", value: stats?.totalAIRequests || 0, icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Tokens Used", value: (stats?.totalTokens || 0).toLocaleString(), icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { title: "Estimated Cost", value: `$${((stats?.totalCost || 0) / 100000).toFixed(2)}`, icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl border border-white/5 bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full rounded-2xl border border-white/5 bg-white/5" />
          <Skeleton className="h-[400px] w-full rounded-2xl border border-white/5 bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time performance and usage metrics for GitHub Explorer Pro.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors border-t-white/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500 opacity-50" />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-400">{card.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-t-white/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-200">User Acquisition</CardTitle>
            <CardDescription className="text-slate-500">New signups over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "8px" }}
                    itemStyle={{ color: "#3b82f6" }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Usage Multi-Chart */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-t-white/10 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-slate-200">AI Compute Efficiency</CardTitle>
            <CardDescription className="text-slate-500">Gemini API requests vs Estimated Cost</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "8px" }}
                  />
                  <Bar dataKey="ai" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - More Real-time Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-2 rounded-lg bg-red-500/10"><ShieldAlert className="w-5 h-5 text-red-500" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Alerts</p>
              <h4 className="text-xl font-bold text-white">0 Issues</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-2 rounded-lg bg-indigo-500/10"><Cpu className="w-5 h-5 text-indigo-500" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Load</p>
              <h4 className="text-xl font-bold text-white">12% Idle</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="p-2 rounded-lg bg-blue-500/10"><Database className="w-5 h-5 text-blue-500" /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pool Status</p>
              <h4 className="text-xl font-bold text-white">Healthy</h4>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
