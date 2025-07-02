import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FAQ from "@/pages/FAQ";

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
  useEffect(() => {
    // Add Zoho SalesIQ chatbox scripts to <head>
    const zohoScript = document.createElement('script');
    zohoScript.type = 'text/javascript';
    zohoScript.innerHTML = `window.$zoho=window.$zoho || {}; $zoho.salesiq=$zoho.salesiq||{ready:function(){}}`;
    document.head.appendChild(zohoScript);

    const zsiqScript = document.createElement('script');
    zsiqScript.id = "zsiqscript";
    zsiqScript.src = "https://salesiq.zohopublic.com/widget?wc=siqd35609490db12740e1dffb562df59d10622e036ba3492f47cbe1a97daa56a515";
    zsiqScript.defer = true;
    document.head.appendChild(zsiqScript);

    return () => {
      if (zohoScript.parentNode) zohoScript.parentNode.removeChild(zohoScript);
      if (zsiqScript.parentNode) zsiqScript.parentNode.removeChild(zsiqScript);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleAnalytics />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
