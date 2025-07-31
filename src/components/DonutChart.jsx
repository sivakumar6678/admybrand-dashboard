import React from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const COLORS = [
  '#667eea',
  '#f093fb', 
  '#4facfe',
  '#43e97b'
];

const GRADIENTS = [
  { id: 'gradient1', colors: ['#667eea', '#764ba2'] },
  { id: 'gradient2', colors: ['#f093fb', '#f5576c'] },
  { id: 'gradient3', colors: ['#4facfe', '#00f2fe'] },
  { id: 'gradient4', colors: ['#43e97b', '#38f9d7'] }
];

export default function UserRoleDonutChart({ data, loading = false }) {
  if (loading || !data || data.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle>User Distribution by Role</CardTitle>
          <CardDescription>Breakdown of users by their roles</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="h-full w-full animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{data.role}</p>
          <p className="text-muted-foreground text-sm">
            {data.count.toLocaleString()} users ({data.percentage}%)
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
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Distribution by user role</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="h-full min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <PieChart>
              
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                dataKey="count"

              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-90 transition-all duration-300 cursor-pointer"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              
              {/* Center label */}
              <text 
                x="50%" 
                y="50%" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="fill-foreground text-sm font-bold"
              >
                Total Users
              </text>
              <text 
                x="50%" 
                y="50%" 
                dy={20}
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="fill-muted-foreground text-2xl font-black"
              >
                {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </text>
              
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}