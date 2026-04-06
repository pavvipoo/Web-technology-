import { useState, useCallback } from "react";
import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSearchHistoryContext } from "@/contexts/SearchHistoryContext";
import { Redirect, useLocation } from "wouter";
import { supabase } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Lock, Shield, Bell, LogOut, ChevronRight, Check, X, CreditCard, Smartphone, Monitor, Palette, HelpCircle, History, ArrowLeft, Inbox, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { 
    id: "profile", 
    label: "Edit Profile", 
    desc: "Update your name, bio and personal avatar", 
    icon: User, 
    color: "text-blue-400", 
    bgColor: "bg-blue-400/10" 
  },
  { 
    id: "password", 
    label: "Login & Security", 
    desc: "Edit password and security settings", 
    icon: Lock, 
    color: "text-orange-400", 
    bgColor: "bg-orange-400/10" 
  },
  { 
    id: "privacy", 
    label: "Privacy & Data", 
    desc: "Manage search records and account data", 
    icon: Shield, 
    color: "text-green-400", 
    bgColor: "bg-green-400/10" 
  },
  { 
    id: "history", 
    label: "Your Activity", 
    desc: "View recent searches and dashboard metrics", 
    icon: History, 
    color: "text-purple-400", 
    bgColor: "bg-purple-400/10" 
  },
  { 
    id: "notifications", 
    label: "Communications", 
    desc: "Update email preferences and update alerts", 
    icon: Bell, 
    color: "text-yellow-400", 
    bgColor: "bg-yellow-400/10" 
  },
  { 
    id: "payments", 
    label: "Direct Payments", 
    desc: "Manage your pro subscriptions and billing", 
    icon: CreditCard, 
    color: "text-indigo-400", 
    bgColor: "bg-indigo-400/10" 
  },
  { 
    id: "appearance", 
    label: "Display & Theme", 
    desc: "Switch between dark, light and high contrast", 
    icon: Palette, 
    color: "text-pink-400", 
    bgColor: "bg-pink-400/10" 
  },
  { 
    id: "support", 
    label: "Customer Support", 
    desc: "Chat with us for help or report technical bugs", 
    icon: HelpCircle, 
    color: "text-cyan-400", 
    bgColor: "bg-cyan-400/10" 
  },
];

export default function Settings() {
  const { isAuthenticated, isLoading, email, username, logout } = useAuth();
  const { clearHistory } = useSearchHistoryContext();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Profile
  const [displayName, setDisplayName] = useState(username || "");
  const [profileMsg, setProfileMsg] = useState("");

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // Privacy
  const [saveSearch, setSaveSearch] = useState(
    localStorage.getItem("privacy_saveSearch") !== "false"
  );
  const [privacyMsg, setPrivacyMsg] = useState("");

  const handleProfileSave = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: displayName },
      });
      setProfileMsg(error ? `Error: ${error.message}` : "✅ Profile updated!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch {
      setProfileMsg("❌ Failed to update profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setPasswordMsg(error ? `Error: ${error.message}` : "✅ Password changed!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 3000);
    } catch {
      setPasswordMsg("❌ Failed to change password.");
    }
  };

  const handlePrivacySave = () => {
    localStorage.setItem("privacy_saveSearch", String(saveSearch));
    setPrivacyMsg("✅ Privacy settings saved!");
    setTimeout(() => setPrivacyMsg(""), 2000);
  };

  const handleClearHistory = async () => {
    clearHistory();
    setPrivacyMsg("✅ Search history cleared!");
    setTimeout(() => setPrivacyMsg(""), 2000);
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans pb-20">
      <AppNavbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        
        <AnimatePresence mode="wait">
          {!activeTab ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#30363d]">
                 <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white">Your Account</h1>
                    <p className="text-[#8b949e] mt-2">Manage your profile, security, and AI preferences.</p>
                 </div>
                 <div className="flex items-center gap-4 bg-[#161b22] p-4 rounded-2xl border border-[#30363d] shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                       {username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                       <div className="font-bold text-white">{username}</div>
                       <div className="text-xs text-[#8b949e]">{email}</div>
                    </div>
                 </div>
              </div>

              {/* Grid Layout inspired by Amazon/Flipkart - Now in Dark Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <motion.button
                      key={cat.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (cat.id === "history") setLocation("/history");
                        else setActiveTab(cat.id);
                      }}
                      className="group flex gap-5 p-6 bg-[#161b22]/50 border border-[#30363d] rounded-2xl text-left hover:border-primary/50 hover:bg-[#161b22] hover:shadow-xl hover:shadow-primary/5 transition-all"
                    >
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", cat.bgColor)}>
                        <Icon className={cn("w-7 h-7", cat.color)} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{cat.label}</h3>
                        <p className="text-sm text-[#8b949e] leading-tight">{cat.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="pt-10 flex justify-center">
                 <Button 
                   variant="ghost" 
                   onClick={handleLogout}
                   className="text-red-400 hover:text-red-300 hover:bg-red-400/5 px-8 h-12 rounded-xl border border-red-400/20"
                 >
                   <LogOut className="w-4 h-4 mr-2" />
                   Sign out of all sessions
                 </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-2 text-primary hover:underline font-medium mb-10 transition-all font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Your Account</span>
              </button>

              <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-8 sm:p-12 shadow-2xl min-h-[500px]">
                
                 {activeTab === "profile" && (
                    <div className="space-y-12 max-w-2xl">
                       <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-white">Edit Profile</h2>
                          <p className="text-[#8b949e]">Update your public identity on CodeHunt.</p>
                       </div>
                       
                       <div className="space-y-6">
                          <div className="space-y-3">
                             <Label className="font-bold text-base text-white">Username</Label>
                             <Input 
                               value={displayName} 
                               onChange={e => setDisplayName(e.target.value)}
                               className="h-12 rounded-xl bg-[#0d1117] border-[#30363d] text-white focus:ring-primary"
                             />
                          </div>

                          <div className="space-y-3">
                             <Label className="font-bold text-base text-white">Bio</Label>
                             <textarea 
                               placeholder="Tell us about yourself..."
                               className="w-full h-32 p-4 rounded-xl bg-[#0d1117] border border-[#30363d] text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                             />
                          </div>
                          
                          <div className="pt-6 border-t border-[#30363d]">
                            <Button onClick={handleProfileSave} className="h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-white">
                               Update Profile
                            </Button>
                            {profileMsg && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm mt-4 text-green-400 font-bold">{profileMsg}</motion.p>}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "password" && (
                    <div className="space-y-12 max-w-2xl">
                       <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-white">Login & Security</h2>
                          <p className="text-[#8b949e]">Keep your account secure with a strong password.</p>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-3">
                             <Label className="font-bold text-base text-white">New Password</Label>
                             <Input 
                               type="password"
                               value={newPassword}
                               onChange={e => setNewPassword(e.target.value)}
                               className="h-12 rounded-xl bg-[#0d1117] border-[#30363d] text-white"
                             />
                          </div>
                          <div className="space-y-3">
                             <Label className="font-bold text-base text-white">Confirm Password</Label>
                             <Input 
                               type="password"
                               value={confirmPassword}
                               onChange={e => setConfirmPassword(e.target.value)}
                               className="h-12 rounded-xl bg-[#0d1117] border-[#30363d] text-white"
                             />
                          </div>
                          
                          <div className="pt-6 border-t border-[#30363d]">
                             <Button onClick={handlePasswordChange} className="h-12 px-10 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 text-white">
                               Update Security
                             </Button>
                             {passwordMsg && <p className="text-sm mt-4 text-red-400 font-bold">{passwordMsg}</p>}
                          </div>
                       </div>
                    </div>
                 )}

                 {activeTab === "privacy" && (
                    <div className="space-y-12 max-w-2xl">
                       <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-white">Privacy & Data</h2>
                          <p className="text-[#8b949e]">You control your data. Manage search records below.</p>
                       </div>

                       <div className="space-y-8">
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-[#0d1117] border border-[#30363d]">
                             <div>
                                <p className="font-bold text-lg text-white">Save Search History</p>
                                <p className="text-sm text-[#8b949e]">Store repository searches in your cloud account.</p>
                             </div>
                             <Switch checked={saveSearch} onCheckedChange={setSaveSearch} />
                          </div>

                          <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-red-400/10 bg-red-400/5">
                             <div>
                                <p className="font-bold text-lg text-red-400">Delete Search History</p>
                                <p className="text-sm text-red-400/70">Permanently wipe all records of recent searches.</p>
                             </div>
                             <Button variant="destructive" size="sm" onClick={handleClearHistory} className="h-10 px-6 rounded-xl font-bold shadow-lg shadow-red-400/10">
                                Wipe History
                             </Button>
                          </div>

                          <div className="pt-6 border-t border-[#30363d]">
                            <Button onClick={handlePrivacySave} variant="outline" className="h-12 px-10 rounded-xl border-[#30363d] text-white font-bold hover:bg-[#21262d]">
                               Save Privacy Settings
                            </Button>
                            {privacyMsg && <p className="text-sm mt-4 text-green-400 font-bold">{privacyMsg}</p>}
                          </div>
                       </div>
                    </div>
                 )}

                 {["notifications", "payments", "appearance", "support"].includes(activeTab || "") && (
                    <div className="flex flex-col items-center justify-center space-y-8 h-[400px]">
                       <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <Inbox className="w-12 h-12 opacity-50" />
                       </div>
                       <div className="text-center space-y-3">
                          <h2 className="text-3xl font-extrabold text-white">Feature In Progress</h2>
                          <p className="text-[#8b949e] max-w-sm mx-auto">We're developing high-level marketplace and notification features powered by AI. Stay tuned!</p>
                       </div>
                       <Button onClick={() => setActiveTab(null)} variant="outline" className="h-12 px-10 rounded-xl border-[#30363d] text-white font-bold hover:bg-[#21262d]">
                          Back to Dashboard
                       </Button>
                    </div>
                 )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
