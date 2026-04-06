import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSearchHistoryContext } from "@/contexts/SearchHistoryContext";
import { Redirect, Link } from "wouter";
import { Mail, Calendar, Settings, Github, MapPin, Globe, BookOpen, Clock, Star, Activity, Layout, Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { isAuthenticated, isLoading: authLoading, createdAt } = useAuth();
  const { bookmarks } = useBookmarks();
  const { history: searchHistoryData } = useSearchHistoryContext();
  const [userData, setUserData] = useState<{ username: string; email: string; joinDate: string; avatar?: string; bio?: string; location?: string; website?: string }>({
    username: "User",
    email: "user@example.com",
    joinDate: "",
    bio: "AI and code analysis passionate.",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata as any;
        setUserData(prev => ({
          ...prev,
          username: meta?.username || meta?.full_name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "user@example.com",
          avatar: meta?.avatar_url,
          joinDate: new Date(createdAt || session.user.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          }),
        }));
      }
    });
  }, [createdAt]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const bookmarkCount = bookmarks.length;
  const searchCount = searchHistoryData.length;
  const avatarInitial = userData.username?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar: Profile Info as per Image */}
        <aside className="md:col-span-1 space-y-6 animate-in fade-in slide-in-from-left duration-700">
          <div className="relative group">
            <Avatar className="w-full h-auto aspect-square rounded-full border-2 border-[#30363d] shadow-xl transition-all duration-300">
              {userData.avatar && <AvatarImage src={userData.avatar} alt={userData.username} />}
              <AvatarFallback className="text-6xl bg-[#161b22] text-white font-bold opacity-80">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white">{userData.username}</h1>
            <p className="text-xl text-[#8b949e] font-light">{userData.username}</p>
          </div>

          <div className="text-sm leading-relaxed text-[#c9d1d9] opacity-90">
            {userData.bio}
          </div>

          <Link href="/settings">
            <Button variant="outline" className="w-full mt-2 border-[#30363d] bg-[#21262d] hover:bg-[#30363d] hover:border-[#8b949e] text-sm font-semibold rounded-md">
              Edit profile
            </Button>
          </Link>

          <div className="pt-4 space-y-3 text-sm text-[#8b949e]">
            {userData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{userData.location}</span>
              </div>
            )}
            {userData.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a href={userData.website} target="_blank" className="text-[#58a6ff] hover:underline transition-all cursor-pointer">
                  {userData.website}
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {userData.joinDate}</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Tabs Navigation as per Image */}
          <div className="flex items-center gap-6 border-b border-[#30363d] pb-1 text-sm overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 px-1 pb-3 border-b-2 border-[#f78166] text-white font-semibold cursor-pointer">
              <BookOpen className="w-4 h-4" /> 
              <span>Overview</span>
            </div>
            <Link href="/bookmarks">
              <div className="flex items-center gap-2 px-1 pb-3 border-b-2 border-transparent text-[#8b949e] hover:text-white transition-all cursor-pointer">
                <Bookmark className="w-4 h-4" />
                <span>Repositories</span>
                <span className="px-2 py-0.5 bg-[#30363d] rounded-full text-xs text-[#c9d1d9] font-medium">{bookmarkCount || 0}</span>
              </div>
            </Link>
            <Link href="/history">
              <div className="flex items-center gap-2 px-1 pb-3 border-b-2 border-transparent text-[#8b949e] hover:text-white transition-all cursor-pointer">
                <Clock className="w-4 h-4" />
                <span>Recent Activity</span>
                <span className="px-2 py-0.5 bg-[#30363d] rounded-full text-xs text-[#c9d1d9] font-medium">{searchCount || 0}</span>
              </div>
            </Link>
          </div>

          {/* Stats Grid exactly as per Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#161b22] transition-colors group">
              <Activity className="w-5 h-5 text-green-400 mb-3" />
              <div className="text-2xl font-bold text-white leading-none">{searchCount}</div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mt-1">Searches</div>
            </div>
            <div className="p-5 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#161b22] transition-colors group">
              <Star className="w-5 h-5 text-yellow-400 mb-3" />
              <div className="text-2xl font-bold text-white leading-none">{bookmarkCount}</div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mt-1">Saved Repos</div>
            </div>
            <div className="p-5 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#161b22] transition-colors group">
              <Layout className="w-5 h-5 text-blue-400 mb-3" />
              <div className="text-2xl font-bold text-white leading-none">Pro</div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mt-1">Plan</div>
            </div>
            <div className="p-5 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#161b22] transition-colors group">
              <Github className="w-5 h-5 text-purple-400 mb-3" />
              <div className="text-2xl font-bold text-white leading-none">Linked</div>
              <div className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest mt-1">Github</div>
            </div>
          </div>

          {/* Popular repositories section matches the screenshot */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-white">Popular repositories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookmarks.slice(0, 4).map((repo: any) => (
                <div key={repo.id} className="p-4 rounded-xl border border-[#30363d] bg-transparent hover:bg-[#0d1117] transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[#8b949e]" />
                    <Link href={`/chat/${repo.owner.login}/${repo.name}`}>
                      <a className="text-sm font-semibold text-[#58a6ff] hover:underline">{repo.name}</a>
                    </Link>
                    <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] text-[#8b949e] font-medium leading-none">Public</span>
                  </div>
                  <p className="text-xs text-[#8b949e] line-clamp-2 min-h-8 mb-4">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-medium text-[#8b949e]">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary" />
                        <span>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </div>
                </div>
              ))}
              {bookmarks.length === 0 && (
                <div className="col-span-2 p-8 rounded-xl border-2 border-dashed border-[#30363d] text-center text-[#8b949e]">
                  Start bookmarking repositories to see them here!
                </div>
              )}
            </div>
          </section>

          {/* Recent activity matches the screenshot text */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold text-white">Recent activity</h3>
            <div className="rounded-xl border border-[#30363d] bg-transparent overflow-hidden">
               {searchHistoryData.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 p-5 border-b border-[#30363d] last:border-0 hover:bg-[#161b22] transition-all group">
                     <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4 text-[#8b949e]" />
                     </div>
                     <div className="space-y-1">
                        <div className="text-sm font-semibold text-white">Searched for "{item.query}"</div>
                        <div className="text-xs text-[#8b949e]">{new Date(item.timestamp).toDateString()}</div>
                     </div>
                  </div>
               ))}
               {searchHistoryData.length === 0 && (
                 <div className="p-8 text-center text-[#8b949e] italic">No recent activity detected.</div>
               )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
