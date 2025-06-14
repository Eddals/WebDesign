import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { HelmetProvider } from 'react-helmet-async';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import ScrollNavigation from './components/ScrollNavigation';
import ScrollToTop from './components/ScrollToTop';
import Home from "./pages/Home";
import Services from './pages/Services';
import Seo from './pages/SEO';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Estimate from './pages/Estimate';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Privacy from "./pages/Privacy";
import Terms from "./pages/terms";
import FAQ from "./pages/faq";
import NotFound from "./pages/not-found";
import ChatDashboard from "./pages/ChatDashboard";
import ClientPortal from "./pages/ClientPortal";
import AdminClientDashboard from "./pages/AdminClientDashboard";
import WebDesign from './pages/services/WebDesign';
import LandingPage from './pages/services/LandingPage';
import SocialMediaMarketing from './pages/services/SocialMediaMarketing';
import DigitalMarketing from './pages/services/DigitalMarketing';
import MarketingAutomation from './pages/services/MarketingAutomation';
import React, { useEffect, useState } from 'react';
import { getUserCountry } from './lib/geoCheck';

function GeoVerificationModal({ onVerify }: { onVerify: () => void }) {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 8, maxWidth: 400, textAlign: 'center' }}>
        <h2 style={{ color: '#111', marginBottom: 16 }}>Verification Required</h2>
        <p style={{ color: '#333', marginBottom: 16 }}>
          For security reasons, users from outside the United States must verify they are not a bot.
        </p>
        <label style={{ color: '#111', marginBottom: 16, display: 'block' }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /> I'm not a robot
        </label>
        <button
          style={{ background: '#111', color: '#fff', padding: '8px 24px', border: 'none', borderRadius: 4, cursor: checked ? 'pointer' : 'not-allowed' }}
          disabled={!checked}
          onClick={onVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [showVerification, setShowVerification] = useState(false);
  const [checkedCountry, setCheckedCountry] = useState(false);

  useEffect(() => {
    async function checkCountry() {
      const country = await getUserCountry();
      if (country && country !== 'US') {
        setShowVerification(true);
      }
      setCheckedCountry(true);
    }
    checkCountry();
  }, []);

  if (!checkedCountry) return null; // Optionally show a loading spinner here
  if (showVerification) {
    return <GeoVerificationModal onVerify={() => setShowVerification(false)} />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-[#030718]">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/web-design" element={<WebDesign />} />
              <Route path="/services/landing-page" element={<LandingPage />} />
              <Route path="/services/social-media-marketing" element={<SocialMediaMarketing />} />
              <Route path="/services/digital-marketing" element={<DigitalMarketing />} />
              <Route path="/services/marketing-automation" element={<MarketingAutomation />} />
              <Route path="/seo" element={<Seo />} />
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
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/admin-client-dashboard" element={<AdminClientDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <LiveChat />
            <ScrollNavigation />
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};
