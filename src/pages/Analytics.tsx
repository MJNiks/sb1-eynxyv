import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with actual API call
const fetchAnalyticsData = async () => {
  return {
    sentimentTrend: [
      { month: 'Jan', positive: 70, negative: 30 },
      { month: 'Feb', positive: 65, negative: 35 },
      { month: 'Mar', positive: 80, negative: 20 },
      { month: 'Apr', positive: 75, negative: 25 },
      { month: 'May', positive: 85, negative: 15 },
    ],
    topKeywords: [
      { name: 'Staff', value: 120 },
      { name: 'Wait Time', value: 80 },
      { name: 'Cleanliness', value: 70 },
      { name: 'Treatment', value: 50 },
      { name: 'Communication', value: 30 },
    ],
    ratingDistribution: [
      { name: '1 Star', value: 10 },
      { name: '2 Stars', value: 20 },
      { name: '3 Stars', value: 30 },
      { name: '4 Stars', value: 25 },
      { name: '5 Stars', value: 15 },
    ],
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyticsData'],
    queryFn: fetchAnalyticsData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sentiment Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.sentimentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#4CAF50" />
              <Line type="monotone" dataKey="negative" stroke="#F44336" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Keywords</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topKeywords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.ratingDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.ratingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;