import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GeminiNLPInsightsProps {
  reviews: string[];
}

const GEMINI_API_KEY = 'AIzaSyA3266lvlnwmfugWlB3GVx5Q9LMpDfNywI';

const GeminiNLPInsights: React.FC<GeminiNLPInsightsProps> = ({ reviews }) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateInsights = async () => {
    setLoading(true);
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
      setInsights('An error occurred while generating insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">NLP Insights (Gemini API)</h2>
      <button
        onClick={generateInsights}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg mb-4"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Insights...
          </span>
        ) : (
          'Generate NLP Insights'
        )}
      </button>
      {insights && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Generated Insights:</h3>
          <p className="whitespace-pre-wrap text-gray-600">{insights}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiNLPInsights;