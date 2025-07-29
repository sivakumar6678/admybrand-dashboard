import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { Card, CardContent } from '../ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../utils/cn'
import { LoadingSkeleton } from '../shared/LoadingSkeleton'

const TrendIcon = memo(({ trend, className }) => {
  const IconComponent = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const colorClass = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
  
  return <IconComponent className={cn(className, colorClass)} />
})

const MetricValue = memo(({ value, previousValue, format, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton className="h-8 w-24" />
  }

  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    }
    if (format === 'percentage') {
      return `${val}%`
    }
    return new Intl.NumberFormat('en-US').format(val)
  }

  return (
    <motion.div
      key={value}
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="text-3xl font-bold tracking-tight"
    >
      <CountUp
        start={previousValue || 0}
        end={value}
        duration={2}
        separator=","
        formattingFn={formatValue}
      />
    </motion.div>
  )
})

const TrendIndicator = memo(({ change, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton className="h-4 w-16" />
  }

  const trend = parseFloat(change)
  const isPositive = trend > 0
  const isNegative = trend < 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className={cn(
        "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
        isPositive && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        isNegative && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
        !isPositive && !isNegative && "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
      )}
    >
      <TrendIcon trend={trend} className="h-3 w-3" />
      <span>{Math.abs(trend)}%</span>
    </motion.div>
  )
})

export const OptimizedMetricCard = memo(({
  label,
  value,
  change,
  icon: Icon,
  color = 'blue',
  format = 'number',
  previousValue,
  isLoading = false,
  className,
  ...props
}) => {
  // Memoize color classes to prevent recalculation
  const colorClasses = useMemo(() => {
    const colors = {
      blue: {
        icon: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
        gradient: 'from-blue-500/10 to-blue-600/10',
        border: 'border-blue-200 dark:border-blue-800'
      },
      green: {
        icon: 'text-green-600 bg-green-100 dark:bg-green-900/20',
        gradient: 'from-green-500/10 to-green-600/10',
        border: 'border-green-200 dark:border-green-800'
      },
      purple: {
        icon: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
        gradient: 'from-purple-500/10 to-purple-600/10',
        border: 'border-purple-200 dark:border-purple-800'
      },
      orange: {
        icon: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
        gradient: 'from-orange-500/10 to-orange-600/10',
        border: 'border-orange-200 dark:border-orange-800'
      }
    }
    return colors[color] || colors.blue
  }, [color])

  if (isLoading) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-10 w-10 rounded-full" />
          </div>
          <LoadingSkeleton className="h-8 w-24 mb-2" />
          <LoadingSkeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={className}
      {...props}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl group",
        colorClasses.border
      )}>
        {/* Gradient Background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity duration-300",
          colorClasses.gradient
        )} />
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
        </div>

        <CardContent className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <motion.h3 
              className="text-sm font-medium text-muted-foreground tracking-wide uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {label}
            </motion.h3>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={cn(
                "p-2.5 rounded-xl shadow-sm",
                colorClasses.icon
              )}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </div>

          {/* Value */}
          <div className="mb-3">
            <MetricValue
              value={value}
              previousValue={previousValue}
              format={format}
              isLoading={isLoading}
            />
          </div>

          {/* Trend */}
          <div className="flex items-center justify-between">
            <TrendIndicator change={change} isLoading={isLoading} />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-muted-foreground"
            >
              vs last period
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
            style={{ transform: 'skewX(-20deg)' }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
})

OptimizedMetricCard.displayName = 'OptimizedMetricCard'