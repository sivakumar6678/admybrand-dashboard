import React, { memo, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { BarChart3, TrendingUp, Eye, EyeOff } from 'lucide-react'
import { ChartSkeleton } from '../shared/LoadingSkeleton'
import { cn } from '../../utils/cn'

// Enhanced tooltip with animations and better styling
const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  const total = payload.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 15 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-background/98 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-5 min-w-[220px] max-w-[300px]"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.p 
          className="font-bold text-foreground text-base"
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
            Total: {total.toLocaleString()}
          </Badge>
        </motion.div>
      </div>
      
      <div className="space-y-3">
        {payload.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
            className="flex items-center justify-between gap-4 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-4 h-4 rounded-md shadow-md border border-white/20" 
                style={{ backgroundColor: entry.color }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
              <span className="text-sm text-foreground font-medium">
                {entry.name}
              </span>
            </div>
            <div className="text-right">
              <motion.div 
                className="text-sm font-bold text-foreground"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {entry.value.toLocaleString()}
              </motion.div>
              <div className="text-xs text-muted-foreground font-medium">
                {((entry.value / total) * 100).toFixed(1)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Enhanced footer with trend indicator */}
      <motion.div 
        className="mt-4 pt-3 border-t border-border/30 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="h-3 w-3" />
          <span>Click legend to toggle series</span>
        </div>
      </motion.div>
    </motion.div>
  )
})

// Interactive legend component
const InteractiveLegend = memo(({ payload, visibleSeries, onToggleSeries }) => {
  if (!payload) return null

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {payload.map((entry, index) => {
        const isVisible = visibleSeries[entry.dataKey]
        return (
          <motion.button
            key={entry.dataKey}
            onClick={() => onToggleSeries(entry.dataKey)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              isVisible 
                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                : "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className={cn(
                "w-3 h-3 rounded-sm transition-all duration-200",
                isVisible ? "shadow-sm" : "opacity-50"
              )}
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
            {isVisible ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </motion.button>
        )
      })}
    </div>
  )
})

export const OptimizedBarChart = memo(({ 
  data, 
  isLoading = false, 
  title = "Weekly Active Users",
  showComparison = true 
}) => {
  const [visibleSeries, setVisibleSeries] = useState({
    web: true,
    app: true
  })

  // Memoized chart data processing
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []
    
    return data.map(item => ({
      ...item,
      week: item.week || `Week ${item.id || 1}`,
      web: visibleSeries.web ? (item.web || 0) : 0,
      app: visibleSeries.app ? (item.app || 0) : 0
    }))
  }, [data, visibleSeries])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!processedData.length) return { totalWeb: 0, totalApp: 0, avgWeb: 0, avgApp: 0 }
    
    const totalWeb = processedData.reduce((sum, item) => sum + (item.web || 0), 0)
    const totalApp = processedData.reduce((sum, item) => sum + (item.app || 0), 0)
    
    return {
      totalWeb,
      totalApp,
      avgWeb: Math.round(totalWeb / processedData.length),
      avgApp: Math.round(totalApp / processedData.length),
      growth: totalWeb + totalApp > 0 ? ((totalApp / (totalWeb + totalApp)) * 100).toFixed(1) : 0
    }
  }, [processedData])

  const handleToggleSeries = (seriesKey) => {
    setVisibleSeries(prev => ({
      ...prev,
      [seriesKey]: !prev[seriesKey]
    }))
  }

  if (isLoading) {
    return <ChartSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            
            {showComparison && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.growth}% Mobile
                </Badge>
              </div>
            )}
          </div>

          {/* Statistics Row */}
          <motion.div 
            className="grid grid-cols-2 gap-4 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalWeb.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70 font-medium">
                Total Web Users
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.totalApp.toLocaleString()}
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70 font-medium">
                Total App Users
              </div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={processedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                barCategoryGap="20%"
              >
                <defs>
                  <linearGradient id="webGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>

                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeOpacity={0.2}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />

                <Tooltip content={<CustomTooltip />} />

                <AnimatePresence>
                  {visibleSeries.web && (
                    <Bar
                      dataKey="web"
                      name="Web Users"
                      fill="url(#webGradient)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {processedData.map((entry, index) => (
                        <Cell 
                          key={`web-${index}`} 
                          fill="url(#webGradient)"
                        />
                      ))}
                    </Bar>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {visibleSeries.app && (
                    <Bar
                      dataKey="app"
                      name="App Users"
                      fill="url(#appGradient)"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {processedData.map((entry, index) => (
                        <Cell 
                          key={`app-${index}`} 
                          fill="url(#appGradient)"
                        />
                      ))}
                    </Bar>
                  )}
                </AnimatePresence>

                <Legend 
                  content={
                    <InteractiveLegend 
                      visibleSeries={visibleSeries}
                      onToggleSeries={handleToggleSeries}
                    />
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Footer */}
          <motion.div 
            className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div>
                <span className="font-medium">Avg Web: </span>
                <span className="text-foreground">{stats.avgWeb.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Avg App: </span>
                <span className="text-foreground">{stats.avgApp.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <span className="font-medium">Data Points: </span>
              <span className="text-foreground">{processedData.length}</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
})

OptimizedBarChart.displayName = 'OptimizedBarChart'