import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { GithubRepo } from "@shared/schema";
import { supabase } from "@/lib/firebase";

interface BookmarksContextType {
  bookmarks: GithubRepo[];
  addBookmark: (repo: GithubRepo) => void;
  removeBookmark: (repoId: number) => void;
  isBookmarked: (repoId: number) => boolean;
  count: number;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined);

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<GithubRepo[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Listen for auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch bookmarks from Supabase when user logs in
  useEffect(() => {
    if (!userId) {
      setBookmarks([]);
      return;
    }
    supabase
      .from("bookmarks")
      .select("repo_data")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch bookmarks:", error.message);
          return;
        }
        if (data) {
          setBookmarks(data.map((row: any) => row.repo_data as GithubRepo));
        }
      });
  }, [userId]);

  const addBookmark = useCallback(async (repo: GithubRepo) => {
    if (!userId) return;
    // Optimistic UI update
    setBookmarks(prev => {
      if (prev.find(b => b.id === repo.id)) return prev;
      return [...prev, repo];
    });
    // Check if already exists to avoid duplicates
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", userId)
      .eq("repo_id", String(repo.id))
      .maybeSingle();
    if (existing) return; // Already saved
    // Save to Supabase
    const { error } = await supabase.from("bookmarks").insert({
      user_id: userId,
      repo_id: String(repo.id),
      repo_data: repo,
    });
    if (error) console.error("Failed to save bookmark:", error.message);
  }, [userId]);

  const removeBookmark = useCallback(async (repoId: number) => {
    if (!userId) return;
    // Optimistic UI update
    setBookmarks(prev => prev.filter(b => b.id !== repoId));
    // Delete from Supabase
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("repo_id", String(repoId));
    if (error) console.error("Failed to remove bookmark:", error.message);
  }, [userId]);

  const isBookmarked = useCallback((repoId: number) => {
    return bookmarks.some(b => b.id === repoId);
  }, [bookmarks]);

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, count: bookmarks.length }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context) throw new Error("useBookmarks must be used within BookmarksProvider");
  return context;
}
