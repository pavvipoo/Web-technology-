import { useQuery } from "@tanstack/react-query";
import { searchGithubRepos, getTrendingRepos, getRepoDetails } from "@/api/github";

export function useGithubSearch(query: string, language?: string, minStars?: number) {
  return useQuery({
    queryKey: ["github", "search", query, language, minStars],
    queryFn: () => searchGithubRepos(query, language, minStars),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
}

export function useTrendingRepos() {
  return useQuery({
    queryKey: ["github", "trending"],
    queryFn: getTrendingRepos,
    staleTime: 1000 * 60 * 15, // 15 mins
  });
}

export function useRepoDetails(owner: string, name: string) {
  return useQuery({
    queryKey: ["github", "repo", owner, name],
    queryFn: () => getRepoDetails(owner, name),
    enabled: !!owner && !!name,
  });
}
