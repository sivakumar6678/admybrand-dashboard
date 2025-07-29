import React, { useState, memo, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from './ui/button'
import { RefreshCw, Wifi, WifiOff, AlertTriangle } from 'lucide-react'
import { useOptimizedData } from '../hooks/useOptimizedData'
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates'
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor'
import enhancedMetrics from '../data/enhanced-metrics.json'
import { LoadingSkeleton, MetricCardSkeleton, ChartSkeleton } from './shared/LoadingSkeleton'
import { DateRangePicker } from './shared/DateRangePicker'
import { DarkModeToggle } from './DarkModeToggle'

// Lazy load heavy components for better performance
const OptimizedMetricCard = lazy(() => import('./cards/OptimizedMetricCard').then(module => ({ default: module.OptimizedMetricCard })))
const OptimizedLineChart = lazy(() => import('./charts/OptimizedLineChart').then(module => ({ default: module.OptimizedLineChart })))
const EnhancedBarChart = lazy(() => import('./charts/EnhancedBarChart').then(module => ({ default: module.EnhancedBarChart })))
const EnhancedPieChart = lazy(() => import('./charts/EnhancedPieChart').then(module => ({ default: module.EnhancedPieChart })))
const EnhancedDataTable = lazy(() => import('./table/EnhancedDataTable').then(module => ({ default: module.EnhancedDataTable })))
const ActivityTimeline = lazy(() => import('./shared/ActivityTimeline').then(module => ({ default: module.ActivityTimeline })))

// Error fallback component
const ErrorFallback = memo(({ error, resetErrorBoundary }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center p-8 bg-destructive/10 rounded-lg border border-destructive/20"
  >
    <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
    <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
    <p className="text-sm text-muted-foreground mb-4 text-center">{error.message}</p>
    <Button onClick={resetErrorBoundary} variant="outline" size="sm">
      Try again
    </Button>
  </motion.div>
))

// Optimized header component
const DashboardHeader = memo(({ 
  dateRange, 
  onDateRangeChange, 
  isUpdating, 
  lastUpdated, 
  onRefresh, 
  isLoading 
}) => (
  <motion.header 
    className="border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-sm"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights and performance metrics
          </p>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 flex-wrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            className="min-w-[200px]"
          />
          
          {/* Real-time status indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-full">
            <motion.div
              animate={{ 
                scale: isUpdating ? [1, 1.2, 1] : 1,
                opacity: isUpdating ? [1, 0.5, 1] : 1
              }}
              transition={{ duration: 1, repeat: isUpdating ? Infinity : 0 }}
            >
              {isUpdating ? (
                <WifiOff className="h-3 w-3 text-orange-500" />
              ) : (
                <Wifi className="h-3 w-3 text-green-500" />
              )}
            </motion.div>
            <span className="hidden sm:inline">
              {isUpdating ? 'Updating...' : `Updated ${lastUpdated.toLocaleTimeString()}`}
            </span>
          </div>
          
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading || isUpdating}
            className="relative overflow-hidden group"
          >
            <motion.div
              animate={{ rotate: (isLoading || isUpdating) ? 360 : 0 }}
              transition={{ duration: 1, repeat: (isLoading || isUpdating) ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            <span className="ml-2 hidden sm:inline">Refresh</span>
            
            {/* Loading overlay */}
            <AnimatePresence>
              {(isLoading || isUpdating) && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                />
              )}
            </AnimatePresence>
          </Button>
          
          <DarkModeToggle />
        </motion.div>
      </div>
    </div>
  </motion.header>
))

// Main optimized dashboard component
export const OptimizedDashboard = memo(() => {
  const { measureOperation } = usePerformanceMonitor('OptimizedDashboard')
  const [dateRange, setDateRange] = useState(null)
  
  const { data: baseData, isLoading, error, refreshData } = useOptimizedData(dateRange)
  const { 
    data: realtimeData, 
    isUpdating, 
    lastUpdated, 
    manualUpdate 
  } = useRealTimeUpdates(enhancedMetrics)
  
  // Memoized data merging
  const data = React.useMemo(() => {
    if (!baseData) return realtimeData
    
    return measureOperation('Data Merge', () => ({
      ...baseData,
      metrics: realtimeData.metrics,
      activityTimeline: realtimeData.activityTimeline
    }))
  }, [baseData, realtimeData, measureOperation])

  const handleRefresh = React.useCallback(() => {
    refreshData()
    manualUpdate()
  }, [refreshData, manualUpdate])

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <ErrorFallback error={error} resetErrorBoundary={handleRefresh} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        isUpdating={isUpdating}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics Cards Section */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data?.metrics?.map((metric, index) => (
                <Suspense key={metric.label} fallback={<MetricCardSkeleton />}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <OptimizedMetricCard
                      {...metric}
                      isLoading={isLoading || isUpdating}
                      previousValue={metric.value - 100}
                    />
                  </motion.div>
                </Suspense>
              )) || Array.from({ length: 4 }).map((_, i) => (
                <MetricCardSkeleton key={i} />
              ))}
            </div>
          </motion.section>
        </ErrorBoundary>

        {/* Charts Section */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Top Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Suspense fallback={<ChartSkeleton />}>
                <OptimizedLineChart 
                  data={data?.revenueData} 
                  isLoading={isLoading}
                />
              </Suspense>
              <Suspense fallback={<ChartSkeleton />}>
                <EnhancedBarChart 
                  data={data?.weeklyActiveUsers} 
                  isLoading={isLoading}
                />
              </Suspense>
            </div>
            
            {/* Bottom Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Suspense fallback={<ChartSkeleton />}>
                  <EnhancedPieChart 
                    data={data?.conversionByCampaign} 
                    isLoading={isLoading}
                  />
                </Suspense>
              </div>
              <Suspense fallback={<ChartSkeleton height="h-96" />}>
                <ActivityTimeline 
                  activities={data?.activityTimeline} 
                  isLoading={isLoading}
                />
              </Suspense>
            </div>
          </motion.section>
        </ErrorBoundary>

        {/* Data Table Section */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Suspense fallback={<ChartSkeleton height="h-96" />}>
              <EnhancedDataTable 
                data={data?.tableData} 
                isLoading={isLoading}
              />
            </Suspense>
          </motion.section>
        </ErrorBoundary>
      </main>
    </div>
  )
})

OptimizedDashboard.displayName = 'OptimizedDashboard'