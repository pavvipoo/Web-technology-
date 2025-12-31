import type { GithubRepo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useBookmarks as useBookmarksContext } from "@/contexts/BookmarksContext";

export function useBookmarks() {
  const { bookmarks, addBookmark: contextAdd, removeBookmark: contextRemove, isBookmarked } = useBookmarksContext();
  const { toast } = useToast();

  const addBookmark = (repo: GithubRepo) => {
    if (isBookmarked(repo.id)) return;
    
    contextAdd(repo);
    toast({
      title: "Bookmarked!",
      description: `${repo.full_name} has been saved to your bookmarks.`,
    });
  };

  const removeBookmark = (repoId: number) => {
    contextRemove(repoId);
    toast({
      title: "Removed",
      description: "Repository removed from bookmarks.",
    });
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, count: bookmarks.length };
}
