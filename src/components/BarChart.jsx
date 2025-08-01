import React, { useContext } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ThemeContext } from "../context/ThemeContext";

export default function ChannelBarChart({ data, loading = false }) {
  const { darkMode } = useContext(ThemeContext);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Acquisition by Channel</CardTitle>
          <CardDescription>Users and conversions by marketing channel</CardDescription>
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
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
          <CardDescription>User acquisition by marketing channel</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="usersBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="conversionsBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.7}/>
                </linearGradient>
                <filter id="barGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
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
                vertical={false}
              />

              <XAxis
                dataKey="channel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
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
                  `${value.toLocaleString()}`,
                  name === 'users' ? 'Total Users' : 'Conversions'
                ]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: 'hsl(var(--popover-foreground))' }}
              />
              
              <Bar 
                dataKey="users" 
                fill="url(#usersBarGradient)"
                radius={[6, 6, 0, 0]}
                name="users"
                filter="url(#barGlow)"
              />
              
              <Bar 
                dataKey="conversions" 
                fill="url(#conversionsBarGradient)"
                radius={[6, 6, 0, 0]}
                name="conversions"
                filter="url(#barGlow)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}