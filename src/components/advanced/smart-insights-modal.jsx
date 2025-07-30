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
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';

const generateInsights = (data) => {
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
        <h3 class="text-lg font-semibold">AI-Generated Insights</h3>
      </div>

      <div class="space-y-4">
        <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <h3 class="flex items-center gap-2 text-green-800 dark:text-green-200 font-semibold mb-2">
            📈 Revenue Analysis
          </h3>
          <p class="text-green-700 dark:text-green-300 text-sm leading-relaxed">
            Your revenue is currently at <strong>$${totalRevenue.toLocaleString()}</strong> with a growth rate of <strong>${growthRate}%</strong>. 
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

        <div class="p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 class="flex items-center gap-2 text-purple-800 dark:text-purple-200 font-semibold mb-2">
            🎯 Strategic Recommendations
          </h3>
          <ul class="text-purple-700 dark:text-purple-300 text-sm space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-green-600 mt-0.5">✅</span>
              <span>Focus on scaling your <strong>${bestChannel?.channel || 'top-performing'}</strong> channel to maximize ROI</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-600 mt-0.5">⚠️</span>
              <span>Consider A/B testing your conversion funnel to improve the ${conversionRate}% conversion rate</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-blue-600 mt-0.5">📈</span>
              <span>With ${growthRate}% growth, you're ${growthRate > 10 ? 'exceeding' : 'meeting'} industry benchmarks</span>
            </li>
          </ul>
        </div>

        <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 class="flex items-center gap-2 text-amber-800 dark:text-amber-200 font-semibold mb-2">
            💡 Next Steps
          </h3>
          <p class="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
            Based on your current metrics, prioritize <strong>user retention strategies</strong> and 
            <strong>conversion optimization</strong>. The data suggests potential for 15-20% revenue increase 
            through targeted improvements in your top-performing channels.
          </p>
        </div>
      </div>
    </div>
  `;
};

export const SmartInsightsModal = ({ isOpen, onClose, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setInsights('');
      
      // Simulate AI processing time
      const timer = setTimeout(() => {
        const generatedInsights = generateInsights(data);
        setInsights(generatedInsights);
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, data]);

  const handleClose = () => {
    setIsLoading(true);
    setInsights('');
    onClose();
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
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your dashboard data with actionable recommendations
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
                  <h3 className="text-lg font-semibold">Analyzing Your Data</h3>
                  <p className="text-muted-foreground">
                    Our AI is processing your metrics and generating insights...
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>This may take a few seconds</span>
                </div>
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

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!isLoading && (
            <Button 
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  const newInsights = generateInsights(data);
                  setInsights(newInsights);
                  setIsLoading(false);
                }, 2000);
              }}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Regenerate Insights
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};