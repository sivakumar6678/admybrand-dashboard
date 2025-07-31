import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { debugChartData } from "../utils/chartDebug";

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4'  // Cyan
];

export default function DepartmentPieChart({ data, loading = false }) {
  // Fallback test data
  const testData = [
    {"department": "Engineering", "count": 45, "percentage": 42.5},
    {"department": "Design", "count": 18, "percentage": 17.0},
    {"department": "Marketing", "count": 22, "percentage": 20.8},
    {"department": "Sales", "count": 21, "percentage": 19.8}
  ];
  
  // Use test data if main data is not available
  const chartData = (data && Array.isArray(data) && data.length > 0) ? data : testData;
  
  // Data validation
  const isValidData = chartData && Array.isArray(chartData) && chartData.length > 0;

  // Debug chart data
  debugChartData('departmentData', data);

  if (loading || !isValidData) {
    return (
      <Card className="w-full h-[400px] rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Department Distribution</CardTitle>
          <CardDescription className="text-sm text-gray-600">Team member distribution across departments</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex justify-center">
                <Skeleton className="h-48 w-48 rounded-full" />
              </div>
              <div className="flex justify-center space-x-4">
                <Skeleton className="h-4 w-20" />
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="text-gray-900 font-medium">{data.department}</p>
          <p className="text-gray-600 text-sm">
            {data.count.toLocaleString()} members ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full h-[400px]"
    >
      <Card className="w-full h-full rounded-2xl shadow-md bg-white">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">Department Distribution</CardTitle>
          <CardDescription className="text-sm text-gray-600">Team member distribution across departments</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%" debounceMs={50}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="40%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-all duration-300 cursor-pointer"
                    />
                  ))}
                </Pie>
                
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  content={<CustomLegend />} 
                  verticalAlign="bottom" 
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}