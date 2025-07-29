import React, { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { PieChart as PieChartIcon, Target, TrendingUp, Maximize2, Minimize2 } from 'lucide-react'
import { ChartSkeleton } from '../shared/LoadingSkeleton'
import { cn } from '../../utils/cn'

// Enhanced tooltip with detailed information
const CustomTooltip = memo(({ active, payload }) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const total = payload[0].payload.total || 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl p-4 min-w-[220px]"
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-4 h-4 rounded-full shadow-sm" 
          style={{ backgroundColor: data.color }}
        />
        <div className="flex-1">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-xs text-muted-foreground">Campaign Performance</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Conversion Rate</span>
          <span className="font-semibold text-foreground">{data.value}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Share of Total</span>
          <span className="font-semibold text-foreground">
            {((data.value / total) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Conversions</span>
          <span className="font-semibold text-foreground">
            {(data.conversions || Math.round(data.value * 100)).toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-muted-foreground">
            {data.trend || '+12.5%'} vs last period
          </span>
        </div>
      </div>
    </motion.div>
  )
})

// Interactive legend with detailed stats
const InteractiveLegend = memo(({ data, activeIndex, onHover, onLeave }) => {
  const total = useMemo(() => 
    data.reduce((sum, item) => sum + item.value, 0), [data]
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
      {data.map((entry, index) => {
        const isActive = activeIndex === index
        const percentage = ((entry.value / total) * 100).toFixed(1)
        
        return (
          <motion.div
            key={entry.name}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer",
              isActive 
                ? "bg-primary/5 border-primary/20 shadow-sm" 
                : "bg-muted/30 border-transparent hover:bg-muted/50"
            )}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={onLeave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className={cn(
                "w-4 h-4 rounded-full shadow-sm transition-all duration-200",
                isActive && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
              )}
              style={{ backgroundColor: entry.color }}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-foreground truncate">{entry.name}</p>
                <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                  {entry.value}%
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {(entry.conversions || Math.round(entry.value * 100)).toLocaleString()} conversions
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {percentage}% share
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
})

// Custom label component for pie slices
const CustomLabel = memo(({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  if (percent < 0.05) return null // Don't show labels for slices < 5%
  
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-semibold drop-shadow-sm"
    >
      {`${value}%`}
    </text>
  )
})

export const OptimizedPieChart = memo(({ 
  data, 
  isLoading = false, 
  title = "Campaign Conversion Rates",
  showDetails = true 
}) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isExpanded, setIsExpanded] = useState(false)

  // Enhanced color palette
  const colors = [
    '#3b82f6', // Blue
    '#10b981', // Green  
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Purple
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16'  // Lime
  ]

  // Memoized chart data processing
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []
    
    return data.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      conversions: item.conversions || Math.round(item.value * 100),
      trend: item.trend || `+${(Math.random() * 20).toFixed(1)}%`
    }))
  }, [data])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!processedData.length) return { total: 0, average: 0, best: null, totalConversions: 0 }
    
    const total = processedData.reduce((sum, item) => sum + item.value, 0)
    const totalConversions = processedData.reduce((sum, item) => sum + (item.conversions || 0), 0)
    const best = processedData.reduce((max, item) => 
      item.value > (max?.value || 0) ? item : max, null
    )
    
    return {
      total,
      average: (total / processedData.length).toFixed(1),
      best,
      totalConversions
    }
  }, [processedData])

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handleMouseLeave = () => {
    setActiveIndex(-1)
  }

  if (isLoading) {
    return <ChartSkeleton />
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={isExpanded ? "fixed inset-4 z-50" : ""}
    >
      <Card className={`h-full shadow-lg border-0 bg-card/50 backdrop-blur-sm ${isExpanded ? 'shadow-2xl' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {stats.best && (
                <Badge variant="outline" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  Best: {stats.best.name}
                </Badge>
              )}
              
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
          </div>

          {/* Statistics Row */}
          {showDetails && (
            <motion.div 
              className="grid grid-cols-3 gap-4 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center p-2 bg-primary/5 rounded-lg">
                <div className="text-lg font-bold text-primary">
                  {stats.total.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Rate
                </div>
              </div>
              <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats.average}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Average
                </div>
              </div>
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalConversions.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Conversions
                </div>
              </div>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="pb-4">
          <div className={`${isExpanded ? 'h-[calc(100vh-300px)]' : 'h-80'} transition-all duration-300`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={<CustomLabel />}
                  outerRadius={isExpanded ? 120 : 80}
                  innerRadius={isExpanded ? 60 : 40}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {processedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={activeIndex === index ? entry.color : 'transparent'}
                      strokeWidth={activeIndex === index ? 3 : 0}
                      style={{
                        filter: activeIndex === index ? 'brightness(1.1) drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend */}
          <InteractiveLegend
            data={processedData}
            activeIndex={activeIndex}
            onHover={setActiveIndex}
            onLeave={() => setActiveIndex(-1)}
          />
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

OptimizedPieChart.displayName = 'OptimizedPieChart'