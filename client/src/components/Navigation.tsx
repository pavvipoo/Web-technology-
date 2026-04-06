import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Github, 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Bookmark, 
  User, 
  LogOut,
  Menu,
  X,
  Settings,
  History as HistoryIcon,
  Crown
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">RepoChat</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden md:flex">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function AppNavbar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/search", label: "Search", icon: Search },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/premium", label: "Premium", icon: Crown, premium: true },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Add history link for search page functionality
  const historyLinks = [
    ...links,
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-primary to-purple-500 rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">RepoChat</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const { href, label, icon: Icon } = link;
              return (
                <Link key={href} href={href}>
                  <div className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200",
                    location === href 
                      ? "bg-white/10 text-white shadow-sm" 
                      : (link as any).premium 
                        ? "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-muted-foreground hover:text-destructive hidden md:flex gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-l border-white/10">
                <div className="flex flex-col gap-6 mt-8">
                  {links.map((link) => {
                    const { href, label, icon: Icon } = link;
                    return (
                      <Link key={href} href={href} onClick={() => setIsOpen(false)}>
                        <div className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                          location === href 
                            ? "bg-primary/10 text-primary" 
                            : (link as any).premium
                              ? "text-amber-500 bg-amber-500/5 hover:bg-amber-500/10"
                              : "text-muted-foreground hover:text-white"
                        )}>
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{label}</span>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="h-px bg-white/10 my-2" />
                  <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
