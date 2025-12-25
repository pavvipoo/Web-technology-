import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { User, Mail, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass-card rounded-3xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-between items-end">
              <div className="w-32 h-32 rounded-full bg-background p-1">
                <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-4xl">
                  👾
                </div>
              </div>
              <Button variant="outline" className="rounded-full border-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <h1 className="text-3xl font-bold font-display">Demo User</h1>
            <p className="text-muted-foreground mb-6">Full Stack Developer • Open Source Enthusiast</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span>user@example.com</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Joined January 2024</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="font-bold mb-4">Subscription Plan</h3>
              <div className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div>
                  <div className="font-bold text-primary">Pro Plan</div>
                  <div className="text-sm text-muted-foreground">Unlimited searches & chat history</div>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
                  Active
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
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
