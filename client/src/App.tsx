import { Switch, Route, Redirect } from "wouter";
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
import History from "@/pages/History";
import Premium from "@/pages/Premium";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import AIUsageControl from "@/pages/admin/AIUsageControl";
import SecurityPanel from "@/pages/admin/SecurityPanel";
import AnalyticsDashboard from "@/pages/admin/AnalyticsDashboard";
import RepoMonitoring from "@/pages/admin/RepoMonitoring";
import APIMonitor from "@/pages/admin/APIMonitor";
import NotificationSystem from "@/pages/admin/NotificationSystem";
import CMSControl from "@/pages/admin/CMSControl";
import AdminRoles from "@/pages/admin/AdminRoles";
import SystemLogs from "@/pages/admin/SystemLogs";
import Monetization from "@/pages/admin/Monetization";
import DatabaseExplorer from "@/pages/admin/DatabaseExplorer";
import UICustomization from "@/pages/admin/UICustomization";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminStore } from "@/stores/useAdminStore";

function ProtectedAdminRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAdminStore();
  
  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return (
    <AdminLayout>
      <Component {...rest} />
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public & Client Routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/search" component={Search} />
      <Route path="/trending" component={Trending} />
      <Route path="/chat/:owner/:name" component={RepoChat} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/history" component={History} />
      <Route path="/premium" component={Premium} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        {(params) => <ProtectedAdminRoute component={AdminDashboard} {...params} />}
      </Route>
      <Route path="/admin/users">
        {(params) => <ProtectedAdminRoute component={UserManagement} {...params} />}
      </Route>
      <Route path="/admin/ai-usage">
        {(params) => <ProtectedAdminRoute component={AIUsageControl} {...params} />}
      </Route>
      <Route path="/admin/security">
        {(params) => <ProtectedAdminRoute component={SecurityPanel} {...params} />}
      </Route>
      <Route path="/admin/analytics">
        {(params) => <ProtectedAdminRoute component={AnalyticsDashboard} {...params} />}
      </Route>
      <Route path="/admin/repos">
        {(params) => <ProtectedAdminRoute component={RepoMonitoring} {...params} />}
      </Route>
      <Route path="/admin/api-monitor">
        {(params) => <ProtectedAdminRoute component={APIMonitor} {...params} />}
      </Route>
      <Route path="/admin/notifications">
        {(params) => <ProtectedAdminRoute component={NotificationSystem} {...params} />}
      </Route>
      <Route path="/admin/roles">
        {(params) => <ProtectedAdminRoute component={AdminRoles} {...params} />}
      </Route>
      <Route path="/admin/logs">
        {(params) => <ProtectedAdminRoute component={SystemLogs} {...params} />}
      </Route>
      <Route path="/admin/monetization">
        {(params) => <ProtectedAdminRoute component={Monetization} {...params} />}
      </Route>
      <Route path="/admin/database">
        {(params) => <ProtectedAdminRoute component={DatabaseExplorer} {...params} />}
      </Route>
      <Route path="/admin/content">
        {(params) => <ProtectedAdminRoute component={CMSControl} {...params} />}
      </Route>
      <Route path="/admin/ui-settings">
        {(params) => <ProtectedAdminRoute component={UICustomization} {...params} />}
      </Route>

      {/* Fallback for other admin modules */}
      <Route path="/admin/:module">
        {(params) => (
          <ProtectedAdminRoute 
            component={() => (
              <div className="flex items-center justify-center h-full text-slate-500 italic">
                Module "{params.module}" is under construction...
              </div>
            )} 
          />
        )}
      </Route>

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

