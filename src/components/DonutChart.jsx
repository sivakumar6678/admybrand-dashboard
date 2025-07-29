import React from "react";
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <div className="text-center">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            User Distribution by Role
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            Breakdown of users by their roles
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-lg" />
          
          <ResponsiveContainer width="100%" height={350}>
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
  );
}