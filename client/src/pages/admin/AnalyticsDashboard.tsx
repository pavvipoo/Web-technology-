import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart3, TrendingUp, Users, Zap, Globe, 
  Map as MapIcon, MousePointer2, Clock, Share2
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const data = [
  { name: "Jan", users: 400, engagement: 240, growth: 24 },
  { name: "Feb", users: 300, engagement: 139, growth: 13 },
  { name: "Mar", users: 200, engagement: 980, growth: 98 },
  { name: "Apr", users: 278, engagement: 390, growth: 39 },
  { name: "May", users: 189, engagement: 480, growth: 48 },
  { name: "Jun", users: 239, engagement: 380, growth: 38 },
  { name: "Jul", users: 349, engagement: 430, growth: 43 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#4ade80"];

export default function AnalyticsDashboard() {
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight font-display">Advanced Analytics</h1>
        <p className="text-slate-500 font-medium">Deep dive into user behavior, system performance, and growth velocity.</p>
      </div>

      {/* Analytics Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10 border-white/10 backdrop-blur-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white tracking-tight">System Growth Velocity</CardTitle>
                <CardDescription className="text-slate-400 font-medium">Monthly Active Users (MAU) vs Engagement Rate</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-500" /> Users</div>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Engagement</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="glowUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="glowEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#glowUsers)" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#020617" }} />
                  <Area type="monotone" dataKey="engagement" stroke="#8b5cf6" fillOpacity={1} fill="url(#glowEngagement)" strokeWidth={3} dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#020617" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Globe/Region Stats Replacement */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-200">Global Distribution</CardTitle>
            <CardDescription className="text-slate-500">Active users by region (approx.)</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center gap-6">
            <div className="space-y-4">
              {[
                { region: "North America", value: 45, color: "#3b82f6" },
                { region: "Europe", value: 30, color: "#8b5cf6" },
                { region: "Asia Pacific", value: 15, color: "#ec4899" },
                { region: "Others", value: 10, color: "#f59e0b" },
              ].map((item) => (
                <div key={item.region} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-400 px-1 uppercase tracking-widest">
                    <span>{item.region}</span>
                    <span className="text-slate-200">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }} 
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 mt-auto">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-400 animate-pulse" />
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Traffic is currently peaking in <span className="text-blue-400 underline underline-offset-4">London Gateway</span> node.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interaction Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-slate-200">User Interaction Depth</CardTitle>
            <CardDescription className="text-slate-500 italic font-medium">Session duration vs click-through rate per module.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px" }} />
                  <Bar dataKey="growth" fill="#4ade80" radius={[10, 10, 10, 10]} barSize={20}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col justify-center items-center text-center">
             <MousePointer2 className="w-10 h-10 text-indigo-400 mb-4" />
             <h4 className="text-3xl font-bold text-white underline decoration-indigo-500/30 decoration-2 underline-offset-8">89%</h4>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">Conversion Index</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col justify-center items-center text-center">
             <Clock className="w-10 h-10 text-blue-400 mb-4" />
             <h4 className="text-3xl font-bold text-white underline decoration-blue-500/30 decoration-2 underline-offset-8">14m</h4>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">Avg. Session Time</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col justify-center items-center text-center">
             <Share2 className="w-10 h-10 text-green-400 mb-4" />
             <h4 className="text-3xl font-bold text-white underline decoration-green-500/30 decoration-2 underline-offset-8">2.4k</h4>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">Social Shares</p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6 flex flex-col justify-center items-center text-center group">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:scale-150 transition-transform duration-700" />
                <Zap className="w-10 h-10 text-yellow-500 mb-4 relative z-10" />
             </div>
             <h4 className="text-3xl font-bold text-white mt-1 underline decoration-yellow-500/30 decoration-2 underline-offset-8">Live</h4>
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-4">System State</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
