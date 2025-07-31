import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { debugChartData } from "../utils/chartDebug";

export default function RevenueChart({ data, loading = false }) {
  // Fallback test data
  const testData = [
    {"month": "Jan", "revenue": 245000, "productivity": 85},
    {"month": "Feb", "revenue": 267000, "productivity": 88},
    {"month": "Mar", "revenue": 298000, "productivity": 92}
  ];
  
  // Use test data if main data is not available
  const chartData = (data && Array.isArray(data) && data.length > 0) ? data : testData;
  
  // Data validation
  const isValidData = chartData && Array.isArray(chartData) && chartData.length > 0;

  // Debug chart data
  debugChartData('revenueData', data);
  
  if (import.meta.env.DEV) {
    console.log('RevenueChart - using chartData:', chartData);
  }

  if (loading || !isValidData) {
    return (
      <Card className="w-full h-[400px] rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue & Productivity</CardTitle>
          <CardDescription className="text-sm text-gray-600">Monthly revenue trends with productivity correlation</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-[280px] w-full" />
              <div className="flex justify-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
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
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full h-[400px]"
    >
      <Card className="w-full h-full rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Revenue & Productivity</CardTitle>
          <CardDescription className="text-sm text-gray-600">Monthly revenue trends with productivity correlation</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%" debounceMs={50}>
              <AreaChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="revenueChartGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="revenueChartGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.1} />
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
                    name === 'revenue' ? `₹${value.toLocaleString()}` : `${value}%`,
                    name === 'revenue' ? 'Revenue' : 'Productivity'
                  ]}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}
                />
                
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#revenueChartGradient1)"
                  dot={{ fill: '#2563EB', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#1D4ED8', strokeWidth: 2, fill: '#EFF6FF' }}
                />
                
                <Area
                  type="monotone"
                  dataKey="productivity"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  fill="url(#revenueChartGradient2)"
                  dot={{ fill: '#D97706', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#B45309', strokeWidth: 2, fill: '#FEF3C7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}