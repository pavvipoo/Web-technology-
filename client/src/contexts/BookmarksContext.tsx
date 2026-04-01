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

const STORAGE_KEY_PREFIX = "repochat_bookmarks_";

function loadBookmarks(userId: string): GithubRepo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to load bookmarks from localStorage:", e);
  }
  return [];
}

function saveBookmarks(userId: string, bookmarks: GithubRepo[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(bookmarks));
  } catch (e) {
    console.error("Failed to save bookmarks to localStorage:", e);
  }
}

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

  // Load bookmarks from localStorage when userId changes
  useEffect(() => {
    if (!userId) {
      setBookmarks([]);
      return;
    }
    const saved = loadBookmarks(userId);
    setBookmarks(saved);
  }, [userId]);

  const addBookmark = useCallback((repo: GithubRepo) => {
    if (!userId) return;
    setBookmarks(prev => {
      if (prev.find(b => b.id === repo.id)) return prev;
      const updated = [...prev, repo];
      saveBookmarks(userId, updated);
      return updated;
    });
  }, [userId]);

  const removeBookmark = useCallback((repoId: number) => {
    if (!userId) return;
    setBookmarks(prev => {
      const updated = prev.filter(b => b.id !== repoId);
      saveBookmarks(userId, updated);
      return updated;
    });
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
