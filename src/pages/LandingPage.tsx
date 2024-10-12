import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, MessageCircle, TrendingUp, Star, Shield, Zap, Users, Clock, PieChart, LineChart } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    { icon: BarChart2, title: "Advanced Analytics", description: "Gain deep insights into patient satisfaction trends and patterns" },
    { icon: MessageCircle, title: "Sentiment Analysis", description: "Automatically categorize and understand the sentiment behind each review" },
    { icon: TrendingUp, title: "Predictive Insights", description: "Anticipate future trends and potential issues before they arise" },
    { icon: Star, title: "Review Management", description: "Efficiently manage and respond to patient reviews from multiple sources" },
    { icon: Shield, title: "HIPAA Compliant", description: "Ensure patient data privacy with our secure, compliant platform" },
    { icon: Zap, title: "AI-Powered Responses", description: "Generate thoughtful, personalized responses to reviews with AI assistance" },
    { icon: Users, title: "Patient Segmentation", description: "Analyze demographics for targeted communication strategies" },
    { icon: Clock, title: "Real-time Updates", description: "Get instant notifications and updates on new reviews and trends" },
    { icon: LineChart, title: "Performance Metrics", description: "Track key performance indicators to improve patient satisfaction" },
    { icon: PieChart, title: "Custom Reports", description: "Generate detailed, customizable reports for stakeholders" }
  ];

  // ... rest of the component remains the same
};

export default LandingPage;