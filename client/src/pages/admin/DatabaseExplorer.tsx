import React from "react";
import { 
  Database, HardDrive, Cpu, 
  RefreshCw, Search, Trash2, 
  AlertTriangle, ShieldCheck, Zap,
  BarChart3, Activity, Plus, Table
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table as UITable, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function DatabaseExplorer() {
  const tables = [
    { name: "users", rows: "5.4k", size: "1.2 MB", health: "OPTIMIZED", index: "pk_users" },
    { name: "ai_usage_logs", rows: "124k", size: "48 MB", health: "VACUUM_NEEDED", index: "idx_usage_user" },
    { name: "bookmarks", rows: "12k", size: "4.5 MB", health: "OPTIMIZED", index: "idx_bookmark_repo" },
    { name: "search_history", rows: "85k", size: "12 MB", health: "OPTIMIZED", index: "idx_search_query" },
    { name: "conversations", rows: "8.2k", size: "2.1 MB", health: "OPTIMIZED", index: "pk_conv" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Database Explorer</h1>
        <p className="text-slate-500 font-medium">Inspect relational schema, monitor storage efficiency, and manage persistent nodes.</p>
      </div>

      {/* DB Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Storage Used", value: "82.4 GB", progress: 65, icon: HardDrive, color: "text-blue-500" },
          { label: "Active Queries", value: "14 / 100", progress: 14, icon: Zap, color: "text-yellow-500" },
          { label: "Cache Hit Rate", value: "98.2%", progress: 98, icon: Activity, color: "text-green-500" },
          { label: "Index Efficiency", value: "92%", progress: 92, icon: BarChart3, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="bg-white/5 border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <Progress value={stat.progress} className="h-1 bg-white/5" />
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-slate-200">Relational Schema</CardTitle>
            <CardDescription className="text-slate-500 italic">Live mapping of PostgreSQL tables and row velocity.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 mr-2" /> Vacuum
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-3.5 h-3.5 mr-2" /> New Table
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
            <UITable>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10">
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 pl-6">Table Name</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Row Count</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Data Size</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Integrity</TableHead>
                  <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((tbl) => (
                  <TableRow key={tbl.name} className="border-white/5 hover:bg-white/5 transition-all group">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Table className="w-4 h-4 text-blue-500/50" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">{tbl.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-300">{tbl.rows}</TableCell>
                    <TableCell className="text-center font-bold text-slate-300">{tbl.size}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5",
                          tbl.health === "OPTIMIZED" 
                            ? "bg-green-500/10 text-green-500 border-green-500/20" 
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse"
                        )}
                      >
                        {tbl.health}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-white">
                          <Search size={14} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 hover:text-red-500">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </UITable>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center">
          <ShieldCheck className="w-10 h-10 text-green-500 mb-4" />
          <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Query Sanitation</h5>
          <p className="text-xs text-slate-500 italic mt-2">Active SQL injection shielding is operating on 100% of incoming data streams.</p>
        </Card>
        <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mb-4" />
          <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Deadlocks Cleared</h5>
          <p className="text-xs text-slate-500 italic mt-2">No active lock conflicts detected in the past 7 days of operation.</p>
        </Card>
      </div>
    </div>
  );
}
