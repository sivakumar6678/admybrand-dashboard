import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function RevenueLineChart({ data, loading = false }) {
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Revenue Over Time
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Monthly revenue and user growth trends
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              <span className="text-xs font-medium text-muted-foreground">Users</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg" />
          
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4facfe" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4facfe" stopOpacity={0}/>
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
                  name === 'revenue' ? `$${value.toLocaleString()}` : `${value.toLocaleString()} users`,
                  name === 'revenue' ? 'Revenue' : 'Active Users'
                ]}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
              />
              
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="url(#revenueGradient)"
                strokeWidth={4}
                dot={{ 
                  fill: '#667eea', 
                  strokeWidth: 3, 
                  r: 6,
                  filter: 'url(#glow)'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#667eea', 
                  strokeWidth: 3,
                  fill: '#667eea',
                  filter: 'url(#glow)'
                }}
                fill="url(#revenueGradient)"
              />
              
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="url(#usersGradient)"
                strokeWidth={4}
                dot={{ 
                  fill: '#4facfe', 
                  strokeWidth: 3, 
                  r: 6,
                  filter: 'url(#glow)'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#4facfe', 
                  strokeWidth: 3,
                  fill: '#4facfe',
                  filter: 'url(#glow)'
                }}
                fill="url(#usersGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}