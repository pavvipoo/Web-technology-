import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Repository } from "@/hooks/use-search-history";
import { supabase } from "@/lib/firebase";

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

  // Load history from Supabase when userId changes
  useEffect(() => {
    if (!userId) {
      setHistory([]); // Clear on logout
      return;
    }
    fetch(`/api/user/search-history?userId=${encodeURIComponent(userId)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data.map((r: any) => ({
            query: r.query,
            timestamp: new Date(r.createdAt).getTime(),
            repositories: r.repositories || [],
            repoCount: (r.repositories || []).length,
          })));
        }
      })
      .catch(err => console.error("Failed to fetch search history:", err));
  }, [userId]);

  const addSearch = useCallback((query: string, repositories: Repository[]) => {
    if (!userId) return;
    const record: SearchRecord = { query, timestamp: Date.now(), repositories, repoCount: repositories.length };
    setHistory(prev => [record, ...prev].slice(0, 50));
    fetch("/api/user/search-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, query, repositories }),
    }).catch(err => console.error("Failed to save search:", err));
  }, [userId]);

  const clearHistory = useCallback(() => {
    if (!userId) return;
    setHistory([]);
    fetch(`/api/user/search-history?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    }).catch(err => console.error("Failed to clear search history:", err));
  }, [userId]);

  return (
    <SearchHistoryContext.Provider value={{ history, addSearch, clearHistory, count: history.length }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistoryContext() {
  const context = useContext(SearchHistoryContext);
  if (!context) throw new Error("useSearchHistoryContext must be used within SearchHistoryProvider");
  return context;
}
