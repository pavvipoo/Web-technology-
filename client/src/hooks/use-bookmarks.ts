import { useState, useEffect } from "react";
import type { GithubRepo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<GithubRepo[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  const addBookmark = (repo: GithubRepo) => {
    if (bookmarks.find(b => b.id === repo.id)) return;
    
    const newBookmarks = [...bookmarks, repo];
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    
    toast({
      title: "Bookmarked!",
      description: `${repo.full_name} has been saved to your bookmarks.`,
    });
  };

  const removeBookmark = (repoId: number) => {
    const newBookmarks = bookmarks.filter(b => b.id !== repoId);
    setBookmarks(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    
    toast({
      title: "Removed",
      description: "Repository removed from bookmarks.",
    });
  };

  const isBookmarked = (repoId: number) => {
    return bookmarks.some(b => b.id === repoId);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
