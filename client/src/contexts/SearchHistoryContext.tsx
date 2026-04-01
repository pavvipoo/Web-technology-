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

const STORAGE_KEY_PREFIX = "repochat_search_history_";

function loadHistory(userId: string): SearchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to load search history from localStorage:", e);
  }
  return [];
}

function saveHistory(userId: string, history: SearchRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save search history to localStorage:", e);
  }
}

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

  // Load history from localStorage when userId changes
  useEffect(() => {
    if (!userId) {
      setHistory([]);
      return;
    }
    const saved = loadHistory(userId);
    setHistory(saved);
  }, [userId]);

  const addSearch = useCallback((query: string, repositories: Repository[]) => {
    if (!userId) return;
    const record: SearchRecord = { query, timestamp: Date.now(), repositories, repoCount: repositories.length };
    setHistory(prev => {
      const updated = [record, ...prev].slice(0, 50);
      saveHistory(userId, updated);
      return updated;
    });
  }, [userId]);

  const clearHistory = useCallback(() => {
    if (!userId) return;
    setHistory([]);
    saveHistory(userId, []);
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
