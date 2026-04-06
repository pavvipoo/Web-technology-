import React from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
   ShieldCheck, ShieldAlert, UserPlus, Trash2,
   Settings, Key, Fingerprint, Lock, Shield,
   Search, Filter, History, Mail, AlertTriangle
} from "lucide-react";
import {
   Table, TableBody, TableCell, TableHead,
   TableHeader, TableRow
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AdminRoles() {
   const { toast } = useToast();
   const queryClient = useQueryClient();

   // Fetch only users with admin-level roles
   const { data: admins, isLoading } = useQuery<any[]>({
      queryKey: ["/api/admin/users"],
      select: (users) => users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN")
   });

   const handleRoleChange = (userId: number, newRole: string) => {
      toast({
         title: "Permissions Updated",
         description: `User role has been changed to ${newRole}. Systems will sync within 5 minutes.`,
      });
   };

   return (
      <div className="space-y-8 pb-12">
         <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Roles & Permissions</h1>
            <p className="text-slate-500 font-medium">Manage administrative access levels, security policies, and team credentials.</p>
         </div>

         {/* Security Overview */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-600/10 to-transparent border-white/10 p-6 flex flex-col items-center text-center">
               <ShieldCheck className="w-10 h-10 text-blue-400 mb-4" />
               <h4 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Access Level</h4>
               <p className="text-xs text-slate-500 italic mt-2">Zero Trust Architecture enabled across all management nodes.</p>
            </Card>
            <Card className="bg-gradient-to-br from-indigo-600/10 to-transparent border-white/10 p-6 flex flex-col items-center text-center">
               <Lock className="w-10 h-10 text-indigo-400 mb-4" />
               <h4 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Auth Protocol</h4>
               <p className="text-xs text-slate-500 italic mt-2">SAML 2.0 + MFA required for all Super Admin operations.</p>
            </Card>
            <Card className="bg-gradient-to-br from-purple-600/10 to-transparent border-white/10 p-6 flex flex-col items-center text-center">
               <Fingerprint className="w-10 h-10 text-purple-400 mb-4" />
               <h4 className="text-lg font-bold text-white uppercase tracking-widest text-xs">Session Policy</h4>
               <p className="text-xs text-slate-500 italic mt-2">Automatic rotation of encryption keys every 24 hours.</p>
            </Card>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Admin User Management */}
            <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
               <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                     <CardTitle className="text-slate-200">Management Team</CardTitle>
                     <CardDescription className="text-slate-500">List of users with administrative console access.</CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-10 font-bold uppercase text-[10px] tracking-widest">
                     <UserPlus className="w-3.5 h-3.5 mr-2" /> Invite Admin
                  </Button>
               </CardHeader>
               <CardContent>
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
                     <Table>
                        <TableHeader className="bg-white/5">
                           <TableRow className="border-white/10">
                              <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 pl-6">Admin User</TableHead>
                              <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Authorization</TableHead>
                              <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-right pr-6">Management</TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {isLoading ? (
                              <TableRow><TableCell colSpan={3} className="text-center py-12 text-slate-500">Fetching security records...</TableCell></TableRow>
                           ) : admins?.map((user) => (
                              <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-all group">
                                 <TableCell className="pl-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 uppercase">
                                          {user.username.charAt(0)}
                                       </div>
                                       <div>
                                          <div className="text-sm font-bold text-white">{user.username}</div>
                                          <div className="text-[10px] text-slate-500 font-mono italic uppercase tracking-wider">{user.id} · Active Session</div>
                                       </div>
                                    </div>
                                 </TableCell>
                                 <TableCell className="text-center">
                                    <Badge
                                       variant="outline"
                                       className={cn(
                                          "text-[9px] font-bold px-3 py-1",
                                          user.role === "SUPER_ADMIN" ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                       )}
                                    >
                                       {user.role}
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                       <Button
                                          variant="ghost"
                                          size="icon"
                                          title="Reset Security Key"
                                          className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/5"
                                       >
                                          <Key size={14} />
                                       </Button>
                                       <Button
                                          variant="ghost"
                                          size="icon"
                                          title="Revoke Access"
                                          className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10"
                                       >
                                          <Trash2 size={14} />
                                       </Button>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </div>
               </CardContent>
            </Card>

            {/* Security Policies Sidebar */}
            <div className="space-y-6">
               <Card className="bg-white/5 border-white/10 backdrop-blur-xl overflow-hidden">
                  <CardHeader className="bg-white/5 border-b border-white/5">
                     <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Security Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y divide-white/5">
                        {[
                           { icon: Shield, label: "MFA Enforcement", status: "STRICT" },
                           { icon: Lock, label: "IP Whitelisting", status: "ENABLED" },
                           { icon: History, label: "Audit Log Retention", status: "90 DAYS" },
                           { icon: AlertTriangle, label: "Threat Detection", status: "DYNAMIC" },
                        ].map((policy) => (
                           <div key={policy.label} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                              <div className="flex items-center gap-3">
                                 <policy.icon className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                                 <span className="text-xs font-medium text-slate-300">{policy.label}</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors">{policy.status}</span>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>

               <Card className="bg-gradient-to-br from-red-600/10 to-transparent border-red-500/10 backdrop-blur-xl">
                  <CardContent className="p-6">
                     <div className="flex gap-4">
                        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 self-start">
                           <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                        </div>
                        <div>
                           <h5 className="text-sm font-bold text-white uppercase tracking-widest text-[11px]">Incident Sandbox</h5>
                           <p className="text-xs text-slate-500 italic mt-1 leading-relaxed">System-wide lockdown trigger is available in case of compromised Super Admin credentials.</p>
                           <Button className="w-full mt-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 font-bold uppercase text-[9px] tracking-[0.2em] h-9">
                              Trigger Lockdown
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}


