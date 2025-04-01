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
import CodingEnvironment from "@/pages/coding-environment";
import Documentation from "@/pages/documentation";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { DarkModeProvider } from "@/hooks/use-dark-mode";

// Import components directly
import Blind75Page from '@/pages/quick-prep/blind-75';
import LinuxBasicsPage from '@/pages/quick-prep/linux-basics';
import JDBasedPage from '@/pages/jd-based';

// Import notes pages
import GettingStarted from '@/pages/notes/getting-started';
import GitbookDocumentation from '@/pages/notes/gitbook-documentation';
import Quickstart from '@/pages/notes/quickstart';
import CommunicationProtocols from '@/pages/notes/communication-protocols';
import DataStructures from '@/pages/notes/data-structures';

// Import notes subpages
import SPI from '@/pages/notes/communication-protocols/spi';
import I2C from '@/pages/notes/communication-protocols/i2c';
import UART from '@/pages/notes/communication-protocols/uart';
import LinkedList from '@/pages/notes/data-structures/linked-list';
import ArrayPage from '@/pages/notes/data-structures/array';
import StringPage from '@/pages/notes/data-structures/string';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/problems" component={Dashboard} />
      <ProtectedRoute path="/problems/:id" component={ProblemDetail} />
      <ProtectedRoute path="/coding-environment" component={CodingEnvironment} />
      <ProtectedRoute path="/jd-based" component={JDBasedPage} />
      <ProtectedRoute path="/quick-prep/blind-75" component={Blind75Page} />
      <ProtectedRoute path="/quick-prep/linux-basics" component={LinuxBasicsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/coming-soon" component={ComingSoon} />
      
      {/* Notes routes */}
      <Route path="/notes" component={Notes} />
      <Route path="/notes/getting-started" component={GettingStarted} />
      <Route path="/notes/gitbook-documentation" component={GitbookDocumentation} />
      <Route path="/notes/quickstart" component={Quickstart} />
      <Route path="/notes/communication-protocols" component={CommunicationProtocols} />
      <Route path="/notes/data-structures" component={DataStructures} />
      
      {/* Notes subpages */}
      <Route path="/notes/communication-protocols/spi" component={SPI} />
      <Route path="/notes/communication-protocols/i2c" component={I2C} />
      <Route path="/notes/communication-protocols/uart" component={UART} />
      <Route path="/notes/data-structures/linked-list" component={LinkedList} />
      <Route path="/notes/data-structures/array" component={ArrayPage} />
      <Route path="/notes/data-structures/string" component={StringPage} />
      
      {/* New Documentation with Markdown */}
      <Route path="/docs" component={Documentation} />
      <Route path="/docs/:rest*" component={Documentation} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeProvider>
          <Router />
          <Toaster />
        </DarkModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
