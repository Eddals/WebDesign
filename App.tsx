import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FAQ from "@/pages/FAQ";
import FAQChatButton from "@/components/FAQChatButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

function Router() {
  const [location] = useLocation();
  
  // Track page views when the location changes
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleAnalytics />
      <Router />
      <FAQChatButton />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
