import { z } from "zod";
import { githubRepoSchema, type GithubRepo } from "@shared/schema";

const GITHUB_API_BASE = "https://api.github.com";

export async function searchGithubRepos(
  query: string, 
  language?: string, 
  minStars: number = 0
): Promise<GithubRepo[]> {
  if (!query) return [];

  let q = query;
  if (language) q += `+language:${language}`;
  if (minStars > 0) q += `+stars:>=${minStars}`;

  const res = await fetch(`${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc`);
  
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to fetch repositories");
  }

  const data = await res.json();
  // We manually validate the array items, filtering out any that don't match our schema strictness if needed
  // specific github response shape: { total_count: number, items: [] }
  return data.items.map((item: any) => githubRepoSchema.parse(item));
}

export async function getTrendingRepos(): Promise<GithubRepo[]> {
  // Simulating "trending" by searching for high star counts created recently or general popular repos
  // Real trending API is not public, so we search for stars > 1000 sorted by updated
  const q = "stars:>1000";
  const res = await fetch(`${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=10`);
  
  if (!res.ok) throw new Error("Failed to fetch trending repos");

  const data = await res.json();
  return data.items.map((item: any) => githubRepoSchema.parse(item));
}

export async function getRepoDetails(owner: string, name: string): Promise<GithubRepo> {
  const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${name}`);
  if (!res.ok) throw new Error("Repo not found");
  return githubRepoSchema.parse(await res.json());
}
