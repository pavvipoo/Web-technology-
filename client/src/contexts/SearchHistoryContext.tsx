import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Repository } from "@/hooks/use-search-history";

export interface SearchRecord {
  query: string;
  timestamp: number;
  repositories: Repository[];
  repoCount: number;
}

interface SearchHistoryContextType {
  history: SearchRecord[];
  addSearch: (query: string, repositories: Repository[]) => void;
  clearHistory: () => void;
  count: number;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<SearchRecord[]>([]);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "searchHistory" && e.newValue) {
        try {
          setHistory(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Failed to parse search history", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addSearch = useCallback((query: string, repositories: Repository[]) => {
    setHistory(prev => {
      const updated = [{ query, timestamp: Date.now(), repositories, repoCount: repositories.length }, ...prev].slice(0, 50);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.setItem("searchHistory", JSON.stringify([]));
  }, []);

  return (
    <SearchHistoryContext.Provider value={{ history, addSearch, clearHistory, count: history.length }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistoryContext() {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error("useSearchHistoryContext must be used within SearchHistoryProvider");
  }
  return context;
}
