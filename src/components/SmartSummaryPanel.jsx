import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  Sparkles,
  Users,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useSmartSummary } from '../hooks/useSmartSummary';
import { cn } from '../utils/cn';

const MetricBadge = ({ icon: Icon, label, value, trend, className }) => (
  <div
    className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-black border border-gray-300 transition-colors duration-300 ease-in-out",
      "dark:bg-[#1c1c1c] dark:text-white dark:border-gray-700",
      className
    )}
  >
    <Icon className="h-4 w-4 text-gray-600 dark:text-white transition-colors duration-300 ease-in-out" />
    <div className="flex flex-col">
      <span className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">{value}</span>
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
        {trend === 'stable' && <Minus className="h-3 w-3 text-yellow-500" />}
      </div>
    </div>
  </div>
);

const SmartSummaryPanel = ({ data, className }) => {
  const { summary, isLoading, error, refreshSummary, hasSummary } = useSmartSummary(data, true);

  if (error) {
    return (
      <Card
        className={cn(
          "bg-white text-black border border-destructive/50 transition-colors duration-300 ease-in-out",
          "dark:bg-[#1c1c1c] dark:text-white dark:border-destructive/50",
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-destructive">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Failed to load AI summary</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSummary}
              className="text-destructive border-destructive/50 hover:bg-destructive/10 transition-colors duration-300 ease-in-out"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card
        className={cn(
          "bg-white text-black border border-gray-300 transition-colors duration-300 ease-in-out h-full flex flex-col",
          "dark:bg-[#1c1c1c] dark:text-white dark:border-gray-700"
        )}
      >
        <CardContent className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full transition-colors duration-300 ease-in-out">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  AI Smart Summary
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                  Real-time insights powered by artificial intelligence
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSummary}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")}/>
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
              </div>
            </div>
          ) : hasSummary ? (
            <div className="space-y-4">
              <motion.p
                className="text-lg leading-relaxed text-gray-900 dark:text-white transition-colors duration-300 ease-in-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {summary.summary}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {summary.keyMetrics?.revenue && (
                  <MetricBadge
                    icon={DollarSign}
                    label="Revenue"
                    value={`₹${summary.keyMetrics.revenue.value.toLocaleString('en-IN')}`}
                    trend={summary.keyMetrics.revenue.trend}
                  />
                )}

                {summary.keyMetrics?.users && (
                  <MetricBadge
                    icon={Users}
                    label="Users"
                    value={summary.keyMetrics.users.value.toLocaleString()}
                    trend={summary.keyMetrics.users.trend}
                  />
                )}

                {summary.keyMetrics?.conversion && (
                  <MetricBadge
                    icon={BarChart3}
                    label="Conversion"
                    value={`${summary.keyMetrics.conversion.value}%`}
                    trend={summary.keyMetrics.conversion.trend}
                  />
                )}

                {summary.recommendations && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 transition-colors duration-300 ease-in-out dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {summary.recommendations} AI recommendations available
                    </span>
                  </div>
                )}
              </motion.div>

              {summary.lastUpdated && (
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out">
                  Last updated: {summary.lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No summary available. Click refresh to generate insights.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartSummaryPanel;
