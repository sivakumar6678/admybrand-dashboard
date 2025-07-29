import { useState, useEffect, useCallback } from 'react'

export const useRealTimeUpdates = (initialData, updateInterval = 30000) => {
  const [data, setData] = useState(initialData)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const generateRandomUpdate = useCallback((currentValue, maxChange = 0.1) => {
    const changePercent = (Math.random() - 0.5) * maxChange
    const change = currentValue * changePercent
    return Math.max(0, Math.round(currentValue + change))
  }, [])

  const updateMetrics = useCallback(() => {
    setIsUpdating(true)
    
    setTimeout(() => {
      setData(prevData => ({
        ...prevData,
        metrics: prevData.metrics.map(metric => ({
          ...metric,
          value: generateRandomUpdate(metric.value, 0.05),
          change: (Math.random() * 10 - 5).toFixed(1)
        })),
        // Add new activity
        activityTimeline: [
          {
            id: Date.now(),
            type: ['signup', 'purchase', 'login', 'upgrade'][Math.floor(Math.random() * 4)],
            user: ['Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis'][Math.floor(Math.random() * 4)],
            description: [
              'New user registered',
              'Completed purchase',
              'User logged in',
              'Upgraded to Pro plan'
            ][Math.floor(Math.random() * 4)],
            timestamp: new Date().toISOString(),
            avatar: ['AJ', 'SW', 'MC', 'ED'][Math.floor(Math.random() * 4)]
          },
          ...prevData.activityTimeline.slice(0, 4)
        ]
      }))
      
      setIsUpdating(false)
      setLastUpdated(new Date())
    }, 1000)
  }, [generateRandomUpdate])

  useEffect(() => {
    const interval = setInterval(updateMetrics, updateInterval)
    return () => clearInterval(interval)
  }, [updateMetrics, updateInterval])

  const manualUpdate = useCallback(() => {
    updateMetrics()
  }, [updateMetrics])

  return {
    data,
    isUpdating,
    lastUpdated,
    manualUpdate
  }
}