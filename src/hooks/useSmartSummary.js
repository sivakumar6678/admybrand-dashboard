import { useState, useEffect, useCallback } from 'react';
import { generateSmartSummary } from '../services/aiService';

export const useSmartSummary = (data, autoRefresh = false) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!data) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newSummary = await generateSmartSummary(data);
      setSummary(newSummary);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
      console.error('Error fetching smart summary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const refreshSummary = useCallback(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && data) {
      fetchSummary();
      
      const interval = setInterval(() => {
        fetchSummary();
      }, 600000); // Refresh every 10 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh, data, fetchSummary]);

  // Initial fetch when data changes
  useEffect(() => {
    if (data) {
      fetchSummary();
    }
  }, [data, fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    lastUpdated,
    refreshSummary,
    hasSummary: !!summary
  };
};
