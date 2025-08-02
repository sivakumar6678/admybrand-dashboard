import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  X,
  Bell,
  BellOff,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useAIAlerts } from '../hooks/useAIAlerts';
import { cn } from '../utils/cn';

const AlertIcon = ({ type, className }) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className={cn("h-4 w-4", className)} />;
    case 'info':
      return <Info className={cn("h-4 w-4", className)} />;
    case 'success':
      return <CheckCircle className={cn("h-4 w-4", className)} />;
    case 'error':
      return <XCircle className={cn("h-4 w-4", className)} />;
    default:
      return <Info className={cn("h-4 w-4", className)} />;
  }
};

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'critical':
            return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 border-red-500/20 dark:border-red-400/30';
        case 'high':
            return 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 border-orange-500/20 dark:border-orange-400/30';
        case 'medium':
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border-yellow-500/20 dark:border-yellow-400/30';
        case 'low':
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 border-blue-500/20 dark:border-blue-400/30';
        default:
            return 'bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 border-gray-500/20 dark:border-gray-400/30';
    }
};


const AlertItem = ({ alert, onDismiss, index }) => {
  const getAlertVariant = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'error': return 'destructive';
      case 'info':
      default: return 'info';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <Alert
        variant={getAlertVariant(alert.type)}
        className="pr-12 border-2 shadow-xl backdrop-blur-md bg-card/95
          hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] rounded-xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10
            border border-primary/20 shadow-sm">
            <span className="text-xl drop-shadow-sm">{alert.icon}</span>
            <AlertIcon type={alert.type} className="drop-shadow-sm" />
          </div>

          <div className="flex-1 space-y-2">
            <AlertTitle className="text-sm font-semibold tracking-wide">
              {alert.title}
            </AlertTitle>
            <AlertDescription className="text-sm font-medium leading-relaxed">
              {alert.message}
            </AlertDescription>

            <div className="flex items-center gap-3 mt-3">
              <Badge
                className={cn("text-xs font-semibold px-3 py-1 rounded-full border shadow-sm",
                  getSeverityColor(alert.severity))}
              >
                {alert.severity} priority
              </Badge>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium
                px-2 py-1 rounded-md bg-muted/50">
                <Clock className="h-3 w-3" />
                <span>{alert.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(alert.id)}
                className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full border-2 border-transparent
                  hover:border-destructive/30 hover:bg-destructive/10 hover:shadow-md
                  transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              >
                <X className="h-4 w-4 font-bold" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="font-medium">
              <p>Dismiss alert</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Alert>
    </motion.div>
  );
};

const AIAlertSystem = ({ data, className }) => {
  const [mounted, setMounted] = useState(false);

  const {
    alerts,
    highPriorityAlerts,
    isLoading,
    error,
    dismissAlert,
    clearDismissedAlerts,
    refreshAlerts,
    hasAlerts,
    hasHighPriorityAlerts,
    alertCount
  } = useAIAlerts(data, true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={cn("space-y-3 h-full", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="p-3 bg-muted/50 rounded-full mx-auto w-fit animate-pulse">
              <div className="h-6 w-6 bg-muted rounded" />
            </div>
            <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-muted rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-2", className)}>
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Alert System Error</AlertTitle>
          <AlertDescription>
            Failed to load AI alerts. {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasAlerts && !isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-green-100/80 dark:bg-green-900/40
            border-2 border-green-500/30 dark:border-green-400/40 shadow-lg backdrop-blur-md
            hover:shadow-xl transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-900 dark:text-green-200">
              All systems running smoothly
            </span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshAlerts}
                  disabled={isLoading}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh alerts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 h-full overflow-y-auto", className)}>
      {/* Alert Header */}
      {hasAlerts && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-xl bg-card/95 border-2
            shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-500"
        >
          <div className="flex items-center gap-2">
            {hasHighPriorityAlerts ? (
              <Bell className="h-4 w-4 text-orange-500 animate-pulse" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {alertCount} Active Alert{alertCount !== 1 ? 's' : ''}
              {hasHighPriorityAlerts && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  {highPriorityAlerts.length} High Priority
                </Badge>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDismissedAlerts}
                    className="text-xs h-6"
                  >
                    Clear Dismissed
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove dismissed alerts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshAlerts}
                    disabled={isLoading}
                    className="h-6 w-6 p-0"
                  >
                    <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Refresh alerts</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onDismiss={dismissAlert}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      {isLoading && alerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8"
        >
          <div className="text-center space-y-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-primary/10 rounded-full mx-auto w-fit"
            >
              <Bell className="h-6 w-6 text-primary" />
            </motion.div>
            <p className="text-sm font-medium">Checking for alerts...</p>
            <p className="text-xs text-muted-foreground">AI is monitoring your system</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIAlertSystem;
