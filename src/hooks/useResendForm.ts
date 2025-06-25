import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  industry: string;
  projectType: string;
  budget: string;
  timeline: string;
  features: string[];
  retainer: string;
  description: string;
}

interface UseResendFormReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submitForm: (data: FormData) => Promise<void>;
  reset: () => void;
}

export function useResendForm(): UseResendFormReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Format the data for the API
      const formattedData = {
        ...data,
        features: data.features.join(', '),
      };

      const response = await fetch('/api/send-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return {
    isSubmitting,
    isSuccess,
    error,
    submitForm,
    reset,
  };
}