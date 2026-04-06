import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, Send, Trash2, Megaphone, AlertCircle, 
  Info, CheckCircle2, User, Globe, Calendar, Clock
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function NotificationSystem() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("INFO");

  // Mock notifications for UI demonstration
  const [notifications, setNotifications] = useState([
    { id: 1, title: "System Maintenance", message: "We will be performing scheduled maintenance on April 10th.", type: "WARNING", createdAt: new Date().toISOString(), status: "ACTIVE" },
    { id: 2, title: "New Feature: AI Repo Chat", message: "Check out the new AI chat feature for all repositories!", type: "SUCCESS", createdAt: new Date().toISOString(), status: "ARCHIVED" },
  ]);

  const handleSend = () => {
    if (!title || !message) return;
    
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      status: "ACTIVE"
    };
    
    setNotifications([newNotif, ...notifications]);
    setTitle("");
    setMessage("");
    toast({
      title: "Notification Broadcasted",
      description: "The message has been sent to all active users.",
    });
  };

  const deleteNotif = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast({ title: "Deleted", description: "Notification removed." });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">Notification System</h1>
        <p className="text-slate-500 font-medium">Broadcast system-wide alerts, updates, and maintenance notices to all users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Notification Form */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10 h-fit sticky top-8">
           <CardHeader>
              <CardTitle className="text-slate-200">Broadcast Message</CardTitle>
              <CardDescription className="text-slate-500 italic">Compose a message to be displayed globally.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Alert Title</label>
                 <Input 
                   value={title} 
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder="e.g. Scheduled Maintenance" 
                   className="bg-black/40 border-white/10 text-white focus:border-blue-500/50"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Alert Type</label>
                 <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="bg-black/40 border-white/10 text-white">
                       <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                       <SelectItem value="INFO">Information (Blue)</SelectItem>
                       <SelectItem value="WARNING">Warning (Orange)</SelectItem>
                       <SelectItem value="SUCCESS">Success (Green)</SelectItem>
                       <SelectItem value="CRITICAL">Critical (Red)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Message Content</label>
                 <Textarea 
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   placeholder="Describe the update in detail..." 
                   className="bg-black/40 border-white/10 text-white focus:border-blue-500/50 min-h-[120px] resize-none"
                 />
              </div>
              <Button 
                onClick={handleSend}
                disabled={!title || !message}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 font-bold uppercase text-xs tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <Megaphone className="w-4 h-4 mr-2" /> Broadcast Now
              </Button>
           </CardContent>
        </Card>

        {/* History Table */}
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl border-t-white/10">
           <CardHeader className="flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-slate-200">Alert History</CardTitle>
                 <CardDescription className="text-slate-500">History of all broadcasted system notifications.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white">
                 Clear Archived
              </Button>
           </CardHeader>
           <CardContent>
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
                 <Table>
                    <TableHeader className="bg-white/5">
                       <TableRow className="border-white/10">
                          <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 pl-6">Notification</TableHead>
                          <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-center">Type</TableHead>
                          <TableHead className="text-slate-500 font-bold uppercase text-[9px] tracking-widest py-4 text-right pr-6">Broadcast Date</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {notifications.map((notif) => (
                         <TableRow key={notif.id} className="border-white/5 hover:bg-white/5 transition-all group">
                            <TableCell className="pl-6 py-4">
                               <div className="flex flex-col gap-1">
                                  <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{notif.title}</span>
                                  <span className="text-xs text-slate-500 max-w-sm line-clamp-1">{notif.message}</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-center">
                               <Badge 
                                 variant="outline" 
                                 className={cn(
                                   "text-[9px] font-bold px-2 py-0.5",
                                   notif.type === "WARNING" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                   notif.type === "SUCCESS" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                   notif.type === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                   "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                 )}
                               >
                                  {notif.type}
                               </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                               <div className="flex flex-col items-end gap-1">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium tabular-nums">
                                     <Calendar size={12} /> {format(new Date(notif.createdAt), "MMM dd")}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => deleteNotif(notif.id)}
                                    className="h-7 w-7 text-slate-600 hover:text-red-500 hover:bg-red-500/10"
                                  >
                                     <Trash2 size={12} />
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
      </div>

      {/* Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center">
            <Globe className="w-8 h-8 text-blue-400 mb-4" />
            <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Reach</h5>
            <p className="text-2xl font-bold text-white mt-1">100% Users</p>
         </Card>
         <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
            <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Delivery Rate</h5>
            <p className="text-2xl font-bold text-white mt-1">99.9%</p>
         </Card>
         <Card className="bg-white/5 border-white/10 p-6 flex flex-col items-center text-center">
            <Info className="w-8 h-8 text-indigo-400 mb-4" />
            <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Avg. Open Rate</h5>
            <p className="text-2xl font-bold text-white mt-1">64%</p>
         </Card>
      </div>
    </div>
  );
}
