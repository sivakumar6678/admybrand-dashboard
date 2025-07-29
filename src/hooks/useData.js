import { useState, useEffect, useMemo } from 'react'
import { isWithinInterval, parseISO } from 'date-fns'
import enhancedMetrics from '../data/enhanced-metrics.json'

export const useData = (dateRange = null) => {
  const [data, setData] = useState(enhancedMetrics)
  const [isLoading, setIsLoading] = useState(false)

  // Filter data based on date range
  const filteredData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) {
      return data
    }

    const filterByDate = (items, dateField) => {
      return items.filter(item => {
        const itemDate = parseISO(item[dateField])
        return isWithinInterval(itemDate, {
          start: dateRange.from,
          end: dateRange.to
        })
      })
    }

    return {
      ...data,
      revenueData: filterByDate(data.revenueData, 'date'),
      weeklyActiveUsers: filterByDate(data.weeklyActiveUsers, 'date'),
      tableData: data.tableData.filter(item => {
        const joinDate = parseISO(item.joinDate)
        const lastLogin = parseISO(item.lastLogin)
        return isWithinInterval(joinDate, {
          start: dateRange.from,
          end: dateRange.to
        }) || isWithinInterval(lastLogin, {
          start: dateRange.from,
          end: dateRange.to
        })
      })
    }
  }, [data, dateRange])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true)
      
      setTimeout(() => {
        setData(prevData => ({
          ...prevData,
          metrics: prevData.metrics.map(metric => ({
            ...metric,
            value: metric.value + Math.floor(Math.random() * 100) - 50,
            change: (Math.random() * 10 - 5).toFixed(1)
          }))
        }))
        setIsLoading(false)
      }, 1000)
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setData(prevData => ({
        ...prevData,
        metrics: prevData.metrics.map(metric => ({
          ...metric,
          value: metric.value + Math.floor(Math.random() * 200) - 100,
          change: (Math.random() * 10 - 5).toFixed(1)
        }))
      }))
      setIsLoading(false)
    }, 1500)
  }

  return {
    data: filteredData,
    isLoading,
    refreshData
  }
}