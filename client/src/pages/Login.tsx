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
  const [successMessage, setSuccessMessage] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    email: "", 
    username: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

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
    const result = await loginAsNewUser(signupData.email, signupData.username, signupData.password);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || "Sign up failed");
      setSuccessMessage("");
    } else {
      // Clear form on success
      setSignupData({ email: "", username: "", password: "", confirmPassword: "" });
      setError("");
      setSuccessMessage("Check your Gmail and confirm it Only Only confirm And Come back and log in it");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
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
    const result = await loginAsExistingUser(loginData.email, loginData.password);
    if (!result.success) {
      setError(result.error || "Login failed");
    }
    setIsLoading(false);
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    const result = await loginWithGithub();
    if (!result.success) {
      setError(result.error || "GitHub login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: Login Form */}
      <div className="flex items-center justify-center p-4 sm:p-8 bg-background relative overflow-hidden">
         {/* Animated background decoration */}
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
         <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
         <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md space-y-8 relative z-10"
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
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 relative border-l border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-white/5 border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-primary">AI-Powered Analysis</span>
              </div>
              <h2 className="text-5xl font-display font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Analyze code at the speed of thought.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Powered by Gemini AI • Lightning-fast search • Real-time insights
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">🔍</span>
              </div>
              <div>
                <div className="font-semibold">Smart Search</div>
                <div className="text-sm text-muted-foreground">Find millions of repositories instantly</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">💬</span>
              </div>
              <div>
                <div className="font-semibold">AI Chat</div>
                <div className="text-sm text-muted-foreground">Ask about code, architecture, and more</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">📚</span>
              </div>
              <div>
                <div className="font-semibold">Bookmarks</div>
                <div className="text-sm text-muted-foreground">Save and organize your favorite repos</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4"
          >
             <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500" />
             <div>
               <div className="font-semibold text-sm">Trusted by developers</div>
               <div className="text-xs text-muted-foreground">Join 1000+ developers using GitHub Explorer</div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
