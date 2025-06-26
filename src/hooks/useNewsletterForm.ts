import { useState } from "react";
import DOMPurify from "dompurify";
import { subscribeToNewsletter, isValidEmail } from "../lib/newsletter-service";

export function useNewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubscribeStatus({ type: null, message: "" });

    try {
      // Sanitize name input
      const sanitizedName = DOMPurify.sanitize(name).trim();
      if (!sanitizedName) {
        throw new Error("Please enter a valid name.");
      }

      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      console.log('Submitting newsletter form with:', { name: sanitizedName, email });
      const result = await subscribeToNewsletter(sanitizedName, email);
      console.log('Newsletter subscription result:', result);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Success message
      setSubscribeStatus({ 
        type: "success", 
        message: "Thank you for subscribing to our newsletter! Please check your email for confirmation." 
      });
      
      // Clear form
      setName("");
      setEmail("");
      
      // Clear success message after delay
      setTimeout(() => setSubscribeStatus({ type: null, message: "" }), 8000);
    } catch (error) {
      console.error('Newsletter form submission error:', error);
      
      // Error message
      setSubscribeStatus({ 
        type: "error", 
        message: error instanceof Error 
          ? error.message 
          : "Failed to subscribe. Please try again later." 
      });
      
      // Clear error message after delay
      setTimeout(() => setSubscribeStatus({ type: null, message: "" }), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { name, setName, email, setEmail, isSubmitting, subscribeStatus, handleSubmit };
}