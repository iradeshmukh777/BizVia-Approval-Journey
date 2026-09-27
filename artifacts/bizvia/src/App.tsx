import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { Dashboard, Landing, Login, NotFound, Onboarding, Roadmap, Application, Tracking } from '@/pages/bizvia-pages';
import { ApplicationPage } from '@/pages/application-page';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <RoutedErrorBoundary>
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/roadmap" component={Roadmap} />
      <Route path="/application/factory-licence" component={ApplicationPage} />
      <Route path="/application/BE-FAC-2026-001"><Redirect to="/application/factory-licence" /></Route>
      <Route path="/application/:id" component={Application} />
      <Route path="/tracking/factory-licence" component={Tracking} />
      <Route path="/tracking/BE-FAC-2026-001"><Redirect to="/tracking/factory-licence" /></Route>
      <Route path="/tracking/:id" component={Tracking} />
      <Route component={NotFound} />
    </Switch>
  </RoutedErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;