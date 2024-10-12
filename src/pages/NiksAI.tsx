import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyA3266lvlnwmfugWlB3GVx5Q9LMpDfNywI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const NiksAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clearChatTimeout = setTimeout(() => {
      setMessages([]);
    }, 900000); // 15 minutes

    return () => clearTimeout(clearChatTimeout);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `As Niks AI, a friendly assistant for clinic owners, provide a brief and practical suggestion to improve the following aspect of the clinic:

      "${input}"

      Keep your response concise, friendly, and tailored to the clinic owner's perspective. Offer a quick tip that's easy to implement and could make a noticeable difference. Limit your response to 2-3 sentences.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiMessage: Message = { role: 'assistant', content: response.text() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = { role: 'assistant', content: 'I apologize, but I encountered an error while processing your request. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Niks AI Assistant</h1>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg shadow p-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for quick clinic improvement tips..."
          className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default NiksAI;