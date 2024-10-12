import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface AutoGeminiNLPInsightsProps {
  reviews: string[];
}

const GEMINI_API_KEY = 'AIzaSyA3266lvlnwmfugWlB3GVx5Q9LMpDfNywI';

const AutoGeminiNLPInsights: React.FC<AutoGeminiNLPInsightsProps> = ({ reviews }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateInsights();
  }, [reviews]);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Analyze the following patient reviews and provide insights on common themes, sentiment, and areas for improvement:

      ${reviews.join('\n\n')}

      Please provide a summary of the key insights, including:
      1. Overall sentiment
      2. Common positive themes
      3. Common negative themes
      4. Suggestions for improvement
      5. Any other notable patterns or trends`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setInsights(text);
    } catch (error) {
      console.error('Error generating insights:', error);
      setError('An error occurred while generating insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const retryGenerateInsights = () => {
    generateInsights();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI-Generated Insights</h2>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Analyzing reviews...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={retryGenerateInsights}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Retry Analysis
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="whitespace-pre-wrap text-gray-600">{insights}</p>
        </div>
      )}
    </div>
  );
};

export default AutoGeminiNLPInsights;