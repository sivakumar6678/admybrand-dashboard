import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { 
  Brain, 
  RefreshCw, 
  Sparkles, 
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAIInsights } from '../hooks/useAIInsights';
import { cn } from '../utils/cn';

const InsightItem = ({ insight, index }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'performance': return TrendingUp;
      case 'user-behavior': return Users;
      case 'revenue': return DollarSign;
      case 'optimization': return Settings;
      default: return Brain;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'performance': return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20';
      case 'user-behavior': return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
      case 'revenue': return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
      case 'optimization': return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-blue-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const Icon = getCategoryIcon(insight.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        
        <div className="flex-1 space-y-2">
          <p className="text-sm leading-relaxed">{insight.text}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getCategoryColor(insight.category))}
              >
                {insight.category.replace('-', ' ')}
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3" />
                <span className={getConfidenceColor(insight.confidence)}>
                  {insight.confidence}% confidence
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{insight.timestamp.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AIInsightCard = ({ data, className }) => {
  const { insights, isLoading, error, refreshInsights, hasInsights, lastUpdated } = useAIInsights(data);

  const handleAskAI = () => {
    refreshInsights();
  };

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-primary/10 rounded-full">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            AI Insights
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAskAI}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Ask AI
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          AI-powered insights from your dashboard data
        </p>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        {error ? (
          <div className="flex items-center justify-center py-8 text-center">
            <div className="space-y-3">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive opacity-50" />
              <div>
                <p className="text-sm font-medium text-destructive">Failed to generate insights</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleAskAI}>
                Try Again
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-4">
              <div className="text-center space-y-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-primary/10 rounded-full mx-auto w-fit"
                >
                  <Brain className="h-6 w-6 text-primary" />
                </motion.div>
                <p className="text-sm font-medium">Analyzing your data...</p>
                <p className="text-xs text-muted-foreground">This may take a few seconds</p>
              </div>
            </div>
            
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card/50 space-y-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : hasInsights ? (
          <div className="space-y-3">
            <AnimatePresence>
              {insights.map((insight, index) => (
                <InsightItem 
                  key={insight.id} 
                  insight={insight} 
                  index={index}
                />
              ))}
            </AnimatePresence>
            
            {lastUpdated && (
              <p className="text-xs text-muted-foreground text-center pt-2 border-t">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="space-y-3">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <div>
                <p className="text-sm font-medium">No insights yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Ask AI" to generate insights from your data
                </p>
              </div>
              <Button variant="outline" onClick={handleAskAI}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Insights
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightCard;
