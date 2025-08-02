import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  ArrowUpIcon,
  ArrowDownIcon
} from "lucide-react";
import { cn } from "../utils/cn";

export default function MetricCard({ 
  title, 
  value, 
  previousValue = 0,
  icon, 
  growth, 
  unit = "",
  isLoading = false,
  trend = 'neutral', // positive, negative, neutral
  priority = 'normal' // high, normal, low
}) {
  const isPositive = growth >= 0;

  // Enhanced color system based on trend and priority
  const getCardColors = () => {
    if (priority === 'high') {
      return {
        border: 'border-primary/50 shadow-primary/10',
        gradient: 'from-primary/5 via-primary/10 to-primary/5',
        icon: 'text-primary'
      }
    }
    if (trend === 'positive') {
      return {
        border: 'border-green-200 shadow-green-100/50',
        gradient: 'from-green-50/50 via-green-100/30 to-green-50/50',
        icon: 'text-green-600'
      }
    }
    if (trend === 'negative') {
      return {
        border: 'border-red-200 shadow-red-100/50',
        gradient: 'from-red-50/50 via-red-100/30 to-red-50/50',
        icon: 'text-red-600'
      }
    }
    return {
      border: 'border-border',
      gradient: 'from-muted/20 via-muted/10 to-muted/20',
      icon: 'text-muted-foreground'
    }
  }

  // Removed unused gradient class function

  const colors = getCardColors();
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const changeBgColor = isPositive
    ? 'bg-green-50 border-green-200'
    : 'bg-red-50 border-red-200';

  if (isLoading) {
    return (
      <Card className="heavy-card relative overflow-hidden border-2 shadow-xl backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold">
            <div className="h-5 bg-muted animate-pulse rounded-lg w-24"></div>
          </CardTitle>
          <div className="h-6 w-6 bg-muted animate-pulse rounded-lg"></div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-10 bg-muted animate-pulse rounded-lg w-32 mb-3"></div>
          <div className="h-5 bg-muted animate-pulse rounded-lg w-20"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        scale: 1.03,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 15 }
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Card className={cn(
        "heavy-card relative overflow-hidden border-2 shadow-2xl backdrop-blur-lg bg-card/90 rounded-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group",
        colors.border
      )}>
        {/* Enhanced layered gradient background */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
          colors.gradient
        )} />

        {/* Additional glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Priority indicator */}
        {priority === 'high' && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary/20" />
        )}
        
        {/* Floating particles effect */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
      
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
              {title}
            </CardTitle>
            {priority === 'high' && (
              <Badge variant="secondary" className="text-xs px-2 py-1 font-semibold border shadow-sm">
                Priority
              </Badge>
            )}
          </div>
          <motion.div
            whileHover={{
              rotate: 360,
              scale: 1.2
            }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className={cn(
              "p-3 rounded-xl bg-background/70 backdrop-blur-md border-2 shadow-lg hover:shadow-xl transition-all duration-300",
              colors.icon
            )}
          >
            <div className="h-5 w-5">{icon}</div>
          </motion.div>
        </CardHeader>
      
        <CardContent className="relative z-10 pt-2">
          <motion.div
            className="text-3xl font-bold mb-4 tracking-tight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {(unit === '₹') && <span className="text-primary">{unit}</span>}
            <CountUp
              start={previousValue}
              end={value}
              duration={2.5}
              separator=","
              decimals={unit === '%' ? 1 : 0}
              useEasing={true}
              easingFn={(t, b, c, d) => {
                // Enhanced easing function for smoother animation
                return c * ((t = t / d - 1) * t * t + 1) + b
              }}
              formattingFn={(value) => {
                if (unit === '₹') {
                  return value.toLocaleString('en-IN');
                }
                return value.toLocaleString();
              }}
            />
            {unit !== '₹' && <span className="text-primary font-semibold">{unit}</span>}
          </motion.div>
        
          {growth !== undefined && (
            <motion.div
              className={cn(
                "flex items-center text-xs font-semibold rounded-xl px-4 py-2 w-fit border-2 shadow-md backdrop-blur-sm",
                changeBgColor
              )}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.08, shadow: "0 8px 25px rgba(0,0,0,0.15)" }}
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
                {Math.abs(growth)}% from last month
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
