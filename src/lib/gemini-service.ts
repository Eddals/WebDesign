// This is a simplified service for Gemini API integration
// In a real implementation, you would need to set up proper API keys and error handling

// Define types
interface GeminiResponse {
  text: string;
  error?: string;
}

// FAQ data from the FAQ page
const faqData = [
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes, we offer a 100% Money-Back Guarantee within the first 48 hours if you're not satisfied with our initial design concepts, and a Partial Refund if we can't deliver on agreed-upon requirements after multiple revision attempts."
  },
  {
    question: "What is your development process?",
    answer: "Our development process includes: 1) Discovery & Planning, 2) Design, 3) Development, 4) Testing, 5) Launch, and 6) Support & Maintenance. We focus on quality, efficiency, and client satisfaction throughout."
  },
  {
    question: "What information do you need to get started?",
    answer: "To get started, we need your business information (name, industry, target audience), project goals, design preferences, content (website copy, images), and functionality requirements. Don't worry if you don't have everything ready - we can guide you through the process."
  },
  {
    question: "What support options do you provide?",
    answer: "We offer email support (24/7 access with responses within 24 hours), phone support (Mon-Fri, 12am-6pm EST), technical support, and content updates. Support packages start at $50/month and can be customized to your needs."
  }
];

// Contact information
const contactInfo = {
  email: "support@devtone.agency",
  phone: "+1 (718) 419-3863",
  schedule: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ090688oDQPcvG5Wxi-vZugSIP1LGHQrZxgk5fB5rM46mgFZP1fVoq8xT70bguxDkjBy09qswqj"
};

// Company information for context
const companyInfo = {
  name: "DevTone Agency",
  services: ["Web Design", "Web Development", "SEO", "Digital Marketing", "Mobile Apps"],
  description: "Professional web development agency delivering exceptional digital solutions that drive business growth and success."
};

/**
 * Implementation of the Gemini API service
 */
export async function queryGemini(userQuery: string): Promise<GeminiResponse> {
  console.log('Querying Gemini API with:', userQuery);
  try {
    const key = getApiKey();
    if (!key) {
      throw new Error("API key not configured");
    }

    // First try to match with our FAQ data for faster responses
    const normalizedQuery = userQuery.toLowerCase();
    
    // Check for contact information requests
    if (
      normalizedQuery.includes('contact') || 
      normalizedQuery.includes('email') || 
      normalizedQuery.includes('phone') ||
      normalizedQuery.includes('reach you')
    ) {
      return {
        text: `You can contact DevTone Agency via email at ${contactInfo.email} or phone at ${contactInfo.phone}. Our support hours are Monday to Friday, 12pm to 6pm EST. You can also schedule a call with us through our online calendar.`
      };
    }
    
    // Check for WhatsApp requests
    if (normalizedQuery.includes('whatsapp')) {
      return {
        text: `You can reach us on WhatsApp at ${contactInfo.phone}. Just click the WhatsApp button in the chat or save our number to your contacts.`
      };
    }
    
    // Try to call the actual Gemini API
    try {
      const endpoint = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";
      
      // Create context from FAQ data
      const faqContext = faqData.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
      
      const prompt = `You are a helpful assistant for DevTone Agency, a web development company. You should respond as if you are a representative of the company, using "we" and "our" when referring to DevTone Agency.
      
      Answer the following question based on this information:
      
      Company: DevTone Agency
      Services: Web Design, Web Development, SEO, Digital Marketing, Mobile Apps
      Email: ${contactInfo.email}
      Phone: ${contactInfo.phone}
      
      FAQ Information:
      ${faqContext}
      
      User question: ${userQuery}
      
      Important guidelines:
      1. Be authentic and conversational, as if a real person is answering
      2. Use "we" and "our" when referring to DevTone Agency
      3. Keep answers concise but complete
      4. Be friendly and helpful
      5. If you don't know the answer, suggest contacting us directly at ${contactInfo.email}
      6. Don't make up information that isn't in the provided context`;
      
      const response = await fetch(`${endpoint}?key=${key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Gemini API response:', data);
      
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (generatedText) {
        console.log('Generated text:', generatedText);
        return { text: generatedText };
      }
      
      // Fall back to our local matching if API doesn't return useful content
      throw new Error("No valid response from API");
      
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      
      // Fall back to local matching
      // Check for pricing questions
      if (
        normalizedQuery.includes('price') || 
        normalizedQuery.includes('cost') || 
        normalizedQuery.includes('how much') ||
        normalizedQuery.includes('pricing')
      ) {
        return {
          text: "Our pricing depends on the specific requirements of your project. We offer competitive rates and flexible packages tailored to your needs. For a detailed quote, please use our 'Get Estimate' form on our website or contact us directly."
        };
      }
      
      // Check for specific FAQ matches
      for (const faq of faqData) {
        const questionLower = faq.question.toLowerCase();
        
        // Check for keyword matches
        if (
          normalizedQuery.includes(questionLower) || 
          (questionLower.includes('money') && normalizedQuery.includes('money')) ||
          (questionLower.includes('guarantee') && normalizedQuery.includes('guarantee')) ||
          (questionLower.includes('process') && normalizedQuery.includes('process')) ||
          (questionLower.includes('support') && normalizedQuery.includes('support')) ||
          (questionLower.includes('information') && normalizedQuery.includes('information'))
        ) {
          return { text: faq.answer };
        }
      }
      
      // Default response if no match found
      return {
        text: "I'm not sure I understand your question. Could you rephrase it? You can ask about our money-back guarantee, development process, what information we need to get started, or our support options. You can also contact us directly at support@devtone.agency."
      };
    }
    
  } catch (error) {
    console.error("Error querying Gemini API:", error);
    return {
      text: "I'm sorry, I encountered an error processing your request. Please try again later or contact us directly at support@devtone.agency.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// API key configuration
let apiKey = "AIzaSyDDI9Xj6aJc6TB6m9-yDYPEqBIVo2au5sM";

export function initGeminiAPI(newApiKey?: string): void {
  if (newApiKey) {
    apiKey = newApiKey;
  }
  console.log("Gemini API initialized with key");
}

// Get API key
export function getApiKey(): string {
  return apiKey;
}