import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { subscribeToNewsletter, isValidEmail, testNewsletterApi } from "../lib/newsletter-service";

export function useNewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  
  // Test the API connection on mount
  useEffect(() => {
    const checkApiStatus = async () => {
      const status = await testNewsletterApi();
      setApiStatus(status);
      console.log('Newsletter API status:', status ? 'Connected' : 'Not connected');
    };
    
    checkApiStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Check API status if not already checked
      if (apiStatus === null) {
        const status = await testNewsletterApi();
        setApiStatus(status);
        if (!status) {
          throw new Error("Newsletter service is currently unavailable. Please try again later.");
        }
      } else if (apiStatus === false) {
        throw new Error("Newsletter service is currently unavailable. Please try again later.");
      }
      
      // Basic validation
      const sanitizedName = DOMPurify.sanitize(name).trim();
      if (!sanitizedName) throw new Error("Please enter your name");
      if (!isValidEmail(email)) throw new Error("Please enter a valid email");

      // Submit subscription
      const result = await subscribeToNewsletter(sanitizedName, email);
      if (!result.success) throw new Error(result.message);

      // Success
      setSubscribeStatus({ type: "success", message: "Thanks for subscribing!" });
      setName("");
      setEmail("");
      setTimeout(() => setSubscribeStatus({ type: null, message: "" }), 3000);
    } catch (error) {
      console.error('Newsletter form submission error:', error);
      
      // Error
      setSubscribeStatus({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Subscription failed" 
      });
      setTimeout(() => setSubscribeStatus({ type: null, message: "" }), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    name, 
    setName, 
    email, 
    setEmail, 
    isSubmitting, 
    subscribeStatus, 
    handleSubmit,
    apiStatus
  };
}