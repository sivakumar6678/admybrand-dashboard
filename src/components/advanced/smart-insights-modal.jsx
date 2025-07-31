import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

// Call the live Gemini API
const generateInsights = async (data) => {
  try {
    const response = await fetch('/api/generate-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate insights');
    }

    const result = await response.json();
    return result.insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
};

// Fallback insights for when API is unavailable
const generateFallbackInsights = (data) => {
  if (!data) return '';

  const metrics = data.metrics || [];
  const revenueData = data.revenueData || [];
  const channelData = data.channelData || [];
  const userRoles = data.userRoles || [];

  // Calculate some insights
  const revenueMetric = metrics.find(m => m.label === 'Revenue');
  const usersMetric = metrics.find(m => m.label === 'Users');
  const conversionMetric = metrics.find(m => m.label === 'Conversion Rate');
  const growthMetric = metrics.find(m => m.label === 'Growth %');

  const totalRevenue = revenueMetric?.value || 0;
  const totalUsers = usersMetric?.value || 0;
  const conversionRate = conversionMetric?.value || 0;
  const growthRate = growthMetric?.value || 0;

  // Find best performing channel
  const bestChannel = channelData.reduce((best, current) => 
    current.conversions > (best?.conversions || 0) ? current : best, null
  );

  // Calculate revenue trend
  const recentRevenue = revenueData.slice(-3);
  const isRevenueIncreasing = recentRevenue.length >= 2 && 
    recentRevenue[recentRevenue.length - 1].revenue > recentRevenue[0].revenue;

  return `
    <div class="space-y-6">
      <div class="flex items-center gap-2 mb-4">
        <div class="p-2 bg-primary/10 rounded-full">
          <Brain class="h-5 w-5 text-primary" />
        </div>
        <h3 class="text-lg font-semibold">AI-Generated Insights (Offline Mode)</h3>
      </div>

      <div class="space-y-4">
        <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 class="flex items-center gap-2 text-green-800 dark:text-green-200 font-semibold mb-2">
            📈 Revenue Analysis
          </h3>
          <p class="text-green-700 dark:text-green-300 text-sm leading-relaxed">
            Your revenue is currently at <strong>₹${totalRevenue.toLocaleString()}</strong> with a growth rate of <strong>${growthRate}%</strong>. 
            ${isRevenueIncreasing 
              ? 'The trend shows consistent upward momentum over the last quarter, indicating strong business performance.' 
              : 'Consider analyzing recent market changes and optimizing your sales funnel to boost revenue growth.'
            }
          </p>
        </div>

        <div class="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 class="flex items-center gap-2 text-blue-800 dark:text-blue-200 font-semibold mb-2">
            👥 User Engagement
          </h3>
          <p class="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
            With <strong>${totalUsers.toLocaleString()} active users</strong> and a conversion rate of <strong>${conversionRate}%</strong>, 
            your platform shows ${conversionRate > 8 ? 'excellent' : conversionRate > 5 ? 'good' : 'moderate'} user engagement. 
            ${bestChannel ? `<strong>${bestChannel.channel}</strong> is your top-performing acquisition channel with ${bestChannel.conversions} conversions.` : ''}
          </p>
        </div>

        <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 class="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold mb-2">
            ⚠️ API Notice
          </h3>
          <p class="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
            AI insights are currently running in offline mode. For live AI-powered analysis, please configure the GEMINI_API_KEY environment variable.
          </p>
        </div>
      </div>
    </div>
  `;
};

export const SmartInsightsModal = ({ isOpen, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState('');
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const generateInsightsWithFallback = async (data) => {
    try {
      setError(null);
      setIsUsingFallback(false);
      
      // Try to use live API first
      const liveInsights = await generateInsights(data);
      return liveInsights;
    } catch (error) {
      console.warn('Live API failed, using fallback:', error.message);
      setIsUsingFallback(true);
      
      // Show specific error message for rate limits
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        toast.warning('AI service rate limit reached. Using offline insights.', { 
          duration: 4000 
        });
      } else if (error.message.includes('API key') || error.message.includes('configuration')) {
        toast.info('AI service not configured. Using offline insights.', { 
          duration: 4000 
        });
      } else {
        toast.info('AI service unavailable. Using offline insights.', { 
          duration: 4000 
        });
      }
      
      // Use fallback insights
      const fallbackInsights = generateFallbackInsights(data);
      return fallbackInsights;
    }
  };

  useEffect(() => {
    if (isOpen && data) {
      setIsLoading(true);
      setInsights('');
      setError(null);
      
      generateInsightsWithFallback(data)
        .then((generatedInsights) => {
          setInsights(generatedInsights);
          setIsLoading(false);
          
          // Show success toast
          if (isUsingFallback) {
            toast.info('AI insights generated (offline mode)');
          } else {
            toast.success('AI insights generated successfully!');
          }
        })
        .catch((err) => {
          console.error('Failed to generate insights:', err);
          setError(err.message);
          setIsLoading(false);
          toast.error('Failed to generate insights');
        });
    }
  }, [isOpen, data]);

  const handleClose = () => {
    setIsLoading(true);
    setInsights('');
    setError(null);
    onClose();
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newInsights = await generateInsightsWithFallback(data);
      setInsights(newInsights);
      setIsLoading(false);
      
      if (isUsingFallback) {
        toast.info('AI insights regenerated (offline mode)');
      } else {
        toast.success('AI insights regenerated successfully!');
      }
    } catch (err) {
      console.error('Failed to regenerate insights:', err);
      setError(err.message);
      setIsLoading(false);
      toast.error('Failed to regenerate insights');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto modal-content">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-primary/10 rounded-full">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            AI Smart Insights
            {isUsingFallback && (
              <Badge variant="secondary" className="text-xs">
                Offline Mode
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isUsingFallback 
              ? "AI-powered analysis using fallback mode (configure GEMINI_API_KEY for live AI)"
              : "Live AI-powered analysis of your dashboard data with actionable recommendations"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="p-4 bg-primary/10 rounded-full"
                  >
                    <Brain className="h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </motion.div>
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">🧠 Thinking...</h3>
                  <p className="text-muted-foreground">
                    AI is analyzing your dashboard metrics and generating actionable insights...
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>This may take a few moments</span>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-4"
              >
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Failed to Generate Insights
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    {error}
                  </p>
                </div>
                <Button onClick={handleRegenerate} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: insights }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isUsingFallback ? (
              <>
                <AlertCircle className="h-3 w-3" />
                <span>Running in offline mode</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>Powered by Google Gemini AI</span>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            {!isLoading && !error && (
              <Button 
                onClick={handleRegenerate}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};