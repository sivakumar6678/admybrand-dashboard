import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { debugChartData } from "../utils/chartDebug";

export default function OverviewChart({ data, loading = false }) {
  // Fallback test data in case main data is not working
  const testData = [
    {"month": "Jan", "moodScore": 8.2, "productivity": 85, "teamSize": 12},
    {"month": "Feb", "moodScore": 7.8, "productivity": 88, "teamSize": 14},
    {"month": "Mar", "moodScore": 8.5, "productivity": 92, "teamSize": 15}
  ];
  
  // Use test data if main data is not available
  const chartData = (data && Array.isArray(data) && data.length > 0) ? data : testData;
  
  // Data validation
  const isValidData = chartData && Array.isArray(chartData) && chartData.length > 0;

  // Debug chart data
  debugChartData('overviewData', data);
  
  // Additional debug for chart rendering
  if (import.meta.env.DEV) {
    console.log('OverviewChart - isValidData:', isValidData, 'loading:', loading);
    console.log('OverviewChart - original data:', data);
    console.log('OverviewChart - using chartData:', chartData);
  }

  if (loading || !isValidData) {
    return (
      <Card className="w-full h-[400px] rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Team Overview</CardTitle>
          <CardDescription className="text-sm text-gray-600">Monthly team mood scores and productivity metrics</CardDescription>
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
      transition={{ duration: 0.5 }}
      className="w-full h-[400px]"
    >
      <Card className="w-full h-full rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Team Overview</CardTitle>
          <CardDescription className="text-sm text-gray-600">Monthly team mood scores and productivity metrics</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%" debounceMs={50}>
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="overviewMoodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="overviewProductivityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} />
                
                <XAxis 
                  dataKey="month" 
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
                    name === 'moodScore' ? `${value}/10` : `${value}%`,
                    name === 'moodScore' ? 'Mood Score' : 'Productivity'
                  ]}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}
                />
                
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                
                <Bar
                  dataKey="moodScore"
                  fill="url(#overviewMoodGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Mood Score"
                />
                
                <Bar
                  dataKey="productivity"
                  fill="url(#overviewProductivityGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Productivity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}