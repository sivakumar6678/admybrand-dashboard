import React, { useContext } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ThemeContext } from "../context/ThemeContext";

export default function RevenueLineChart({ data, loading = false }) {
  const { darkMode } = useContext(ThemeContext);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>Monthly revenue and user growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
          <CardDescription>Monthly revenue and user growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground))"
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
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  color: 'hsl(var(--popover-foreground))',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : `${value.toLocaleString('en-IN')} users`,
                  name === 'revenue' ? 'Revenue' : 'Active Users'
                ]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: 'hsl(var(--popover-foreground))' }}
              />
              
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                strokeWidth={4}
                dot={{
                  fill: 'hsl(var(--chart-1))',
                  strokeWidth: 3,
                  r: 6,
                  filter: 'url(#glow)'
                }}
                activeDot={{
                  r: 8,
                  stroke: 'hsl(var(--chart-1))',
                  strokeWidth: 3,
                  fill: 'hsl(var(--chart-1))',
                  filter: 'url(#glow)'
                }}
                fill="url(#revenueGradient)"
              />

              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--chart-2))"
                strokeWidth={4}
                dot={{
                  fill: 'hsl(var(--chart-2))',
                  strokeWidth: 3,
                  r: 6,
                  filter: 'url(#glow)'
                }}
                activeDot={{
                  r: 8,
                  stroke: 'hsl(var(--chart-2))',
                  strokeWidth: 3,
                  fill: 'hsl(var(--chart-2))',
                  filter: 'url(#glow)'
                }}
                fill="url(#usersGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}