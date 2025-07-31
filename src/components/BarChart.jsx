import React from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function ChannelBarChart({ data, loading = false }) {
  if (loading || !data || data.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle>User Acquisition by Channel</CardTitle>
          <CardDescription>Users and conversions by marketing channel</CardDescription>
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
      transition={{ duration: 0.5, delay: 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0 pb-3">
          <CardTitle>Channel Performance</CardTitle>
          <CardDescription>User acquisition by marketing channel</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">
          <div className="h-full min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
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
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  color: 'hsl(var(--card-foreground))',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value, name) => [
                  `${value.toLocaleString()}`,
                  name === 'users' ? 'Total Users' : 'Conversions'
                ]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
              />
              
              <Bar 
                dataKey="users" 
                fill="#f093fb"
                radius={[4, 4, 0, 0]}
                name="users"
              />
              
              <Bar 
                dataKey="conversions" 
                fill="#667eea"
                radius={[4, 4, 0, 0]}
                name="conversions"
              />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}