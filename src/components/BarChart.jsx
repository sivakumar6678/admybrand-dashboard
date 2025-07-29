import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function ChannelBarChart({ data, loading = false }) {
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              User Acquisition by Channel
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Users and conversions by marketing channel
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500" />
              <span className="text-xs font-medium text-muted-foreground">Users</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
              <span className="text-xs font-medium text-muted-foreground">Conversions</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 rounded-lg" />
          
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="usersBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f093fb" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#f5576c" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="conversionsBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8}/>
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
        </div>
      </CardContent>
    </Card>
  );
}