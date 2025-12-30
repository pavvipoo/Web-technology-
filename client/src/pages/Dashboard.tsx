import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Link, Redirect } from "wouter";
import { motion } from "framer-motion";
import { Search, TrendingUp, Bookmark, Github, ArrowRight } from "lucide-react";
import { useTrendingRepos } from "@/hooks/use-github";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSearchHistory } from "@/hooks/use-search-history";
import { RepoCard } from "@/components/RepoCard";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { isAuthenticated, isLoading, username } = useAuth();
  const { data: trending, isLoading: isLoadingTrending } = useTrendingRepos();
  const { count: bookmarkCount } = useBookmarks();
  const { count: searchCount } = useSearchHistory();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const stats = [
    { label: "Bookmarked Repos", value: bookmarkCount.toString(), icon: Bookmark, color: "text-blue-400" },
    { label: "Recent Searches", value: searchCount.toString(), icon: Search, color: "text-purple-400" },
    { label: "Code Analyzed", value: searchCount > 0 ? "1.2M" : "0", icon: Github, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {username || "Developer"}</h1>
          <p className="text-muted-foreground">Here's what's happening in your developer universe today.</p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                <div className="text-3xl font-bold font-mono">{stat.value}</div>
              </div>
              <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Explore Repositories</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Search through millions of public repositories and start chatting with their codebase instantly.
              </p>
              <Link href="/search">
                <Button className="rounded-xl">
                  Start Searching <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">See What's Trending</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Discover the hottest repositories on GitHub right now and see what everyone is building.
              </p>
              <Link href="/trending">
                <Button variant="outline" className="rounded-xl border-white/10">
                  View Trending
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trending Section Preview */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <Link href="/trending" className="text-sm text-primary hover:underline">View All</Link>
        </div>

        {isLoadingTrending ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending?.slice(0, 3).map((repo) => (
              <RepoCard key={repo.id} repo={repo} featured />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
