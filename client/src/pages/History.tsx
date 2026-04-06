import { AppNavbar } from "@/components/Navigation";
import { useSearchHistoryContext } from "@/contexts/SearchHistoryContext";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Clock, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function History() {
  const { isAuthenticated, isLoading } = useAuth();
  const { history, clearHistory } = useSearchHistoryContext();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              Search History
            </h1>
            <p className="text-muted-foreground mt-2">Manage your recent searches and repository data.</p>
          </div>
          {history.length > 0 && (
            <Button variant="destructive" className="gap-2" onClick={() => clearHistory()}>
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center">
            <Search className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-muted-foreground">Your recent search history will appear here.</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-2 sm:p-4">
            {history.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Search className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{item.query}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
