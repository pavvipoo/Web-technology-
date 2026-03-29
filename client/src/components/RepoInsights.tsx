import { useState, useEffect, useRef } from "react";
import { Loader2, ShieldCheck, Gauge, Lightbulb, Share2, Sparkles } from "lucide-react";
import mermaid from "mermaid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif'
});

interface RepoInsightsProps {
  repoName: string;
  description?: string | null;
  language?: string | null;
}

interface InsightsData {
  health_score: {
    total: number;
    quality: number;
    security: number;
    maintenance: number;
  };
  architecture_mermaid: string;
  top_tips: string[];
  summary: string;
}

export function RepoInsights({ repoName, description, language }: RepoInsightsProps) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/repo-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName, description, language }),
      });
      
      if (res.status === 429) {
        throw new Error("⏳ AI quota limit reached. Please wait a minute and try again.");
      }
      if (!res.ok) throw new Error("Failed to generate AI insights. Please try again.");
      const insights = await res.json();
      setData(insights);
      setIsGenerated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sanitizeMermaid = (code: string) => {
    // Ensure it starts with flowchart TD
    let sanitized = code.trim();
    if (!sanitized.startsWith("flowchart") && !sanitized.startsWith("graph")) {
      sanitized = "flowchart TD\n" + sanitized;
    }

    // Step 1: Remove all double quotes to avoid nested quote issues
    sanitized = sanitized.replace(/"/g, "");

    // Step 2: Sanitize labels inside [], (), {} by removing special characters and then quoting
    // We target common Mermaid node shapes
    sanitized = sanitized.replace(/\[([^\]]+)\]/g, (match, label) => {
      const safeLabel = label.replace(/[\[\]\(\)\{\}"]/g, " ").trim();
      return `["${safeLabel}"]`;
    });
    
    sanitized = sanitized.replace(/\(([^\)]+)\)/g, (match, label) => {
        const safeLabel = label.replace(/[\[\]\(\)\{\}"]/g, " ").trim();
        return `("${safeLabel}")`;
    });

    sanitized = sanitized.replace(/\{([^\}]+)\}/g, (match, label) => {
        const safeLabel = label.replace(/[\[\]\(\)\{\}"]/g, " ").trim();
        return `{"${safeLabel}"}`;
    });

    // Final safety: Fix unclosed braces and parentheses
    const openBraces = (sanitized.match(/\{/g) || []).length;
    const closeBraces = (sanitized.match(/\}/g) || []).length;
    if (openBraces > closeBraces) sanitized += "}".repeat(openBraces - closeBraces);

    const openParens = (sanitized.match(/\(/g) || []).length;
    const closeParens = (sanitized.match(/\)/g) || []).length;
    if (openParens > closeParens) sanitized += ")".repeat(openParens - closeParens);

    return sanitized;
  };

  useEffect(() => {
    if (data?.architecture_mermaid && mermaidRef.current) {
      const renderDiagram = async () => {
        try {
          const sanitized = sanitizeMermaid(data.architecture_mermaid);
          mermaidRef.current!.innerHTML = "";
          const { svg } = await mermaid.render(`mermaid-${Date.now()}`, sanitized);
          mermaidRef.current!.innerHTML = svg;
          
          // Force remove any global mermaid error overlays
          const overlays = document.querySelectorAll('.mermaid-error-overlay, #mermaid-error-overlay');
          overlays.forEach(el => el.remove());
        } catch (e) {
          console.error("Mermaid render error:", e);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `
              <div class="flex flex-col items-center justify-center p-8 text-center bg-destructive/5 rounded-xl border border-destructive/10">
                <p class="text-sm text-destructive font-medium">Architecture Map syntax error.</p>
                <p class="text-[10px] text-muted-foreground mt-2 font-mono break-all opacity-50">
                  ${(e as Error).message.slice(0, 100)}...
                </p>
              </div>
            `;
          }
        }
      };
      renderDiagram();
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-lg">AI is mapping out the architecture...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6">
        <div className="p-8 text-center glass-card border-red-500/20 bg-red-500/5 rounded-2xl max-w-md w-full">
          <p className="text-destructive font-medium mb-4">{error}</p>
          <Button variant="outline" onClick={fetchInsights} className="border-red-500/20 hover:bg-red-500/10">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!isGenerated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
          <div className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-xl">
            <Gauge className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>
        
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-bold font-display mb-2">Ready for Deep Analysis?</h3>
          <p className="text-muted-foreground text-sm">
            AI will scan the <strong>{repoName}</strong> codebase to generate health scores, 
            detect security issues, and map out the architecture.
          </p>
        </div>

        <Button 
          size="lg" 
          onClick={fetchInsights}
          className="h-14 px-8 rounded-2xl gap-3 text-base shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Generate GitHub Explorer Pro Insights
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Card */}
      <Card className="glass-card border-white/10 bg-white/5 overflow-hidden">
        <CardHeader className="pb-2">
            <CardTitle className="text-xl font-display flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-green-400" />
                AI Analysis Summary
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground leading-relaxed">{data.summary}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Health Scores */}
        <Card className="glass-card border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary" />
                Repo Health Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Total Health</span>
                <span className="font-bold">{data.health_score.total}%</span>
              </div>
              <Progress value={data.health_score.total} className="h-2 bg-white/5" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                 <div className="text-lg font-bold text-blue-400">{data.health_score.quality}%</div>
                 <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Quality</div>
              </div>
              <div className="text-center border-x border-white/10">
                 <div className="text-lg font-bold text-red-400">{data.health_score.security}%</div>
                 <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Security</div>
              </div>
              <div className="text-center">
                 <div className="text-lg font-bold text-green-400">{data.health_score.maintenance}%</div>
                 <div className="text-[10px] text-muted-foreground uppercase tracking-tight">Updates</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Tips */}
        <Card className="glass-card border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.top_tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm group">
                  <div className="h-6 w-6 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center text-[10px] font-bold group-hover:bg-primary/20 transition-colors">
                    {i + 1}
                  </div>
                  <span className="text-muted-foreground group-hover:text-white transition-colors">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Map */}
      <Card className="glass-card border-white/10 bg-white/5 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Architecture Diagram
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-black/20">
          <div 
            ref={mermaidRef} 
            className="flex justify-center p-8 overflow-x-auto min-h-[300px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}
