import React from "react";
import { 
  CreditCard, TrendingUp, Users, Zap, 
  DollarSign, PieChart, Shield, CheckCircle2, 
  ArrowUpRight, Target, Briefcase, Settings
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";

const revenueData = [
  { name: "Jan", rev: 1200 },
  { name: "Feb", rev: 1800 },
  { name: "Mar", rev: 2400 },
  { name: "Apr", rev: 4200 },
  { name: "May", rev: 3800 },
  { name: "Jun", rev: 5600 },
];

export default function Monetization() {
  const plans = [
    { name: "Free", users: "4.2k", revenue: "$0", color: "text-slate-400", bg: "bg-slate-400/10" },
    { name: "Pro", users: "1.8k", revenue: "$18k", color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Enterprise", users: "124", revenue: "$62k", color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Monetization & Billing</h1>
        <p className="text-slate-500 font-medium">Control subscription tiers, analyze MRR, and manage global SaaS parameters.</p>
      </div>

      {/* Financial Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gradient-to-br from-indigo-900/20 to-transparent border-white/10 backdrop-blur-xl border-t-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white tracking-tight">MRR Growth</CardTitle>
                <CardDescription className="text-slate-500">Monthly Recurring Revenue (Last 6 Months)</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-500">$80,450</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">+12.4% from last month</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px" }}
                  />
                  <Area type="monotone" dataKey="rev" stroke="#22c55e" fill="url(#revGlow)" strokeWidth={3} dot={{ r: 4, fill: "#22c55e" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
             <CardTitle className="text-slate-200">Active Subscriptions</CardTitle>
             <CardDescription className="text-slate-500 italic">User breakdown by tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             {plans.map((p) => (
               <div key={p.name} className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className={p.color}>{p.name}</span>
                    <span className="text-slate-200">{p.users}</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: p.name === "Free" ? "70%" : p.name === "Pro" ? "25%" : "5%" }}
                      className={`h-full rounded-full ${p.name === "Free" ? "bg-slate-500" : p.name === "Pro" ? "bg-blue-500" : "bg-purple-500"}`}
                    />
                 </div>
               </div>
             ))}
             
             <div className="pt-6 border-t border-white/5 space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-bold uppercase text-[10px] tracking-widest">
                   Manage Pricing Tiers
                </Button>
                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-slate-400 hover:text-white h-10 font-bold uppercase text-[10px] tracking-widest">
                   Billing History
                </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Churn Rate", value: "2.4%", trend: "-0.5%", icon: TrendingUp },
           { label: "LTV", value: "$420", trend: "+$40", icon: Target },
           { label: "CAC", value: "$85", trend: "-$12", icon: Briefcase },
           { label: "ARPU", value: "$12.5", trend: "+$1.2", icon: PieChart },
         ].map((stat, i) => (
           <Card key={stat.label} className="bg-white/5 border-white/10 p-6 flex flex-col justify-center text-center hover:bg-white/10 transition-all cursor-default scale-on-hover">
              <stat.icon className="w-6 h-6 text-blue-500 mx-auto mb-3" />
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</h4>
              <p className="text-2xl font-bold text-white mt-1 underline decoration-blue-500/20 underline-offset-8">{stat.value}</p>
              <span className="text-[9px] font-bold text-green-500 mt-2 uppercase">{stat.trend} this period</span>
           </Card>
         ))}
      </div>
    </div>
  );
}
