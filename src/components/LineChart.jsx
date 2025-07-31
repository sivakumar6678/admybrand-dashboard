import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function RevenueLineChart({ data, loading = false }) {
  if (loading || !data || data.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg">Revenue Over Time</CardTitle>
          <CardDescription className="text-sm">Monthly revenue and user growth</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="h-full w-full animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle className="text-lg">Revenue Trends</CardTitle>
          <CardDescription className="text-sm">Monthly revenue and user growth</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="h-full min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                dx={-10}
              />
              
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  color: 'hsl(var(--card-foreground))',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value.toLocaleString()}` : `${value.toLocaleString()} users`,
                  name === 'revenue' ? 'Revenue' : 'Active Users'
                ]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
              />
              
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#667eea"
                strokeWidth={3}
                dot={{ 
                  fill: '#667eea', 
                  strokeWidth: 2, 
                  r: 5
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: '#667eea', 
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#4facfe"
                strokeWidth={3}
                dot={{ 
                  fill: '#4facfe', 
                  strokeWidth: 2, 
                  r: 5
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: '#4facfe', 
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}