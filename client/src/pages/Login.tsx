import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const { loginAsNewUser, loginAsExistingUser, loginWithGithub } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    email: "", 
    username: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupData.email || !signupData.username || !signupData.password || !signupData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      setError("Please enter a valid email");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      loginAsNewUser(signupData.email, signupData.username, signupData.password);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Email and password are required");
      return;
    }

    if (loginData.password.length < 6) {
      setError("Invalid email or password");
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      loginAsExistingUser(loginData.email, loginData.password);
      setIsLoading(false);
    }, 1000);
  };

  const handleGitHubLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGithub();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Login Form */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-md space-y-8"
         >
           <div className="text-center">
             <Link href="/">
               <div className="inline-flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity">
                 <div className="p-2 bg-primary/10 rounded-xl">
                   <Github className="w-8 h-8 text-primary" />
                 </div>
                 <span className="font-display font-bold text-2xl">RepoChat</span>
               </div>
             </Link>
           </div>

           <Tabs defaultValue="login" className="w-full">
             <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="login">Login</TabsTrigger>
               <TabsTrigger value="signup">Sign Up</TabsTrigger>
             </TabsList>

             {/* Login Tab */}
             <TabsContent value="login" className="space-y-6 mt-6">
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                 <p className="text-muted-foreground">Sign in to access your dashboard</p>
               </div>

               {error && (
                 <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                   <p className="text-sm text-red-500">{error}</p>
                 </div>
               )}

               <form onSubmit={handleLogin} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-muted-foreground">Email</label>
                   <Input 
                     type="email" 
                     placeholder="name@example.com"
                     value={loginData.email}
                     onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                     className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-muted-foreground">Password</label>
                   <Input 
                     type="password" 
                     placeholder="••••••••"
                     value={loginData.password}
                     onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                     className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                     required
                   />
                 </div>
                 
                 <Button 
                   type="submit" 
                   className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                   disabled={isLoading}
                 >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
                 </Button>
               </form>
             </TabsContent>

             {/* Sign Up Tab */}
             <TabsContent value="signup" className="space-y-6 mt-6">
               <div className="space-y-2">
                 <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
                 <p className="text-muted-foreground">Join us to explore GitHub repositories</p>
               </div>

               {error && (
                 <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                   <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                   <p className="text-sm text-red-500">{error}</p>
                 </div>
               )}

               <form onSubmit={handleSignUp} className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-muted-foreground">Username</label>
                   <Input 
                     type="text" 
                     placeholder="johndoe"
                     value={signupData.username}
                     onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                     className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-muted-foreground">Email</label>
                   <Input 
                     type="email" 
                     placeholder="name@example.com"
                     value={signupData.email}
                     onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                     className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-muted-foreground">Password</label>
                   <Input 
                     type="password" 
                     placeholder="••••••••"
                     value={signupData.password}
                     onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                     className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                   <Input 
                     type="password" 
                     placeholder="••••••••"
                     value={signupData.confirmPassword}
                     onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                     className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
                     required
                   />
                 </div>
                 
                 <Button 
                   type="submit" 
                   className="w-full h-12 text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                   disabled={isLoading}
                 >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                 </Button>
               </form>
             </TabsContent>
           </Tabs>

           <div className="relative">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t border-white/10" />
             </div>
             <div className="relative flex justify-center text-xs uppercase">
               <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
             </div>
           </div>

           <Button 
             variant="outline" 
             className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 gap-2"
             onClick={handleGitHubLogin}
             disabled={isLoading}
           >
             <Github className="w-5 h-5" />
             Continue with GitHub
           </Button>
         </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-secondary/20 relative border-l border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/20 via-background to-background" />
        
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-4xl font-display font-bold mb-6">Analyze code at the speed of thought.</h2>
          <p className="text-xl text-muted-foreground mb-8">
            "RepoChat has completely transformed how I onboard to new codebases. It's like having the lead maintainer sitting next to you."
          </p>
          
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-white/10" />
             <div>
               <div className="font-bold">Alex Chen</div>
               <div className="text-sm text-muted-foreground">Senior Engineer at Vercel</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
