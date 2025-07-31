import { useState, useCallback } from 'react';
import { processNaturalLanguageQuery } from '../services/aiService';
import { AI_CONFIG } from '../types/ai';

export const useNaturalLanguageQuery = (data) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const processQuery = useCallback(async (query) => {
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResponse(null);

    try {
      const result = await processNaturalLanguageQuery(query, data);
      
      setResponse(result);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        query: query.trim(),
        response: result,
        timestamp: new Date()
      };
      
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 queries
      
    } catch (err) {
      setError(err.message || 'Failed to process your question');
      console.error('Error processing natural language query:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [data]);

  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setQueryHistory([]);
  }, []);

  return {
    processQuery,
    isProcessing,
    response,
    error,
    queryHistory,
    clearResponse,
    clearHistory,
    hasResponse: !!response,
    hasHistory: queryHistory.length > 0
  };
};
