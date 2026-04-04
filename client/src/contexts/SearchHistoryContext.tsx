import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/firebase";

export interface Repository {
  id: number;
  full_name: string;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface SearchRecord {
  id?: number;
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

  // Fetch search history from Supabase when user logs in
  useEffect(() => {
    if (!userId) {
      setHistory([]);
      return;
    }
    supabase
      .from("search_history")
      .select("id, query, repositories, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to fetch search history:", error.message);
          return;
        }
        if (data) {
          setHistory(data.map((row: any) => ({
            id: row.id,
            query: row.query,
            timestamp: new Date(row.created_at).getTime(),
            repositories: row.repositories || [],
            repoCount: (row.repositories || []).length,
          })));
        }
      });
  }, [userId]);

  const addSearch = useCallback(async (query: string, repositories: Repository[]) => {
    if (!userId) return;
    const record: SearchRecord = {
      query,
      timestamp: Date.now(),
      repositories,
      repoCount: repositories.length,
    };
    // Optimistic UI update
    setHistory(prev => [record, ...prev].slice(0, 50));
    // Save to Supabase
    const { error } = await supabase.from("search_history").insert({
      user_id: userId,
      query,
      repositories,
    });
    if (error) console.error("Failed to save search:", error.message);
  }, [userId]);

  const clearHistory = useCallback(async () => {
    if (!userId) return;
    setHistory([]);
    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("user_id", userId);
    if (error) console.error("Failed to clear history:", error.message);
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
