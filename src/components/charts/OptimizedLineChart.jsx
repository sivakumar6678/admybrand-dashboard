import React, { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { TrendingUp, Maximize2, Minimize2 } from 'lucide-react'
import { ChartSkeleton } from '../shared/LoadingSkeleton'

// Optimized tooltip component
const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 min-w-[200px]"
    >
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}</span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {entry.name === 'Revenue' 
              ? `$${entry.value.toLocaleString()}`
              : entry.value.toLocaleString()
            }
          </span>
        </div>
      ))}
    </motion.div>
  )
})

export const OptimizedLineChart = memo(({ data, isLoading = false, title = "Revenue Trends" }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBrush, setShowBrush] = useState(false)

  // Memoize chart data processing
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []
    
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }))
  }, [data])

  // Calculate average for reference line
  const averageRevenue = useMemo(() => {
    if (!processedData.length) return 0
    const sum = processedData.reduce((acc, item) => acc + (item.revenue || 0), 0)
    return Math.round(sum / processedData.length)
  }, [processedData])

  if (isLoading) {
    return <ChartSkeleton />
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={isExpanded ? "fixed inset-4 z-50" : ""}
    >
      <Card className={`h-full ${isExpanded ? 'shadow-2xl' : 'shadow-lg'} transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBrush(!showBrush)}
              className="text-xs"
            >
              {showBrush ? 'Hide' : 'Show'} Brush
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className={`${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-80'} transition-all duration-300`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeOpacity={0.2}
                />
                
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                
                <YAxis 
                  yAxisId="revenue"
                  orientation="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                
                <YAxis 
                  yAxisId="users"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Reference line for average */}
                <ReferenceLine 
                  yAxisId="revenue"
                  y={averageRevenue} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                />

                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ 
                    fill: "hsl(var(--primary))", 
                    strokeWidth: 2, 
                    r: 4,
                    stroke: "hsl(var(--background))"
                  }}
                  activeDot={{ 
                    r: 6, 
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 2,
                    fill: "hsl(var(--background))"
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />

                <Line
                  yAxisId="users"
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#usersGradient)"
                  dot={{ 
                    fill: "hsl(var(--chart-2))", 
                    strokeWidth: 2, 
                    r: 3,
                    stroke: "hsl(var(--background))"
                  }}
                  activeDot={{ 
                    r: 5, 
                    stroke: "hsl(var(--chart-2))",
                    strokeWidth: 2,
                    fill: "hsl(var(--background))"
                  }}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />

                <AnimatePresence>
                  {showBrush && (
                    <Brush 
                      dataKey="date" 
                      height={30} 
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--muted))"
                    />
                  )}
                </AnimatePresence>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Statistics */}
          <motion.div 
            className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <span className="font-medium">Avg Revenue: </span>
              <span className="text-foreground">${averageRevenue.toLocaleString()}</span>
            </div>
            <div>
              <span className="font-medium">Data Points: </span>
              <span className="text-foreground">{processedData.length}</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Backdrop for expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
})

OptimizedLineChart.displayName = 'OptimizedLineChart'