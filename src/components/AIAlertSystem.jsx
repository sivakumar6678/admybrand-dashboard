import React from 'react';
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
      return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20';
    case 'high':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20';
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20';
    case 'low':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20';
  }
};

const AlertItem = ({ alert, onDismiss, index }) => {
  const getAlertVariant = (type) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'error':
        return 'destructive';
      case 'info':
      default:
        return 'info';
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
      <Alert variant={getAlertVariant(alert.type)} className="pr-12">
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{alert.icon}</span>
            <AlertIcon type={alert.type} />
          </div>
          
          <div className="flex-1 space-y-1">
            <AlertTitle className="text-sm font-medium">
              {alert.title}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {alert.message}
            </AlertDescription>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getSeverityColor(alert.severity))}
              >
                {alert.severity} priority
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/10"
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dismiss alert</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Alert>
    </motion.div>
  );
};

const AIAlertSystem = ({ data, className }) => {
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
          className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
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
          className="flex items-center justify-between p-3 rounded-lg bg-card border"
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

      {/* Alert List */}
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
