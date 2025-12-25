import { AppNavbar } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useTrendingRepos } from "@/hooks/use-github";
import { RepoCard } from "@/components/RepoCard";
import { Loader2, Flame } from "lucide-react";

export default function Trending() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: repos, isLoading, error } = useTrendingRepos();

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Trending Repositories</h1>
            <p className="text-muted-foreground">The most popular projects on GitHub today.</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">
            {(error as Error).message}
          </div>
        )}

        {repos && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} featured />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
