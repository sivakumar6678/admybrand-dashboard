import { useEffect, useRef, useCallback } from 'react'

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  const renderCount = useRef(0)
  const startTime = useRef(performance.now())

  useEffect(() => {
    renderCount.current += 1
    const endTime = performance.now()
    const renderTime = endTime - startTime.current

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${componentName} - Render #${renderCount.current} - Time: ${renderTime.toFixed(2)}ms`)
    }

    startTime.current = performance.now()
  })

  const measureOperation = useCallback((operationName, operation) => {
    const start = performance.now()
    const result = operation()
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} - ${operationName}: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }, [componentName])

  return { measureOperation }
}

// Debounce hook for performance optimization
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}