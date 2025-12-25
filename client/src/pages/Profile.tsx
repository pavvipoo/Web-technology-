import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "user@example.com";
  const userType = localStorage.getItem("userType") || "existing";
  const avatar = localStorage.getItem("avatar");
  const joinDate = localStorage.getItem("joinDate")
    ? new Date(localStorage.getItem("joinDate")!).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "January 2024";

  const loginTypeLabel = 
    userType === "new" ? "New User" :
    userType === "github" ? "GitHub User" : 
    "Existing User";

  const avatarInitial = username?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass-card rounded-3xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <Avatar className="w-32 h-32 border-4 border-background">
                {avatar && <AvatarImage src={avatar} alt={username} />}
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="text-3xl font-bold font-display">{username}</h1>
            <p className="text-muted-foreground mb-6">
              <span className="inline-block px-2 py-1 bg-white/5 rounded-full text-sm mt-2 border border-white/10">
                {loginTypeLabel}
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 mb-8">
              <h3 className="font-bold mb-4">Account Type</h3>
              <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div>
                  <div className="font-bold text-primary capitalize">{loginTypeLabel}</div>
                  <div className="text-sm text-muted-foreground">
                    {userType === "new" && "New account created"}
                    {userType === "existing" && "Returning user"}
                    {userType === "github" && "Connected via GitHub"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
               <Button variant="destructive" onClick={logout} className="w-full sm:w-auto">
                 Sign Out
               </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
