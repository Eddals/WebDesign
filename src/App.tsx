import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { HelmetProvider } from 'react-helmet-async';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
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
import WebDesign from './pages/services/WebDesign';
import LandingPage from './pages/services/LandingPage';
import SocialMediaMarketing from './pages/services/SocialMediaMarketing';
import DigitalMarketing from './pages/services/DigitalMarketing';
import MarketingAutomation from './pages/services/MarketingAutomation';


export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
};
