import { useState, useEffect, useCallback } from 'react';
import { generateAIAlerts } from '../services/aiService';
import { AI_CONFIG } from '../types/ai';

export const useAIAlerts = (data, autoRefresh = true) => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = useCallback(async () => {
    if (!data) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newAlerts = await generateAIAlerts(data);
      setAlerts(prev => {
        // Merge new alerts with existing ones, avoiding duplicates
        const existingIds = prev.map(alert => alert.id);
        const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.includes(alert.id));
        return [...uniqueNewAlerts, ...prev].slice(0, AI_CONFIG.MAX_ALERTS_DISPLAY * 2);
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch alerts');
      console.error('Error fetching AI alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const dismissAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  }, []);

  const clearDismissedAlerts = useCallback(() => {
    setAlerts(prev => prev.filter(alert => !alert.dismissed));
  }, []);

  const refreshAlerts = useCallback(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && data) {
      fetchAlerts();
      
      const interval = setInterval(() => {
        fetchAlerts();
      }, AI_CONFIG.ALERT_CHECK_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, data, fetchAlerts]);

  // Initial fetch when data changes
  useEffect(() => {
    if (data && !autoRefresh) {
      fetchAlerts();
    }
  }, [data, autoRefresh, fetchAlerts]);

  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const highPriorityAlerts = activeAlerts.filter(alert => alert.severity === 'high' || alert.severity === 'critical');

  return {
    alerts: activeAlerts,
    allAlerts: alerts,
    highPriorityAlerts,
    isLoading,
    error,
    lastUpdated,
    dismissAlert,
    clearDismissedAlerts,
    refreshAlerts,
    hasAlerts: activeAlerts.length > 0,
    hasHighPriorityAlerts: highPriorityAlerts.length > 0,
    alertCount: activeAlerts.length
  };
};
