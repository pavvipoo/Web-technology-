import { useState, useEffect, useCallback } from "react";

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
  query: string;
  timestamp: number;
  repositories: Repository[];
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

  return {
    history,
    addSearch,
    clearHistory,
    count: history.length,
  };
}
