import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSearchHistoryContext } from "@/contexts/SearchHistoryContext";
import { Redirect, Link } from "wouter";
import { Mail, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function Profile() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { bookmarks } = useBookmarks();
  const { history: searchHistoryData } = useSearchHistoryContext();
  const [userData, setUserData] = useState<{ username: string; email: string; joinDate: string; avatar?: string }>({
    username: "User",
    email: "user@example.com",
    joinDate: "January 2024",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata as any;
        setUserData({
          username: meta?.username || meta?.full_name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "user@example.com",
          avatar: meta?.avatar_url,
          joinDate: new Date(session.user.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          }),
        });
      }
    });
  }, []);

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const bookmarkCount = bookmarks.length;
  const searchCount = searchHistoryData.length;
  const avatarInitial = userData.username?.charAt(0).toUpperCase() || "U";

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
                {userData.avatar && <AvatarImage src={userData.avatar} alt={userData.username} />}
                <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>
              <Link href="/settings">
                <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </Link>
            </div>

            <h1 className="text-3xl font-bold font-display">{userData.username}</h1>
            <p className="text-muted-foreground mb-6">
              <span className="inline-block px-2 py-1 bg-white/5 rounded-full text-sm mt-2 border border-white/10">
                GitHub Explorer Pro User
              </span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 mb-8">
              <h3 className="font-bold mb-4">Your Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold text-primary">{bookmarkCount}</div>
                  <div className="text-sm text-muted-foreground">Bookmarked Repos</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <div className="text-2xl font-bold text-purple-400">{searchCount}</div>
                  <div className="text-sm text-muted-foreground">Search History</div>
                </div>
              </div>
            </div>

            {searchHistoryData.length > 0 && (
              <div className="border-t border-white/10 pt-8 mb-8">
                <h3 className="font-bold mb-4">Recent Searches</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchHistoryData.slice(0, 10).map((item: any, idx: number) => (
                    <div key={idx} className="text-sm p-3 rounded bg-white/5 border border-white/5 hover:border-primary/20">
                      <div className="font-medium text-white">{item.query}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Link href="/settings">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Settings className="w-4 h-4" />
                  Manage Settings & Sign Out
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
