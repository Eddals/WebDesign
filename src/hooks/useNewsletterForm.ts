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
      // Validate inputs
      const sanitizedName = DOMPurify.sanitize(name).trim();
      if (!sanitizedName) {
        throw new Error("Please enter a valid name.");
      }

      if (!isValidEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      // Submit subscription
      const result = await subscribeToNewsletter(sanitizedName, email);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Handle success
      setSubscribeStatus({ 
        type: "success", 
        message: "Thank you for subscribing to our newsletter!" 
      });
      
      // Clear form
      setName("");
      setEmail("");
      
      // Clear message after delay
      setTimeout(() => setSubscribeStatus({ type: null, message: "" }), 5000);
    } catch (error) {
      // Handle error
      setSubscribeStatus({ 
        type: "error", 
        message: error instanceof Error ? error.message : "Failed to subscribe. Please try again later." 
      });
      
      // Clear message after delay
      setTimeout(() => setSubscribeStatus({ type: null, message: "" }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { name, setName, email, setEmail, isSubmitting, subscribeStatus, handleSubmit };
}