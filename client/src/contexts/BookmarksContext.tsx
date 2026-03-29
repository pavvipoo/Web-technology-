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

  // Listen for auth state to get user id
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load bookmarks from Supabase when userId changes
  useEffect(() => {
    if (!userId) {
      setBookmarks([]); // Clear on logout
      return;
    }
    fetch(`/api/user/bookmarks?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setBookmarks(data);
      })
      .catch(err => console.error("Failed to fetch bookmarks:", err));
  }, [userId]);

  const addBookmark = useCallback((repo: GithubRepo) => {
    if (!userId) return;
    setBookmarks(prev => {
      if (prev.find(b => b.id === repo.id)) return prev;
      return [...prev, repo];
    });
    fetch("/api/user/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, repo }),
    }).catch(err => console.error("Failed to save bookmark:", err));
  }, [userId]);

  const removeBookmark = useCallback((repoId: number) => {
    if (!userId) return;
    setBookmarks(prev => prev.filter(b => b.id !== repoId));
    fetch(`/api/user/bookmarks/${repoId}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    }).catch(err => console.error("Failed to remove bookmark:", err));
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
