
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
      "flex items-center gap-3 px-4 py-3 rounded-xl bg-card/90 text-card-foreground border-2 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
      className
    )}
  >
    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{label}</span>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm font-semibold">{value}</span>
        {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500 drop-shadow-sm" />}
        {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500 drop-shadow-sm" />}
        {trend === 'stable' && <Minus className="h-4 w-4 text-yellow-500 drop-shadow-sm" />}
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
          "border-2 border-destructive/50 shadow-xl backdrop-blur-md bg-card/90 rounded-2xl",
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <Brain className="h-6 w-6" />
              </div>
              <span className="font-semibold text-lg">Failed to load AI summary</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSummary}
              className="heavy-button text-destructive border-2 border-destructive/50 hover:bg-destructive/10
                hover:shadow-lg transition-all duration-300 hover:scale-105"
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
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      <Card className="heavy-card h-full flex flex-col border-2 shadow-2xl backdrop-blur-lg
        bg-card/90 rounded-2xl hover:shadow-3xl transition-all duration-500">
        <CardContent className="p-8 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  AI Smart Summary
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time insights powered by artificial intelligence
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSummary}
              disabled={isLoading}
              className="flex items-center gap-2"
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
                className="text-lg leading-relaxed text-foreground"
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
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {summary.recommendations} AI recommendations available
                    </span>
                  </div>
                )}
              </motion.div>

              {summary.lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Last updated: {summary.lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
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
