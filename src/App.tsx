import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, startTransition } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import ScrollNavigation from './components/ScrollNavigation';
import ScrollToTop from './components/ScrollToTop';

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import('./pages/Services'));
const Seo = lazy(() => import('./pages/SEO'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Estimate = lazy(() => import('./pages/Estimate'));
const Success = lazy(() => import('./pages/Success'));
const Cancel = lazy(() => import('./pages/Cancel'));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/terms"));
const FAQ = lazy(() => import("./pages/faq"));
const NotFound = lazy(() => import("./pages/not-found"));
const ChatDashboard = lazy(() => import("./pages/ChatDashboard"));
const DevtoneDashboard = lazy(() => import("./pages/DevtoneDashboard"));
const DashboardWrapper = lazy(() => import("./pages/dashboard/DashboardWrapper"));
const WebDesign = lazy(() => import('./pages/services/WebDesign'));
const LandingPage = lazy(() => import('./pages/services/LandingPage'));
const SocialMediaMarketing = lazy(() => import('./pages/services/SocialMediaMarketing'));
const DigitalMarketing = lazy(() => import('./pages/services/DigitalMarketing'));
const MarketingAutomation = lazy(() => import('./pages/services/MarketingAutomation'));
const ECommerce = lazy(() => import('./pages/services/ECommerce'));
const WebsiteRedesign = lazy(() => import('./pages/services/WebsiteRedesign'));
const MobileApps = lazy(() => import('./pages/services/MobileApps'));


export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
              <Routes>
                {/* Dashboard routes - no navbar/footer */}
                <Route path="/dashboard/*" element={
                  <Suspense fallback={<LoadingSpinner fullScreen text="Loading dashboard..." />}>
                    <DashboardWrapper />
                  </Suspense>
                } />
                
                {/* DevtoneDashboard route with its own Suspense boundary */}
                <Route path="/devtone-dashboard" element={
                  <Suspense fallback={<LoadingSpinner fullScreen text="Loading Devtone Dashboard..." />}>
                    <DevtoneDashboard />
                  </Suspense>
                } />
                
                {/* Main website routes - with navbar/footer */}
                <Route path="/*" element={
                  <div className="min-h-screen bg-[#030718]">
                    <Navbar />
                    <Suspense fallback={<LoadingSpinner fullScreen text="Loading..." />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/web-design" element={<WebDesign />} />
                        <Route path="/services/business-websites" element={<WebDesign />} />
                        <Route path="/services/landing-page" element={<LandingPage />} />
                        <Route path="/services/landing-pages" element={<LandingPage />} />
                        <Route path="/services/ecommerce" element={<ECommerce />} />
                        <Route path="/services/e-commerce-stores" element={<ECommerce />} />
                        <Route path="/services/website-redesign" element={<WebsiteRedesign />} />
                        <Route path="/services/mobile-apps" element={<MobileApps />} />
                        <Route path="/services/mobile-applications" element={<MobileApps />} />
                        <Route path="/services/social-media-marketing" element={<SocialMediaMarketing />} />
                        <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
                        <Route path="/services/marketing-automation" element={<MarketingAutomation />} />
                        <Route path="/seo" element={<Seo />} />
                        <Route path="/services/seo-optimization" element={<Seo />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/estimate" element={<Estimate />} />
                        <Route path="/success" element={<Success />} />
                        <Route path="/cancel" element={<Cancel />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/chat-dashboard" element={<ChatDashboard />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                    <LiveChat />
                    <ScrollNavigation />
                    <Footer />
                  </div>
                } />
              </Routes>
            </Suspense>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};