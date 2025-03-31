import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ComingSoon from "@/pages/coming-soon";
import Notes from "@/pages/notes";
import Dashboard from "@/pages/dashboard";
import AuthPage from "@/pages/auth-page";
import ProblemDetail from "@/pages/problem-detail";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

// Import components directly
import Blind75Page from '@/pages/quick-prep/blind-75';
import LinuxBasicsPage from '@/pages/quick-prep/linux-basics';
import JDBasedPage from '@/pages/jd-based';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/problems" component={Dashboard} />
      <ProtectedRoute path="/problems/:id" component={ProblemDetail} />
      <ProtectedRoute path="/jd-based" component={JDBasedPage} />
      <ProtectedRoute path="/quick-prep/blind-75" component={Blind75Page} />
      <ProtectedRoute path="/quick-prep/linux-basics" component={LinuxBasicsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/coming-soon" component={ComingSoon} />
      <Route path="/notes" component={Notes} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
