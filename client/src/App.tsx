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
import CodingEnvironment from "@/pages/coding-environment";
import UserStatistics from "@/pages/user-statistics";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { PublicRoute } from "./lib/public-route";
import { useEffect } from "react";

// Import components directly
import Blind75Page from '@/pages/quick-prep/blind-75';
import LinuxBasicsPage from '@/pages/quick-prep/linux-basics';
import JDBasedPage from '@/pages/jd-based';

// Import footer pages
import TermsOfService from '@/pages/terms-of-service';
import PrivacyPolicy from '@/pages/privacy-policy';
import Pricing from '@/pages/pricing';
import AboutUs from '@/pages/about-us';

// Import notes pages
import GettingStarted from '@/pages/notes/getting-started';
import GitbookDocumentation from '@/pages/notes/gitbook-documentation';
import Quickstart from '@/pages/notes/quickstart';
import CommunicationProtocols from '@/pages/notes/communication-protocols';
import DataStructures from '@/pages/notes/data-structures';
import Multithreading from '@/pages/notes/multithreading';

// Import notes subpages
import SPI from '@/pages/notes/communication-protocols/spi';
import I2C from '@/pages/notes/communication-protocols/i2c';
import UART from '@/pages/notes/communication-protocols/uart';
import LinkedList from '@/pages/notes/data-structures/linked-list';
import ArrayPage from '@/pages/notes/data-structures/array';
import StringPage from '@/pages/notes/data-structures/string';
import MultithreadingIntroduction from '@/pages/notes/multithreading/introduction';
import MultithreadingKeyConcepts from '@/pages/notes/multithreading/key-concepts';
import MultithreadingInterviewTips from '@/pages/notes/multithreading/interview-tips';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <PublicRoute path="/dashboard" component={Dashboard} />
      <PublicRoute path="/dashboard/quick-prep/three-months" component={Dashboard} />
      <PublicRoute path="/dashboard/quick-prep/one-month" component={Dashboard} />
      <PublicRoute path="/dashboard/quick-prep/one-week" component={Dashboard} />
      <PublicRoute path="/dashboard/company/apple" component={Dashboard} />
      <PublicRoute path="/dashboard/company/nvidia" component={Dashboard} />
      <PublicRoute path="/dashboard/company/tesla" component={Dashboard} />
      <ProtectedRoute path="/coding-environment" component={CodingEnvironment} />
      <ProtectedRoute path="/user-statistics" component={UserStatistics} />
      <ProtectedRoute path="/jd-based" component={JDBasedPage} />
      <ProtectedRoute path="/quick-prep/blind-75" component={Blind75Page} />
      <ProtectedRoute path="/quick-prep/linux-basics" component={LinuxBasicsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/coming-soon" component={ComingSoon} />
      
      {/* Footer pages - accessible to all */}
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about-us" component={AboutUs} />
      
      {/* Protected Notes routes */}
      <ProtectedRoute path="/notes" component={Notes} />
      <ProtectedRoute path="/notes/getting-started" component={GettingStarted} />
      <ProtectedRoute path="/notes/gitbook-documentation" component={GitbookDocumentation} />
      <ProtectedRoute path="/notes/quickstart" component={Quickstart} />
      <ProtectedRoute path="/notes/communication-protocols" component={CommunicationProtocols} />
      <ProtectedRoute path="/notes/data-structures" component={DataStructures} />
      <ProtectedRoute path="/notes/multithreading" component={Multithreading} />
      
      {/* Protected Notes subpages */}
      <ProtectedRoute path="/notes/communication-protocols/spi" component={SPI} />
      <ProtectedRoute path="/notes/communication-protocols/i2c" component={I2C} />
      <ProtectedRoute path="/notes/communication-protocols/uart" component={UART} />
      <ProtectedRoute path="/notes/data-structures/linked-list" component={LinkedList} />
      <ProtectedRoute path="/notes/data-structures/array" component={ArrayPage} />
      <ProtectedRoute path="/notes/data-structures/string" component={StringPage} />
      <ProtectedRoute path="/notes/multithreading/introduction" component={MultithreadingIntroduction} />
      <ProtectedRoute path="/notes/multithreading/key-concepts" component={MultithreadingKeyConcepts} />
      <ProtectedRoute path="/notes/multithreading/interview-tips" component={MultithreadingInterviewTips} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { darkMode } = useAuth();
  
  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="scrollable-content">
        <Router />
        <Toaster />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
