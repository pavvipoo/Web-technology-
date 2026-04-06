import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminStore } from "@/stores/useAdminStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, ShieldCheck, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { setAdmin, isAuthenticated } = useAdminStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/admin/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Invalid credentials");
      }

      const admin = await res.json();
      setAdmin(admin);
      toast({
        title: "Success",
        description: `Welcome back, ${admin.username}!`,
      });
      setLocation("/admin/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md p-4 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 shadow-xl shadow-blue-500/10">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Authorized Access Only</p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden border-t-white/20">
          <CardHeader>
            <CardTitle className="text-white">Secure Login</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your admin credentials to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Admin ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <Input 
                            {...field} 
                            placeholder="username" 
                            className="bg-black/40 border-white/10 text-white pl-10 focus:border-blue-500/50 transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Secret Token</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                          <Input 
                            {...field} 
                            type="password" 
                            placeholder="••••••••" 
                            className="bg-black/40 border-white/10 text-white pl-10 focus:border-blue-500/50 transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Authorize Session"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-white/5 bg-black/20 p-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
              AES-256 Encrypted Session
            </div>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-slate-600 text-xs tracking-tight">
          System ID: <span className="text-slate-400 font-mono underline decoration-dotted">GEP-ADM-NX-24</span> | 
          Built by <span className="text-slate-400">Design-Savvy</span>
        </p>
      </motion.div>
    </div>
  );
}
