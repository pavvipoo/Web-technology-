import { useState } from "react";
import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useSearchHistoryContext } from "@/contexts/SearchHistoryContext";
import { Redirect, useLocation } from "wouter";
import { supabase } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Lock, Shield, Bell, LogOut, ChevronRight, Check, X } from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "privacy", label: "Privacy & Data", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "logout", label: "Logout", icon: LogOut },
];

export default function Settings() {
  const { isAuthenticated, isLoading, email, username, logout } = useAuth();
  const { clearHistory } = useSearchHistoryContext();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

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

  // Notifications
  const [notifyUpdates, setNotifyUpdates] = useState(
    localStorage.getItem("notify_updates") !== "false"
  );
  const [notifyTips, setNotifyTips] = useState(
    localStorage.getItem("notify_tips") === "true"
  );

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

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

  const handleNotificationSave = () => {
    localStorage.setItem("notify_updates", String(notifyUpdates));
    localStorage.setItem("notify_tips", String(notifyTips));
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold font-display mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-56 flex-shrink-0">
            <nav className="glass-card rounded-2xl p-2 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    } ${tab.id === "logout" ? "text-red-400 hover:text-red-300 hover:bg-red-500/5" : ""}`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isActive && tab.id !== "logout" && <ChevronRight className="ml-auto w-4 h-4" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Panel */}
          <div className="flex-1 glass-card rounded-2xl p-6">

            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Display Name</Label>
                    <Input
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Email</Label>
                    <Input value={email || ""} disabled className="bg-white/5 border-white/10 opacity-50 cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
                  </div>
                  <Button onClick={handleProfileSave} className="gap-2">
                    <Check className="w-4 h-4" /> Save Changes
                  </Button>
                  {profileMsg && <p className="text-sm">{profileMsg}</p>}
                </div>
              </div>
            )}

            {/* Change Password */}
            {activeTab === "password" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-1 block">Confirm New Password</Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button onClick={handlePasswordChange} className="gap-2">
                    <Lock className="w-4 h-4" /> Update Password
                  </Button>
                  {passwordMsg && <p className="text-sm">{passwordMsg}</p>}
                </div>
              </div>
            )}

            {/* Privacy & Data */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Privacy & Data</h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="font-medium">Save Search History</p>
                      <p className="text-xs text-muted-foreground mt-1">Search queries are stored in your account</p>
                    </div>
                    <Switch checked={saveSearch} onCheckedChange={setSaveSearch} />
                  </div>
                  <Button variant="outline" onClick={handlePrivacySave} className="gap-2">
                    <Check className="w-4 h-4" /> Save Privacy Settings
                  </Button>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Manage your stored data</p>
                    <Button variant="destructive" size="sm" onClick={handleClearHistory} className="gap-2">
                      <X className="w-4 h-4" /> Clear Search History
                    </Button>
                  </div>
                  {privacyMsg && <p className="text-sm">{privacyMsg}</p>}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-xs text-muted-foreground mt-1">News about new features and improvements</p>
                    </div>
                    <Switch
                      checked={notifyUpdates}
                      onCheckedChange={v => { setNotifyUpdates(v); localStorage.setItem("notify_updates", String(v)); }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="font-medium">AI Tips</p>
                      <p className="text-xs text-muted-foreground mt-1">Get weekly tips from AI insights analysis</p>
                    </div>
                    <Switch
                      checked={notifyTips}
                      onCheckedChange={v => { setNotifyTips(v); localStorage.setItem("notify_tips", String(v)); }}
                    />
                  </div>
                  <Button variant="outline" onClick={handleNotificationSave} className="gap-2">
                    <Check className="w-4 h-4" /> Save Notification Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Logout */}
            {activeTab === "logout" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Sign Out</h2>
                <p className="text-muted-foreground text-sm">
                  You'll be signed out of your account. All your data (bookmarks, chats, search history) remains 
                  safely stored in the database and will be available when you sign in again.
                </p>
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <p className="text-sm text-red-400">⚠️ Your data will NOT be deleted. Only your session will end.</p>
                </div>
                <Button variant="destructive" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
