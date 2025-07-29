import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export const LoadingSkeleton = ({ className, ...props }) => {
  return (
    <motion.div
      className={cn(
        "animate-pulse rounded-md bg-muted shimmer",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  )
}

export const MetricCardSkeleton = () => (
  <div className="p-6 space-y-3">
    <div className="flex items-center justify-between">
      <LoadingSkeleton className="h-4 w-20" />
      <LoadingSkeleton className="h-4 w-4 rounded-full" />
    </div>
    <LoadingSkeleton className="h-8 w-24" />
    <LoadingSkeleton className="h-4 w-16" />
  </div>
)

export const ChartSkeleton = ({ height = "h-80" }) => (
  <div className="p-6">
    <LoadingSkeleton className="h-6 w-32 mb-4" />
    <LoadingSkeleton className={cn("w-full", height)} />
  </div>
)

export const TableSkeleton = () => (
  <div className="p-6 space-y-4">
    <div className="flex gap-4">
      <LoadingSkeleton className="h-10 flex-1" />
      <LoadingSkeleton className="h-10 w-32" />
      <LoadingSkeleton className="h-10 w-32" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <LoadingSkeleton className="h-4 w-4" />
          <LoadingSkeleton className="h-4 flex-1" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  </div>
)