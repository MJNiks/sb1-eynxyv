import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap } from 'recharts';
import { Star, ThumbsUp, ThumbsDown, TrendingUp, AlertTriangle, Users, Clock, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useClinicContext } from '../context/ClinicContext';

const fetchDashboardData = async () => {
  // Simulated API call
  return {
    totalReviews: 1250,
    averageRating: 4.2,
    sentimentDistribution: { positive: 65, neutral: 20, negative: 15 },
    recentReviews: [
      { id: 1, author: "John D.", rating: 5, comment: "Excellent service!", date: "2023-03-15" },
      { id: 2, author: "Sarah M.", rating: 3, comment: "Average experience.", date: "2023-03-14" },
      { id: 3, author: "Robert L.", rating: 4, comment: "Good, but room for improvement.", date: "2023-03-13" },
    ],
    ratingTrend: [
      { month: 'Jan', rating: 4.0 },
      { month: 'Feb', rating: 4.2 },
      { month: 'Mar', rating: 4.5 },
      { month: 'Apr', rating: 4.3 },
      { month: 'May', rating: 4.6 },
    ],
    sentimentTrend: [
      { month: 'Jan', positive: 60, neutral: 30, negative: 10 },
      { month: 'Feb', positive: 65, neutral: 25, negative: 10 },
      { month: 'Mar', positive: 70, neutral: 20, negative: 10 },
      { month: 'Apr', positive: 68, neutral: 22, negative: 10 },
      { month: 'May', positive: 75, neutral: 18, negative: 7 },
    ],
    keywordAnalysis: [
      { name: 'Staff', value: 120, sentiment: 'positive' },
      { name: 'Service', value: 100, sentiment: 'positive' },
      { name: 'Cleanliness', value: 80, sentiment: 'positive' },
      { name: 'Wait Time', value: 60, sentiment: 'negative' },
      { name: 'Treatment', value: 50, sentiment: 'positive' },
      { name: 'Communication', value: 40, sentiment: 'neutral' },
      { name: 'Facilities', value: 30, sentiment: 'positive' },
      { name: 'Professionalism', value: 25, sentiment: 'positive' },
    ],
  };
};

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  const { clinicInfo } = useClinicContext();
  const [greeting, setGreeting] = useState('');
  const [thought, setThought] = useState('');
  const [hoveredSentiment, setHoveredSentiment] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const thoughts = [
      "A smile is the best way to greet your patients!",
      "Every patient interaction is an opportunity to make a positive impact.",
      "Empathy is the cornerstone of excellent healthcare.",
      "Small improvements every day lead to big changes over time.",
      "Your dedication to patient care makes all the difference.",
    ];
    setThought(thoughts[Math.floor(Math.random() * thoughts.length)]);

    const thoughtInterval = setInterval(() => {
      setThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
    }, 300000); // 5 minutes

    return () => clearInterval(thoughtInterval);
  }, []);

  const ProgressBar = ({ value, label, description }: { value: number; label: string; description: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="mb-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-700">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <motion.div
            className="bg-blue-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isHovered ? `${value}%` : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const COLORS = {
    positive: '#4CAF50',
    neutral: '#FFA726',
    negative: '#EF5350'
  };

  // Convert sentimentDistribution to an array for the PieChart
  const sentimentDistributionData = Object.entries(data.sentimentDistribution).map(([name, value]) => ({ name, value }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-semibold">{`${payload[0].name} : ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">{`${payload[0].value}% of reviews`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-2xl font-bold text-gray-800">
        {greeting}, {clinicInfo.name}
      </div>
      <div className="text-sm text-gray-600 italic">{thought}</div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg flex items-center"
        >
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <MessageCircle className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Total Reviews</h2>
            <p className="text-3xl font-bold text-blue-500">{data.totalReviews}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg flex items-center"
        >
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <Star className="text-yellow-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Average Rating</h2>
            <p className="text-3xl font-bold text-yellow-500">{data.averageRating.toFixed(1)}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={sentimentDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(data) => setHoveredSentiment(data.name)}
                onMouseLeave={() => setHoveredSentiment(null)}
              >
                {sentimentDistributionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                    opacity={hoveredSentiment === entry.name ? 1 : 0.8}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>
        <div className="space-y-4">
          {data.recentReviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">{review.author}</span>
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
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rating Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Rating Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.ratingTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rating" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Sentiment Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Sentiment Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.sentimentTrend}>
            <PolarGrid />
            <PolarAngleAxis dataKey="month" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Positive" dataKey="positive" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.6} />
            <Radar name="Neutral" dataKey="neutral" stroke="#FFA726" fill="#FFA726" fillOpacity={0.6} />
            <Radar name="Negative" dataKey="negative" stroke="#EF5350" fill="#EF5350" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Keyword Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4">Keyword Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={data.keywordAnalysis}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomizedContent colors={COLORS} />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </motion.div>

      {/* Predictive Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-blue-500" />
          Predictive Insights
        </h2>
        <ProgressBar 
          value={75} 
          label="Positive Review Increase" 
          description="Projected growth in positive feedback. Implement suggested improvements to boost ratings."
        />
        <ProgressBar 
          value={60} 
          label="Wait Time Optimization" 
          description="Potential for reduced wait times. Streamline processes to enhance patient satisfaction."
        />
        <ProgressBar 
          value={85} 
          label="Staff Friendliness Improvement" 
          description="Expected increase in staff rapport. Encourage continued patient-focused interactions."
        />
        <ProgressBar 
          value={70} 
          label="Flu Shot Appointment Surge" 
          description="Anticipated rise in vaccine demand. Prepare inventory and staff for increased appointments."
        />
        <ProgressBar 
          value={90} 
          label="Telemedicine Demand Growth" 
          description="Forecasted increase in virtual consultations. Enhance digital infrastructure to meet demand."
        />
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <AlertTriangle className="mr-2 text-yellow-500" />
          Performance Insights
        </h2>
        <ProgressBar 
          value={80} 
          label="Review Response Time Improvement" 
          description="Progress in timely feedback responses. Continue to prioritize prompt patient communication."
        />
        <ProgressBar 
          value={65} 
          label="Overall Rating Increase" 
          description="Gradual enhancement in clinic reputation. Focus on areas needing improvement to boost ratings."
        />
        <ProgressBar 
          value={88} 
          label="Patient Retention Rate" 
          description="Strong loyalty among existing patients. Maintain quality care to ensure continued patronage."
        />
        <ProgressBar 
          value={72} 
          label="Appointment Booking Efficiency" 
          description="Advancements in scheduling processes. Optimize booking system for better patient experience."
        />
        <ProgressBar 
          value={95} 
          label="Wait Time Reduction" 
          description="Significant progress in minimizing delays. Continue refining processes for optimal efficiency."
        />
      </motion.div>
    </motion.div>
  );
};

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, colors, name, value, sentiment } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[sentiment] : 'none',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth === 1 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
        >
          {name}
        </text>
      ) : null}
      {depth === 1 ? (
        <text
          x={x + 4}
          y={y + 18}
          fill="#fff"
          fontSize={16}
          fillOpacity={0.9}
        >
          {index + 1}
        </text>
      ) : null}
    </g>
  );
};

export default Dashboard;