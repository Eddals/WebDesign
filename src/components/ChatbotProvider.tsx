import { useEffect } from 'react'
import FAQChatbot from './FAQChatbot'
import { initGeminiAPI } from '@/lib/gemini-service'

interface ChatbotProviderProps {
  geminiApiKey?: string
}

const ChatbotProvider = ({ geminiApiKey }: ChatbotProviderProps) => {
  useEffect(() => {
    // Initialize Gemini API when component mounts
    initGeminiAPI(geminiApiKey)
  }, [geminiApiKey])

  return <FAQChatbot />
}

export default ChatbotProvider