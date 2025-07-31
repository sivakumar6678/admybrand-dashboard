import React, { useState } from 'react';
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
  MessageSquare, 
  Sparkles, 
  Loader2,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  X
} from 'lucide-react';
import { generateAIFeedback } from '../services/aiService';
import { cn } from '../utils/cn';

const FeedbackContent = ({ feedback }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20';
      default:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
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
      className="space-y-6"
    >
      {/* Main Feedback */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                AI Recommendation
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </h3>
              <p className="text-base leading-relaxed">{feedback.feedback}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge 
                variant="outline" 
                className={cn("text-sm", getPriorityColor(feedback.priority))}
              >
                <Target className="h-3 w-3 mr-1" />
                {feedback.priority} priority
              </Badge>
              
              <Badge variant="outline" className="text-sm">
                <CheckCircle className={cn("h-3 w-3 mr-1", getConfidenceColor(feedback.confidence))} />
                {feedback.confidence}% confidence
              </Badge>
              
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                {feedback.estimatedImpact}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-4 rounded-lg border bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <h4 className="font-medium">Key Insight</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            This recommendation is based on current performance patterns and industry benchmarks.
          </p>
        </div>
        
        <div className="p-4 rounded-lg border bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium">Implementation</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Expected implementation time: 1-2 weeks with measurable results within 30 days.
          </p>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Generated at {feedback.timestamp.toLocaleString()}
        </p>
      </div>
    </motion.div>
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
      {/* Floating Action Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={cn("fixed bottom-6 right-6 z-50", className)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleOpen}
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 border-0"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Brain className="h-6 w-6" />
                </motion.div>
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Get AI Feedback</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Feedback Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              AI Feedback & Recommendations
            </DialogTitle>
            <DialogDescription>
              Get personalized insights and actionable recommendations based on your dashboard data
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/10 rounded-full mx-auto w-fit">
                      <X className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-destructive">Failed to Generate Feedback</h3>
                      <p className="text-sm text-muted-foreground mt-1">{error}</p>
                    </div>
                    <Button onClick={handleGetFeedback} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="space-y-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="p-4 bg-primary/10 rounded-full mx-auto w-fit"
                    >
                      <Brain className="h-8 w-8 text-primary" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">Analyzing Your Data</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI is generating personalized recommendations...
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>This may take a few seconds</span>
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
                  <FeedbackContent feedback={feedback} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="space-y-4">
                    <Brain className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                    <div>
                      <h3 className="text-lg font-semibold">Ready to Generate Feedback</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Click below to get AI-powered recommendations for your dashboard
                      </p>
                    </div>
                    <Button onClick={handleGetFeedback}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Feedback
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            {feedback && (
              <Button onClick={handleGetFeedback} disabled={isLoading}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New Feedback
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIFeedbackButton;
