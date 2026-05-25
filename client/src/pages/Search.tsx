import { useState, useEffect } from "react";
import { AppNavbar } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGithubSearch } from "@/hooks/use-github";
import { useSearchHistory } from "@/hooks/use-search-history";
import { RepoCard } from "@/components/RepoCard";
import { Search as SearchIcon, Loader2, Filter, Mic } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Search() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addSearch } = useSearchHistory();
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const { data: repos, isLoading, error } = useGithubSearch(searchTerm, language);

  // Save repositories to search history when results arrive
  useEffect(() => {
    if (repos && repos.length > 0 && searchTerm) {
      addSearch(searchTerm, repos);
    }
  }, [repos, searchTerm, addSearch]);

  if (authLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      // Clean up the spoken text (remove trailing periods that some speech APIs add)
      const cleanTranscript = transcript.trim().replace(/\.$/, "");
      setQuery(cleanTranscript);
      setSearchTerm(cleanTranscript);
    };

    recognition.start();
  };

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
                placeholder={isListening ? "Listening... Speak now!" : "Search repositories (e.g. facebook/react)..."}
                className={`h-12 pl-12 pr-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/20 transition-all duration-300 ${
                  isListening ? "ring-2 ring-primary/50 border-primary bg-primary/5 placeholder-primary/50" : ""
                }`}
              />
              <button
                type="button"
                onClick={startListening}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-300 ${
                  isListening
                    ? "text-red-500 bg-red-500/10 animate-pulse scale-110"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
                title="Search by voice"
              >
                <Mic className={`w-5 h-5 ${isListening ? "animate-bounce" : ""}`} />
              </button>
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
