import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users, MoreHorizontal, UserX, UserCheck, Shield, 
  Search, Filter, ArrowUpDown, Mail, Calendar, Trash2
} from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { type User } from "@shared/schema";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: string }) => {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "User role updated successfully" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "User deleted successfully" });
    },
  });

  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return <Badge className="bg-red-500/20 text-red-500 border-red-500/20">Super Admin</Badge>;
      case "ADMIN": return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20">Admin</Badge>;
      case "MODERATOR": return <Badge className="bg-green-500/20 text-green-500 border-green-500/20">Moderator</Badge>;
      default: return <Badge variant="outline" className="text-slate-400">User</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
        <p className="text-slate-500 font-medium">View and manage all registered users and their permissions.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm border-t-white/10">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input 
                placeholder="Search by username or email..." 
                className="bg-black/40 border-white/10 text-white pl-10 focus:border-blue-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-white/10 text-slate-300 hover:bg-white/5">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Export Users
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">User</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Role</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Joined</TableHead>
                  <TableHead className="text-slate-400 font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <TableRow key={i} className="border-white/5 animate-pulse">
                      <TableCell><div className="h-10 w-40 bg-white/5 rounded-lg" /></TableCell>
                      <TableCell><div className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                      <TableCell><div className="h-6 w-24 bg-white/5 rounded-lg" /></TableCell>
                      <TableCell className="text-right"><div className="h-8 w-8 bg-white/5 rounded-full ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-slate-500 italic">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers?.map((user) => (
                    <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-200">{user.username}</span>
                            <span className="text-xs text-slate-500">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-sm text-slate-400">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 bg-[#09090b] border-white/10 text-slate-200 backdrop-blur-xl">
                            <DropdownMenuLabel>Manage User</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem 
                              className="focus:bg-blue-500/20 focus:text-blue-400 cursor-pointer"
                              onClick={() => updateRoleMutation.mutate({ id: user.id, role: "ADMIN" })}
                            >
                              <Shield className="w-4 h-4 mr-2" /> Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="focus:bg-green-500/20 focus:text-green-400 cursor-pointer"
                              onClick={() => updateRoleMutation.mutate({ id: user.id, role: "MODERATOR" })}
                            >
                              <UserCheck className="w-4 h-4 mr-2" /> Make Moderator
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="focus:bg-slate-500/20 focus:text-slate-400 cursor-pointer"
                              onClick={() => updateRoleMutation.mutate({ id: user.id, role: "USER" })}
                            >
                              <ArrowUpDown className="w-4 h-4 mr-2" /> Demote to User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem 
                              className="focus:bg-red-500/20 text-red-500 focus:text-red-400 cursor-pointer"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${user.username}?`)) {
                                  deleteUserMutation.mutate(user.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
