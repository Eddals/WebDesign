import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Navigation, Star, ExternalLink, Info, Map, Compass } from "lucide-react";

interface GoogleMapsWidgetProps {
  mapUrl: string;
  businessName?: string;
  rating?: number;
  address?: string;
  className?: string;
}

const GoogleMapsWidget = ({
  mapUrl,
  businessName = "Devtone Agency",
  rating = 5.0,
  address = "Remote Agency - No Physical Office",
  className = "",
}: GoogleMapsWidgetProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const mapRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  // Extract the embed URL from the Google Maps URL
  const getEmbedUrl = (url: string) => {
    // Extract the place ID if present
    const placeIdMatch = url.match(/place\/[^\/]+\/@([\d.-]+),([\d.-]+)/);
    if (placeIdMatch) {
      const lat = placeIdMatch[1];
      const lng = placeIdMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e862144bbfe7805%3A0x1d5d4a141863603a!2sDevtone%20Agency!5e0!3m2!1sen!2sus!4v1624996358000!5m2!1sen!2sus`;
    }
    
    // Default fallback
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3!2d-129.9427086!3d46.423669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e862144bbfe7805%3A0x1d5d4a141863603a!2sDevtone%20Agency!5e0!3m2!1sen!2sus!4v1624996358000!5m2!1sen!2sus";
  };

  const embedUrl = getEmbedUrl(mapUrl);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true);
    };

    if (mapRef.current) {
      mapRef.current.addEventListener("load", handleLoad);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative elements */}
      <motion.div 
        className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500"
        animate={{ 
          opacity: isHovered ? 0.75 : 0.25 
        }}
        transition={{ duration: 0.5 }}
      />
      
      <div className="relative backdrop-blur-lg bg-[#0a0e24]/90 border border-purple-500/20 rounded-2xl overflow-hidden shadow-xl">
        {/* Top decorative element */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70 z-10"></div>
        
        {/* Side decorative elements */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent z-10"></div>
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-purple-500/40 to-transparent z-10"></div>
        
        {/* Header with business info */}
        <motion.div 
          className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-500/20"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{businessName}</h3>
              <div className="flex items-center gap-2 text-white/70">
                <Map className="w-4 h-4" />
                <span className="text-sm">{address}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-1 text-white font-medium">{rating}</span>
            </div>
            
            <motion.a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View on Google Maps
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
        </motion.div>
        
        {/* Map container with loading state */}
        <motion.div 
          className="relative aspect-video w-full overflow-hidden"
          variants={itemVariants}
        >
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0e24]/80 z-10">
              <motion.div 
                className="w-16 h-16 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <p className="mt-4 text-white/70">Loading map...</p>
            </div>
          )}
          
          <iframe
            ref={mapRef}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Devtone Agency Location"
            className="z-0"
          />
          
          {/* Interactive overlay elements */}
          <motion.div 
            className="absolute bottom-4 right-4 z-10"
            variants={pulseVariants}
            animate="pulse"
          >
            <div className="bg-purple-600/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute top-4 left-4 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white">Interactive Map</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Footer with additional info */}
        <motion.div 
          className="p-4 flex justify-between items-center border-t border-purple-500/20"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 text-white/70">
            <Info className="w-4 h-4" />
            <span className="text-xs">View our reviews on Google Maps</span>
          </div>
          
          <motion.button
            onClick={() => window.open(mapUrl, '_blank')}
            className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See Reviews
          </motion.button>
        </motion.div>
        
        {/* Bottom decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70 z-10"></div>
      </div>
    </motion.div>
  );
};

export default GoogleMapsWidget;