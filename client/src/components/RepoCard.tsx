import { Star, GitFork, MessageSquare, Bookmark, ExternalLink } from "lucide-react";
import { type GithubRepo } from "@shared/schema";
import { Link } from "wouter";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

interface RepoCardProps {
  repo: GithubRepo;
  featured?: boolean;
}

export function RepoCard({ repo, featured = false }: RepoCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(repo.id);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(repo.id);
    } else {
      addBookmark(repo);
    }
  };

  return (
    <Link href={`/chat/${repo.owner.login}/${repo.name}`} className="block group">
      <div className={cn(
        "glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-primary/5 relative overflow-hidden",
        featured ? "bg-gradient-to-br from-card/80 to-primary/5" : ""
      )}>
        {/* Decorative gradient blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex items-start justify-between mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <img 
              src={repo.owner.avatar_url} 
              alt={repo.owner.login}
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <div>
              <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {repo.name}
              </h3>
              <p className="text-sm text-muted-foreground">{repo.owner.login}</p>
            </div>
          </div>
          
          <button 
            onClick={toggleBookmark}
            className={cn(
              "p-2 rounded-full hover:bg-white/5 transition-colors",
              bookmarked ? "text-yellow-400" : "text-muted-foreground"
            )}
          >
            <Bookmark className={cn("w-5 h-5", bookmarked && "fill-current")} />
          </button>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 h-10 relative z-10">
          {repo.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500/80" />
              <span>{repo.stargazers_count.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitFork className="w-4 h-4" />
              <span>{repo.forks_count.toLocaleString()}</span>
            </div>
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/50" />
                <span>{repo.language}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
            Chat <MessageSquare className="w-3 h-3 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
