import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { useData } from '../hooks/useData'
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates'
import enhancedMetrics from '../data/enhanced-metrics.json'
import { EnhancedMetricCard } from './cards/EnhancedMetricCard'
import { EnhancedLineChart } from './charts/EnhancedLineChart'
import { EnhancedBarChart } from './charts/EnhancedBarChart'
import { EnhancedPieChart } from './charts/EnhancedPieChart'
import { EnhancedDataTable } from './table/EnhancedDataTable'
import { ActivityTimeline } from './shared/ActivityTimeline'
import { DateRangePicker } from './shared/DateRangePicker'
import { DarkModeToggle } from './DarkModeToggle'

export const EnhancedDashboard = () => {
  const [dateRange, setDateRange] = useState(null)
  const { data: baseData, isLoading, refreshData } = useData(dateRange)
  const { 
    data: realtimeData, 
    isUpdating, 
    lastUpdated, 
    manualUpdate 
  } = useRealTimeUpdates(enhancedMetrics)
  
  // Merge base data with real-time updates
  const data = {
    ...baseData,
    metrics: realtimeData.metrics,
    activityTimeline: realtimeData.activityTimeline
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your business metrics and performance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <DateRangePicker 
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              
              {/* Real-time status indicator */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isUpdating ? (
                  <WifiOff className="h-3 w-3 animate-pulse" />
                ) : (
                  <Wifi className="h-3 w-3 text-green-500" />
                )}
                <span>
                  {isUpdating ? 'Updating...' : `Updated ${lastUpdated.toLocaleTimeString()}`}
                </span>
              </div>
              
              <Button
                onClick={() => {
                  refreshData()
                  manualUpdate()
                }}
                variant="outline"
                size="sm"
                disabled={isLoading || isUpdating}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${(isLoading || isUpdating) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8">
        {/* Metrics Cards */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.metrics.map((metric, index) => (
              <EnhancedMetricCard
                key={metric.label}
                {...metric}
                isLoading={isLoading || isUpdating}
                previousValue={metric.value - 100} // Simulate previous value for animation
              />
            ))}
          </div>
        </motion.section>

        {/* Charts Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <EnhancedLineChart 
              data={data.revenueData} 
              isLoading={isLoading}
            />
            <EnhancedBarChart 
              data={data.weeklyActiveUsers} 
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancedPieChart 
                data={data.conversionByCampaign} 
                isLoading={isLoading}
              />
            </div>
            <ActivityTimeline 
              activities={data.activityTimeline} 
              isLoading={isLoading}
            />
          </div>
        </motion.section>

        {/* Data Table */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <EnhancedDataTable 
            data={data.tableData} 
            isLoading={isLoading}
          />
        </motion.section>
      </main>
    </div>
  )
}