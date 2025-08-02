// Fixed & Refactored AIAlertSystem.jsx with complete dark/light mode support

import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
      return 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-200 border border-red-500/20 dark:border-red-400/30';
    case 'high':
      return 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200 border border-orange-500/20 dark:border-orange-400/30';
    case 'medium':
      return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200 border border-yellow-500/20 dark:border-yellow-400/30';
    case 'low':
      return 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-500/20 dark:border-blue-400/30';
    case 'all-clear':
      return 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200 border border-green-500/20 dark:border-green-400/30';
    default:
      return 'bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-200 border border-gray-500/20 dark:border-gray-400/30';
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
    alertCount
  } = useAIAlerts(data, true);

  if (error) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            AI Alert System
            <Badge variant="destructive" className="ml-2">
              Error
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Alert System Error</AlertTitle>
            <AlertDescription>
              Failed to load AI alerts. {error.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!hasAlerts && !isLoading) {
    return (
      <Card className={cn("", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            AI Alert System
            <Badge variant="secondary" className={cn("ml-2", getSeverityColor('all-clear'))}>
              All Clear
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex items-center justify-between p-3 rounded-lg", getSeverityColor('all-clear'))}
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {highPriorityAlerts > 0 ? (
            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400 animate-pulse" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          AI Alert System
          {hasAlerts && (
            <Badge variant={highPriorityAlerts > 0 ? "destructive" : "secondary"} className="ml-2">
              {alertCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto max-h-96">
        {hasAlerts && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-end gap-2 pb-2"
          >
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
      </CardContent>
    </Card>
  );
};

export default AIAlertSystem;
