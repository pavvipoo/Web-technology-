import { useState } from "react";
import { AppNavbar } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGithubSearch } from "@/hooks/use-github";
import { RepoCard } from "@/components/RepoCard";
import { Search as SearchIcon, Loader2, Filter } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Search() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("");
  
  const { data: repos, isLoading, error } = useGithubSearch(searchTerm, language);

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-display font-bold mb-4">Find a Repository</h1>
          <p className="text-muted-foreground mb-8">
            Search across all of GitHub to find the codebase you want to analyze.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search repositories (e.g. facebook/react)..."
                className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 rounded-xl">
              Search
            </Button>
          </form>

          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" /> Filters:
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px] h-9 bg-transparent border-white/10 rounded-lg">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="go">Go</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-destructive">
            {(error as Error).message}
          </div>
        )}

        {repos && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        )}

        {!searchTerm && !isLoading && (
          <div className="text-center py-20 opacity-30">
            <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
              <SearchIcon className="w-10 h-10" />
            </div>
            <p className="text-xl font-medium">Enter a search term to begin</p>
          </div>
        )}
      </main>
    </div>
  );
}
