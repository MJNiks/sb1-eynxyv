import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, ThumbsUp, ThumbsDown, Send, MessageSquare, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyA3266lvlnwmfugWlB3GVx5Q9LMpDfNywI';

// Mock data - replace with actual API call
const fetchReviews = async () => {
  return [
    { id: 1, patientName: "John Doe", rating: 4, comment: "Great experience overall. Staff was very friendly.", date: "2023-03-15", sentiment: "positive", replied: true, keywords: ["great", "experience", "friendly", "staff"], reply: "Thank you for your kind words, John! We're glad you had a great experience." },
    { id: 2, patientName: "Jane Smith", rating: 2, comment: "Long wait times and unfriendly receptionist.", date: "2023-03-14", sentiment: "negative", replied: false, keywords: ["long", "wait", "unfriendly", "receptionist"] },
    { id: 3, patientName: "Alice Johnson", rating: 5, comment: "Dr. Brown was excellent! Very thorough and caring.", date: "2023-03-13", sentiment: "positive", replied: true, keywords: ["excellent", "thorough", "caring"], reply: "We appreciate your feedback, Alice! Dr. Brown will be thrilled to hear this." },
    { id: 4, patientName: "Bob Wilson", rating: 3, comment: "Average experience. Nothing special to note.", date: "2023-03-12", sentiment: "neutral", replied: false, keywords: ["average", "experience", "nothing", "special"] },
    { id: 5, patientName: "Emma Davis", rating: 1, comment: "Terrible experience. Will not be returning.", date: "2023-03-11", sentiment: "negative", replied: false, keywords: ["terrible", "experience", "not", "returning"] },
    { id: 6, patientName: "Michael Lee", rating: 4, comment: "Very clean facility and professional staff.", date: "2023-03-10", sentiment: "positive", replied: true, keywords: ["clean", "facility", "professional", "staff"], reply: "Thank you for noticing our efforts, Michael! We strive to maintain a clean and professional environment." },
    { id: 7, patientName: "Sarah Brown", rating: 5, comment: "Exceptional care and attention to detail.", date: "2023-03-09", sentiment: "positive", replied: false, keywords: ["exceptional", "care", "attention", "detail"] },
    { id: 8, patientName: "David Clark", rating: 2, comment: "Felt rushed during the appointment.", date: "2023-03-08", sentiment: "negative", replied: false, keywords: ["rushed", "appointment"] },
  ];
};

const Reviews: React.FC = () => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  });

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState<string | null>(null);
  const [viewingReplyFor, setViewingReplyFor] = useState<number | null>(null);

  const filteredReviews = reviews?.filter(review => 
    filterSentiment ? review.sentiment === filterSentiment : true
  ) || [];

  const handleReply = (reviewId: number) => {
    setReplyingTo(reviewId);
    setReplyText('');
  };

  const submitReply = (reviewId: number) => {
    console.log(`Submitting reply for review ${reviewId}: ${replyText}`);
    // Here you would typically send the reply to your backend
    setReplyingTo(null);
    setReplyText('');
  };

  const generateAIResponse = async (review) => {
    setIsGeneratingSuggestion(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Generate a professional and empathetic response to the following ${review.sentiment} patient review from ${review.patientName}:

      "${review.comment}"

      The response should:
      1. Address ${review.patientName} by name
      2. Thank the patient for their feedback
      3. Address specific points mentioned in the review
      4. Show empathy and understanding
      5. Offer a solution or improvement if applicable
      6. Invite further communication if needed

      Please provide the response in a concise paragraph format.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestion = response.text();
      setReplyText(suggestion);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setReplyText('An error occurred while generating a suggestion. Please try again or write your own response.');
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Patient Reviews</h1>
      
      {/* Filter controls */}
      <div className="mb-6">
        <label className="mr-2">Filter by sentiment:</label>
        <select
          value={filterSentiment || ''}
          onChange={(e) => setFilterSentiment(e.target.value || null)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      {/* WhatsApp link */}
      <div className="mb-6">
        <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
          <Send className="mr-2" size={16} />
          Send Review Link via WhatsApp
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`bg-white p-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ${review.replied ? 'border-l-4 border-green-500' : ''}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{review.patientName}</h2>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 mb-4">{review.comment}</p>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                review.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                review.sentiment === 'negative' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
              </span>
              {review.sentiment === 'positive' && <ThumbsUp className="text-green-500" />}
              {review.sentiment === 'negative' && <ThumbsDown className="text-red-500" />}
              {review.sentiment === 'neutral' && <span className="text-gray-500">•</span>}
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Keywords:</h3>
              <div className="flex flex-wrap">
                {review.keywords.slice(0, 3).map((keyword, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{keyword}</span>
                ))}
                {review.keywords.length > 3 && (
                  <button className="text-blue-500 text-xs font-medium" onClick={() => alert(`All keywords: ${review.keywords.join(', ')}`)}>
                    <ChevronDown size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              {review.replied ? (
                <button
                  onClick={() => setViewingReplyFor(viewingReplyFor === review.id ? null : review.id)}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                >
                  <Eye size={16} className="mr-1" />
                  {viewingReplyFor === review.id ? 'Hide Reply' : 'View Reply'}
                </button>
              ) : (
                <button
                  onClick={() => handleReply(review.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reply
                </button>
              )}
            </div>
            {viewingReplyFor === review.id && (
              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">{review.reply}</p>
              </div>
            )}
            {replyingTo === review.id && (
              <div className="mt-4">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                  rows={4}
                  placeholder="Type your reply here..."
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => generateAIResponse(review)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center"
                    disabled={isGeneratingSuggestion}
                  >
                    {isGeneratingSuggestion ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enhancing...
                      </span>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Enhance
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => submitReply(review.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
                  >
                    <Send size={16} className="mr-2" />
                    Submit
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;