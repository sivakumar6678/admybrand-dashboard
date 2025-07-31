import React, { useState, useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  ArrowUpIcon, 
  ArrowDownIcon 
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  growth?: number;
  unit?: string;
  isLoading?: boolean;
  trend?: 'positive' | 'negative' | 'neutral';
  priority?: 'high' | 'normal' | 'low';
  format?: 'currency' | 'number' | 'percentage';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  previousValue = 0,
  icon, 
  growth, 
  unit = "",
  isLoading = false,
  trend = 'neutral',
  priority = 'normal',
  format = 'number'
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionValue = useMotionValue(previousValue);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  const isPositive = growth ? growth >= 0 : false;

  // Format number based on type
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  // Animate counter on mount and value change
  useEffect(() => {
    if (!isLoading && !hasAnimated) {
      const controls = animate(motionValue, value, {
        duration: 2.5,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
        onComplete: () => setHasAnimated(true)
      });

      return controls.stop;
    }
  }, [motionValue, value, isLoading, hasAnimated]);

  // Reset animation when value changes significantly
  useEffect(() => {
    if (hasAnimated && Math.abs(value - motionValue.get()) > value * 0.1) {
      setHasAnimated(false);
    }
  }, [value, motionValue, hasAnimated]);

  // Enhanced color system based on trend and priority
  const getCardColors = () => {
    if (priority === 'high') {
      return {
        border: 'border-primary/50 shadow-primary/10',
        gradient: 'from-primary/5 via-primary/10 to-primary/5',
        icon: 'text-primary bg-primary/10'
      }
    }
    if (trend === 'positive') {
      return {
        border: 'border-green-200 dark:border-green-800 shadow-green-100/50 dark:shadow-green-900/20',
        gradient: 'from-green-50/50 via-green-100/30 to-green-50/50 dark:from-green-950/20 dark:via-green-900/10 dark:to-green-950/20',
        icon: 'text-green-600 dark:text-green-400 bg-green-500/10'
      }
    }
    if (trend === 'negative') {
      return {
        border: 'border-red-200 dark:border-red-800 shadow-red-100/50 dark:shadow-red-900/20',
        gradient: 'from-red-50/50 via-red-100/30 to-red-50/50 dark:from-red-950/20 dark:via-red-900/10 dark:to-red-950/20',
        icon: 'text-red-600 dark:text-red-400 bg-red-500/10'
      }
    }
    return {
      border: 'border-border',
      gradient: 'from-muted/20 via-muted/10 to-muted/20',
      icon: 'text-muted-foreground bg-muted/50'
    }
  }

  const colors = getCardColors();
  const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const changeBgColor = isPositive 
    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
          </CardTitle>
          <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded w-24 mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className={cn(
        "relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full flex flex-col",
        colors.border
      )}>
        {/* Enhanced gradient background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          colors.gradient
        )} />
        
        {/* Priority indicator */}
        {priority === 'high' && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary/20" />
        )}
        
        {/* Floating particles effect */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
      
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {priority === 'high' && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                Priority
              </Badge>
            )}
          </div>
          <motion.div
            whileHover={{ 
              rotate: 360,
              scale: 1.1
            }}
            transition={{ duration: 0.5, type: "spring" }}
            className={cn(
              "p-2.5 rounded-full backdrop-blur-sm transition-colors",
              colors.icon
            )}
          >
            <div className="h-5 w-5">{icon}</div>
          </motion.div>
        </CardHeader>
      
        <CardContent className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div 
            className="text-2xl lg:text-3xl font-bold mb-3 font-mono"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <motion.span>
              {format === 'currency' ? '$' : ''}
              {hasAnimated ? formatValue(value).replace(/[$%]/g, '') : rounded.get().toLocaleString()}
              {format === 'percentage' ? '%' : ''}
              {unit && format === 'number' && unit}
            </motion.span>
          </motion.div>
        
          {growth !== undefined && (
            <motion.div 
              className={cn(
                "flex items-center text-xs rounded-full px-3 py-1.5 w-fit border backdrop-blur-sm",
                changeBgColor
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ 
                  y: isPositive ? [0, -2, 0] : [0, 2, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              >
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1.5" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1.5" />
                )}
              </motion.div>
              <span className={cn("font-medium", changeColor)}>
                {Math.abs(growth).toFixed(1)}% vs last month
              </span>
            </motion.div>
          )}

          {/* Additional micro-interactions */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ 
                x: hasAnimated ? ['100%', '200%'] : '-100%',
                opacity: hasAnimated ? [0, 1, 0] : 0
              }}
              transition={{ 
                duration: 1.5, 
                delay: hasAnimated ? 2 : 0,
                ease: "easeInOut"
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};