import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { debugChartData } from "../utils/chartDebug";

export default function SentimentTrendChart({ data, loading = false }) {
  // Fallback test data
  const testData = [
    {"week": "Week 1", "sentiment": 7.5, "engagement": 78},
    {"week": "Week 2", "sentiment": 8.1, "engagement": 82},
    {"week": "Week 3", "sentiment": 7.8, "engagement": 79}
  ];
  
  // Use test data if main data is not available
  const chartData = (data && Array.isArray(data) && data.length > 0) ? data : testData;
  
  // Data validation
  const isValidData = chartData && Array.isArray(chartData) && chartData.length > 0;

  // Debug chart data
  debugChartData('sentimentData', data);

  if (loading || !isValidData) {
    return (
      <Card className="w-full h-[400px] rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Team Sentiment Trends</CardTitle>
          <CardDescription className="text-sm text-gray-600">Weekly sentiment analysis and engagement levels</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-[280px] w-full" />
              <div className="flex justify-center space-x-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ) : (
            <div className="h-[280px] w-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 font-medium">No data available</p>
                <p className="text-sm text-gray-500 mt-1">Chart data is empty or invalid</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full h-[400px]"
    >
      <Card className="w-full h-full rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Team Sentiment Trends</CardTitle>
          <CardDescription className="text-sm text-gray-600">Weekly sentiment analysis and engagement levels</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%" debounceMs={50}>
              <LineChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="sentimentChartGradient1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#BE185D" />
                  </linearGradient>
                  <linearGradient id="sentimentChartGradient2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#5B21B6" />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
                
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                />
                
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                />
                
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    color: '#374151'
                  }}
                  formatter={(value, name) => [
                    name === 'sentiment' ? `${value}/10` : `${value}%`,
                    name === 'sentiment' ? 'Sentiment Score' : 'Engagement'
                  ]}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}
                />
                
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                
                <Line
                  type="monotone"
                  dataKey="sentiment"
                  stroke="url(#sentimentChartGradient1)"
                  strokeWidth={4}
                  dot={{
                    fill: '#EC4899',
                    strokeWidth: 3,
                    r: 6,
                  }}
                  activeDot={{
                    r: 8,
                    stroke: '#BE185D',
                    strokeWidth: 3,
                    fill: '#FDF2F8',
                  }}
                  name="Sentiment Score"
                />
                
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="url(#sentimentChartGradient2)"
                  strokeWidth={4}
                  dot={{
                    fill: '#8B5CF6',
                    strokeWidth: 3,
                    r: 6,
                  }}
                  activeDot={{
                    r: 8,
                    stroke: '#5B21B6',
                    strokeWidth: 3,
                    fill: '#F3E8FF',
                  }}
                  name="Engagement"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}