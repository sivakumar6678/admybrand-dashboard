import React, { useContext } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ThemeContext } from "../context/ThemeContext";

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
  const { darkMode } = useContext(ThemeContext);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Distribution by Role</CardTitle>
          <CardDescription>Breakdown of users by their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg p-3 shadow-lg border bg-popover text-popover-foreground">
          <p className="font-medium">{data.role}</p>
          <p className="text-sm text-muted-foreground">
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
    >
      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Distribution by user role</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <defs>
                {GRADIENTS.map((gradient, index) => (
                  <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={gradient.colors[0]} stopOpacity={1}/>
                    <stop offset="100%" stopColor={gradient.colors[1]} stopOpacity={0.8}/>
                  </linearGradient>
                ))}
                <filter id="pieGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={3}
                dataKey="count"
                filter="url(#pieGlow)"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`}
                    className="hover:opacity-90 transition-all duration-300 cursor-pointer"
                    stroke="hsl(var(--background))"
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
                className="text-sm font-bold"
                fill="hsl(var(--foreground))"
              >
                Total Users
              </text>
              <text
                x="50%"
                y="50%"
                dy={20}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-2xl font-black"
                fill="hsl(var(--muted-foreground))"
              >
                {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </text>
              
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}