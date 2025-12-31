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

import { useSearchHistoryContext } from "@/contexts/SearchHistoryContext";

export function useSearchHistory() {
  return useSearchHistoryContext();
}
