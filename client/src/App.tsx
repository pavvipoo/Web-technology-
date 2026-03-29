import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BookmarksProvider } from "@/contexts/BookmarksContext";
import { SearchHistoryProvider } from "@/contexts/SearchHistoryContext";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Search from "@/pages/Search";
import Trending from "@/pages/Trending";
import RepoChat from "@/pages/RepoChat";
import Bookmarks from "@/pages/Bookmarks";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/search" component={Search} />
      <Route path="/trending" component={Trending} />
      <Route path="/chat/:owner/:name" component={RepoChat} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookmarksProvider>
          <SearchHistoryProvider>
            <Toaster />
            <Router />
          </SearchHistoryProvider>
        </BookmarksProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
