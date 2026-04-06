import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, ShieldAlert, ShieldCheck, Lock, Key, 
  UserSearch, History, AlertTriangle, Eye, Terminal
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface AdminActivity {
  id: number;
  admin: string;
  action: string;
  details: any;
  timestamp: string;
}

export default function SecurityPanel() {
  const { data: activities, isLoading } = useQuery<AdminActivity[]>({
    queryKey: ["/api/admin/activity"],
  });

  const securityMetrics = [
    { label: "System Health", value: "Optimal", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Active Sessions", value: "12", icon: Key, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Auth Failures", value: "0", icon: ShieldAlert, color: "text-slate-500", bg: "bg-slate-500/10" },
    { label: "Threat Level", value: "Low", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Security & Monitoring</h1>
        <p className="text-slate-500 font-medium">Audit logs, access control, and real-time security threat detection.</p>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 overflow-hidden relative">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${metric.bg}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</p>
                    <h3 className="text-xl font-bold text-white mt-0.5">{metric.value}</h3>
                  </div>
                </div>
              </CardContent>
              {metric.label === "System Health" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/20">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Activity Logs */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-slate-200">Admin Audit Trail</CardTitle>
              <CardDescription className="text-slate-500 font-medium">Verified logs of all administrative actions performed across the system.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10">
              <History className="w-4 h-4 mr-2" /> Full History
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/10">
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4">Administrator</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4">Event Description</TableHead>
                    <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3].map(i => <TableRow key={i}><TableCell colSpan={3} className="py-8"><div className="h-4 w-full bg-white/5 animate-pulse rounded" /></TableCell></TableRow>)
                  ) : activities?.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="py-12 text-center text-slate-500 italic font-medium">Initializing system logs... No activity recorded yet.</TableCell></TableRow>
                  ) : (
                    activities?.map((activity) => (
                      <TableRow key={activity.id} className="border-white/5 hover:bg-white/5 transition-all">
                        <TableCell className="font-semibold text-slate-300">{activity.admin}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-slate-200">{activity.action}</span>
                            <span className="text-[10px] text-slate-500 font-mono italic">{JSON.stringify(activity.details)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-slate-500 text-xs tabular-nums">
                          {format(new Date(activity.timestamp), "HH:mm:ss · dd MMM")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
            <CardHeader className="pb-3 border-b border-white/5 bg-black/10">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Active Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs flex gap-3 items-start">
                <div className="mt-0.5"><Lock className="w-3.5 h-3.5 text-orange-400" /></div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-orange-400">Policy Update Pending</span>
                  <span className="text-slate-400 text-[10px]">Session timeout configuration has not been finalized.</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-500/5 border border-white/5 text-xs flex gap-3 items-center opacity-50 grayscale">
                <div className="p-1 rounded bg-white/10"><UserSearch className="w-3 h-3 text-slate-400" /></div>
                <span className="text-slate-500 italic">No new suspicious attempts detected.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-900/20 to-blue-900/20 border-white/10 backdrop-blur-xl border-t-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-200">System Visibility</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> Log Retention</span>
                <span className="text-white font-mono">30 Days</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> API Endpoint Protection</span>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/20 text-[10px] py-0">ENCRYPTED</Badge>
              </div>
              <Button size="sm" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 h-9 font-bold text-[10px] uppercase tracking-widest">
                Force Logout All
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
