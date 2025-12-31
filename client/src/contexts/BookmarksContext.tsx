import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { GithubRepo } from "@shared/schema";

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

  // Load bookmarks on mount
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

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bookmarks" && e.newValue) {
        try {
          setBookmarks(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Failed to parse bookmarks", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addBookmark = useCallback((repo: GithubRepo) => {
    setBookmarks(prev => {
      if (prev.find(b => b.id === repo.id)) return prev;
      const newBookmarks = [...prev, repo];
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

  const removeBookmark = useCallback((repoId: number) => {
    setBookmarks(prev => {
      const newBookmarks = prev.filter(b => b.id !== repoId);
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  }, []);

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
  if (!context) {
    throw new Error("useBookmarks must be used within BookmarksProvider");
  }
  return context;
}
