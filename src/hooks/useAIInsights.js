import { useState, useEffect, useCallback } from 'react';
import { generateAIInsights } from '../services/aiService';
import { AI_CONFIG } from '../types/ai';

export const useAIInsights = (data, autoRefresh = false) => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchInsights = useCallback(async () => {
    if (!data) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newInsights = await generateAIInsights(data);
      setInsights(newInsights);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to generate insights');
      console.error('Error fetching AI insights:', err);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const refreshInsights = useCallback(() => {
    fetchInsights();
  }, [fetchInsights]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && data) {
      fetchInsights();
      
      const interval = setInterval(() => {
        fetchInsights();
      }, AI_CONFIG.INSIGHT_REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, data, fetchInsights]);

  // Initial fetch when data changes
  useEffect(() => {
    if (data && !autoRefresh) {
      fetchInsights();
    }
  }, [data, autoRefresh, fetchInsights]);

  return {
    insights,
    isLoading,
    error,
    lastUpdated,
    refreshInsights,
    hasInsights: insights.length > 0
  };
};
