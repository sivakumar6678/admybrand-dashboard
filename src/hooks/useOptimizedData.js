import { useState, useEffect, useMemo, useCallback } from 'react'
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns'

// Optimized data hook with memoization and efficient filtering
export const useOptimizedData = (dateRange) => {
  const [baseData, setBaseData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoized data filtering based on date range
  const filteredData = useMemo(() => {
    if (!baseData || !dateRange?.from) return baseData

    const filterByDate = (data, dateField = 'date') => {
      if (!Array.isArray(data)) return data
      
      return data.filter(item => {
        const itemDate = new Date(item[dateField])
        return isWithinInterval(itemDate, {
          start: startOfDay(dateRange.from),
          end: dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from)
        })
      })
    }

    return {
      ...baseData,
      revenueData: filterByDate(baseData.revenueData),
      weeklyActiveUsers: filterByDate(baseData.weeklyActiveUsers),
      tableData: filterByDate(baseData.tableData, 'lastLogin'),
      activityTimeline: filterByDate(baseData.activityTimeline, 'timestamp')
    }
  }, [baseData, dateRange])

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Import data dynamically to reduce initial bundle size
      const [metricsData, chartData, tableData] = await Promise.all([
        import('../data/enhanced-metrics.json'),
        import('../data/chart-data.json'),
        import('../data/table-data.json')
      ])

      setBaseData({
        metrics: metricsData.default.metrics,
        revenueData: chartData.default.revenueData,
        weeklyActiveUsers: chartData.default.weeklyActiveUsers,
        conversionByCampaign: chartData.default.conversionByCampaign,
        tableData: tableData.default.users,
        activityTimeline: metricsData.default.activityTimeline
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refreshData = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data: filteredData,
    isLoading,
    error,
    refreshData
  }
}