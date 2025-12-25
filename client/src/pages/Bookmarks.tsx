import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { RepoCard } from "@/components/RepoCard";
import { Bookmark, Inbox } from "lucide-react";

export default function Bookmarks() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { bookmarks } = useBookmarks();

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Saved Repositories</h1>
            <p className="text-muted-foreground">Your personal collection of interesting codebases.</p>
          </div>
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-40">
            <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold mb-2">No bookmarks yet</h3>
            <p>Start exploring and save repositories to see them here.</p>
          </div>
        )}
      </main>
    </div>
  );
}
