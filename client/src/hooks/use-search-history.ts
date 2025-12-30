import { useState, useEffect, useCallback } from "react";

export interface SearchRecord {
  query: string;
  timestamp: number;
  repoCount: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchRecord[]>([]);

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

  const addSearch = useCallback((query: string, repoCount: number) => {
    setHistory(prev => {
      const updated = [{ query, timestamp: Date.now(), repoCount }, ...prev].slice(0, 50);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.setItem("searchHistory", JSON.stringify([]));
  }, []);

  return {
    history,
    addSearch,
    clearHistory,
    count: history.length,
  };
}
