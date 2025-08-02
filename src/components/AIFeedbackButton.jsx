import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Brain,
  Sparkles,
  Loader2,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  X,
  Zap,
  BarChart3
} from 'lucide-react';
import { generateAIFeedback } from '../services/aiService';
import { cn } from '../utils/cn';

const FeedbackContent = ({ feedback }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100/80 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300/50 dark:border-red-600/40';
      case 'medium':
        return 'bg-yellow-100/80 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300/50 dark:border-yellow-600/40';
      case 'low':
        return 'bg-green-100/80 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300/50 dark:border-green-600/40';
      default:
        return 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300/50 dark:border-blue-600/40';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400';
    if (confidence >= 80) return 'text-blue-600 dark:text-blue-400';
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-8"
    >
      {/* Main Feedback */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50/90 via-blue-50/80 to-cyan-50/90
        dark:from-purple-950/50 dark:via-blue-950/40 dark:to-cyan-950/50
        border-2 border-purple-200/60 dark:border-purple-700/50 shadow-2xl backdrop-blur-lg
        hover:shadow-3xl transition-all duration-200 hover:scale-[1.01]
        bg-white/95 dark:bg-gray-900/90">
        <div className="flex items-start gap-6">
          <motion.div
            className="p-4 bg-purple-100/80 dark:bg-purple-900/50 rounded-2xl border-2 border-purple-300/50 dark:border-purple-600/40
              shadow-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 drop-shadow-sm" />
          </motion.div>

          <div className="flex-1 space-y-5">
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-3 tracking-tight text-gray-900 dark:text-gray-100">
                AI Recommendation
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-400 drop-shadow-sm" />
                </motion.div>
              </h3>
              <p className="text-lg leading-relaxed font-medium text-gray-700 dark:text-gray-300">{feedback.feedback}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge
                  variant="outline"
                  className={cn("text-sm font-semibold px-4 py-2 rounded-xl border-2 shadow-md backdrop-blur-sm transition-all duration-200",
                    getPriorityColor(feedback.priority))}
                >
                  <Target className="h-4 w-4 mr-2" />
                  <span>{feedback.priority} priority</span>
                </Badge>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge
                  variant="outline"
                  className="text-sm font-semibold px-4 py-2 rounded-xl border-2 shadow-md backdrop-blur-sm
                    bg-card/80 hover:bg-card transition-all duration-200 text-gray-800 dark:text-gray-200
                    border-gray-300/60 dark:border-gray-600/60"
                >
                  <CheckCircle className={cn("h-4 w-4 mr-2", getConfidenceColor(feedback.confidence))} />
                  <span className="text-gray-800 dark:text-gray-200">{feedback.confidence}% confidence</span>
                </Badge>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Badge
                  variant="secondary"
                  className="text-sm font-semibold px-4 py-2 rounded-xl border-2 shadow-md backdrop-blur-sm
                    bg-secondary/80 hover:bg-secondary transition-all duration-200 text-gray-800 dark:text-gray-200
                    border-gray-300/60 dark:border-gray-600/60"
                >
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-800 dark:text-gray-200" />
                  <span className="text-gray-800 dark:text-gray-200">{feedback.estimatedImpact}</span>
                </Badge>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          className="p-6 rounded-2xl border-2 bg-card/95 shadow-xl backdrop-blur-md
            hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]
            bg-white/95 dark:bg-gray-900/90 border-gray-200/60 dark:border-gray-700/50"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-yellow-100/80 dark:bg-yellow-900/30 border border-yellow-300/50 dark:border-yellow-600/40">
              <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Key Insight</h4>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            This recommendation is based on current performance patterns and industry benchmarks,
            analyzed through advanced AI algorithms.
          </p>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl border-2 bg-card/95 shadow-xl backdrop-blur-md
            hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]
            bg-white/95 dark:bg-gray-900/90 border-gray-200/60 dark:border-gray-700/50"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-600/40">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Implementation</h4>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            Expected implementation time: 1-2 weeks with measurable results within 30 days.
            Priority actions highlighted for immediate impact.
          </p>
        </motion.div>
      </div>

      {/* Timestamp */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 border border-border/60 backdrop-blur-sm">
          <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Generated at {feedback.timestamp.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced AI Insights Component
const AIInsightsDisplay = () => {

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <motion.div
        className="p-4 rounded-xl border-2 bg-gradient-to-br from-blue-50/90 to-blue-100/70
          dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200/60 dark:border-blue-700/50
          shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-100/90 dark:bg-blue-900/50">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">Performance</h4>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
          Your metrics show strong growth patterns with 15% improvement this quarter.
        </p>
      </motion.div>

      <motion.div
        className="p-4 rounded-xl border-2 bg-gradient-to-br from-yellow-50/90 to-yellow-100/70
          dark:from-yellow-950/50 dark:to-yellow-900/30 border-yellow-200/60 dark:border-yellow-700/50
          shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-yellow-100/90 dark:bg-yellow-900/50">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Optimization</h4>
        </div>
        <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">
          Consider optimizing conversion funnel for 20% better performance.
        </p>
      </motion.div>

      <motion.div
        className="p-4 rounded-xl border-2 bg-gradient-to-br from-green-50/90 to-green-100/70
          dark:from-green-950/50 dark:to-green-900/30 border-green-200/60 dark:border-green-700/50
          shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-200"
        whileHover={{ y: -2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-green-100/90 dark:bg-green-900/50">
            <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-green-900 dark:text-green-100">Insights</h4>
        </div>
        <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
          Peak engagement occurs during 2-4 PM. Schedule content accordingly.
        </p>
      </motion.div>
    </div>
  );
};

const AIFeedbackButton = ({ data, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const handleGetFeedback = async () => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    
    try {
      const result = await generateAIFeedback(data);
      setFeedback(result);
    } catch (err) {
      setError(err.message || 'Failed to generate feedback');
      console.error('Error generating AI feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!feedback && !isLoading) {
      handleGetFeedback();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Don't clear feedback immediately to allow for smooth closing
    setTimeout(() => {
      if (!isOpen) {
        setFeedback(null);
        setError(null);
      }
    }, 300);
  };

  return (
    <>
      {/* Enhanced AI Feedback Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={cn("fixed bottom-8 right-8 z-50", className)}
              initial={{ scale: 0, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                {/* Enhanced AI glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Floating particles effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.4) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)"
                    ]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                <Button
                  onClick={handleOpen}
                  size="lg"
                  className="relative h-18 w-18 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600
                    hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 border-2 border-purple-300/50 dark:border-purple-400/30
                    backdrop-blur-sm transition-all duration-200 hover:shadow-3xl hover:border-purple-200/70 dark:hover:border-purple-300/40
                    focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/60 dark:focus:ring-purple-400/30
                    group overflow-hidden"
                >
                  {/* AI Brain Icon with enhanced animation */}
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, repeatDelay: 2 },
                      scale: { duration: 2, repeat: Infinity, repeatDelay: 1 }
                    }}
                    className="relative z-10"
                  >
                    <Brain className="h-8 w-8 text-white drop-shadow-lg" />
                  </motion.div>

                  {/* Sparkles around the brain */}
                  <motion.div
                    className="absolute top-2 right-2"
                    animate={{
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-3 w-3 text-yellow-300 drop-shadow-sm" />
                  </motion.div>

                  <motion.div
                    className="absolute bottom-2 left-2"
                    animate={{
                      rotate: [360, 0],
                      scale: [1, 0.7, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <Sparkles className="h-2 w-2 text-cyan-300 drop-shadow-sm" />
                  </motion.div>

                  {/* Enhanced pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-purple-400/50"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  />

                  {/* Secondary pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30"
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                  />
                </Button>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-white" />
              <p className="text-white">Get AI Insights & Recommendations</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Enhanced AI Feedback Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-2 shadow-3xl backdrop-blur-xl
          bg-gradient-to-br from-white/98 via-blue-50/60 to-purple-50/60
          dark:from-gray-900/95 dark:via-blue-950/50 dark:to-purple-950/50
          border-purple-200/60 dark:border-purple-700/50">
          <DialogHeader className="pb-8 border-b-2 border-purple-200/60 dark:border-purple-700/60">
            <DialogTitle className="flex items-center gap-4 text-3xl font-bold tracking-tight">
              <motion.div
                className="p-4 bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100
                  dark:from-purple-900/50 dark:via-blue-900/50 dark:to-cyan-900/50
                  rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/50 shadow-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.3)",
                    "0 0 30px rgba(59, 130, 246, 0.3)",
                    "0 0 20px rgba(168, 85, 247, 0.3)"
                  ]
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  boxShadow: { duration: 3, repeat: Infinity }
                }}
              >
                <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 drop-shadow-sm" />
              </motion.div>
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  AI Insights & Recommendations
                </span>
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                  Powered by Advanced Analytics
                </span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
              Discover personalized insights, optimization opportunities, and actionable recommendations
              tailored to your business performance data.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center py-16"
                >
                  <div className="space-y-6">
                    <motion.div
                      className="p-6 bg-red-100/80 dark:bg-red-900/30 rounded-2xl mx-auto w-fit border-2 border-red-300/50 dark:border-red-600/40 shadow-lg"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <X className="h-10 w-10 text-red-600 dark:text-red-400 drop-shadow-sm" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Failed to Generate Feedback</h3>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400 max-w-md mx-auto leading-relaxed">{error}</p>
                    </div>
                    <Button
                      onClick={handleGetFeedback}
                      variant="outline"
                      className="heavy-button px-6 py-3 font-semibold transition-all duration-200
                        text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100
                        border-red-300 dark:border-red-600 hover:border-red-400 dark:hover:border-red-500
                        hover:bg-red-50 dark:hover:bg-red-950/20
                        focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 dark:focus:ring-red-400/30"
                    >
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Loader2 className="h-4 w-4 mr-2 text-red-700 dark:text-red-300" />
                      </motion.div>
                      <span className="text-red-700 dark:text-red-300">Try Again</span>
                    </Button>
                  </div>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center py-16"
                >
                  <div className="space-y-8">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="p-6 bg-gradient-to-br from-primary/15 to-blue-500/15 rounded-2xl mx-auto w-fit
                          border-2 border-primary/30 shadow-2xl backdrop-blur-sm"
                      >
                        <Brain className="h-12 w-12 text-primary drop-shadow-lg" />
                      </motion.div>

                      {/* Animated rings */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-primary/20"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [1, 0, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-blue-500/20"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [1, 0, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                      />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Analyzing Your Data
                      </h3>
                      <p className="text-base font-medium text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                        AI is processing your metrics and generating personalized recommendations...
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-muted/60 border border-border/60 backdrop-blur-sm w-fit mx-auto">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">This may take a few seconds</span>
                    </div>
                  </div>
                </motion.div>
              ) : feedback ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="space-y-8">
                    <FeedbackContent feedback={feedback} />

                    {/* Enhanced AI Insights Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                          Additional AI Insights
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Comprehensive analysis of your business metrics and performance indicators.
                        </p>
                      </div>
                      <AIInsightsDisplay feedback={feedback} />
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center py-16"
                >
                  <div className="space-y-8">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <div className="p-10 bg-gradient-to-br from-purple-100/90 via-blue-100/90 to-cyan-100/90
                        dark:from-purple-900/30 dark:via-blue-900/30 dark:to-cyan-900/30
                        rounded-3xl mx-auto w-fit border-2 border-purple-200/60 dark:border-purple-700/50
                        shadow-2xl backdrop-blur-sm relative overflow-hidden">

                        {/* Animated background gradient */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-purple-200/50 to-cyan-200/50
                            dark:from-purple-800/20 dark:to-cyan-800/20"
                          animate={{
                            background: [
                              "linear-gradient(45deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
                              "linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
                              "linear-gradient(45deg, rgba(34, 197, 94, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)"
                            ]
                          }}
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        />

                        <Brain className="h-24 w-24 text-purple-600 dark:text-purple-400 drop-shadow-lg relative z-10" />
                      </div>

                      {/* Multiple floating sparkles */}
                      <motion.div
                        className="absolute -top-3 -right-3"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Sparkles className="h-7 w-7 text-yellow-500 dark:text-yellow-400" />
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-2 -left-2"
                        animate={{
                          rotate: [360, 0],
                          scale: [0.8, 1.1, 0.8]
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                      >
                        <Sparkles className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                      </motion.div>

                      <motion.div
                        className="absolute top-1/2 -left-4"
                        animate={{
                          rotate: [0, 180, 360],
                          scale: [1, 0.7, 1]
                        }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                      >
                        <Sparkles className="h-3 w-3 text-purple-500 dark:text-purple-400" />
                      </motion.div>
                    </motion.div>

                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        AI-Powered Business Intelligence
                      </h3>
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Unlock deep insights from your data with advanced AI analysis. Get personalized recommendations,
                        performance optimizations, and strategic guidance tailored to your business metrics.
                      </p>

                      {/* Feature highlights */}
                      <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/90 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Performance Analysis</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">Growth Insights</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/90 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300">
                          <Target className="h-4 w-4" />
                          <span className="text-sm font-medium">Strategic Recommendations</span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleGetFeedback}
                        size="lg"
                        className="heavy-button px-10 py-5 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
                          hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 shadow-2xl hover:shadow-3xl
                          border-2 border-purple-300/40 dark:border-purple-400/20 text-white relative overflow-hidden group
                          focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/60 dark:focus:ring-purple-400/30
                          transition-all duration-200"
                      >
                        {/* Button glow effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 blur-xl"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        <div className="relative z-10 flex items-center text-white">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Brain className="h-6 w-6 mr-3 text-white" />
                          </motion.div>
                          Generate AI Insights
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t-2 border-purple-200/50 dark:border-purple-700/50">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handleClose}
                className="heavy-button px-6 py-3 font-semibold transition-all duration-200 
                  text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100
                  border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500
                  focus:outline-none focus:ring-2 focus:ring-gray-500/30 focus:border-gray-500 dark:focus:ring-gray-400/30"
              >
                <X className="h-4 w-4 mr-2 text-gray-700 dark:text-gray-300" />
                Close
              </Button>
            </motion.div>
            {feedback && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleGetFeedback}
                  disabled={isLoading}
                  className="heavy-button px-6 py-3 font-semibold bg-gradient-to-r from-primary to-blue-600
                    hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : { rotate: [0, 10, -10, 0] }}
                    transition={isLoading ?
                      { duration: 1, repeat: Infinity, ease: "linear" } :
                      { duration: 2, repeat: Infinity, repeatDelay: 3 }
                    }
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 text-white" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2 text-white" />
                    )}
                  </motion.div>
                  <span className="text-white">{isLoading ? 'Generating...' : 'Generate New Feedback'}</span>
                </Button>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIFeedbackButton;
