// AI-related type definitions and constants

export const AI_INSIGHT_CATEGORIES = {
  PERFORMANCE: 'performance',
  USER_BEHAVIOR: 'user-behavior', 
  REVENUE: 'revenue',
  OPTIMIZATION: 'optimization'
};

export const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const FEEDBACK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Default AI configuration
export const AI_CONFIG = {
  INSIGHT_REFRESH_INTERVAL: 300000, // 5 minutes
  ALERT_CHECK_INTERVAL: 60000, // 1 minute
  QUERY_TIMEOUT: 10000, // 10 seconds
  MAX_INSIGHTS_DISPLAY: 5,
  MAX_ALERTS_DISPLAY: 3,
  MIN_CONFIDENCE_THRESHOLD: 70
};

// Mock API endpoints
export const AI_ENDPOINTS = {
  INSIGHTS: '/api/ai/insights',
  QUERY: '/api/ai/query',
  ALERTS: '/api/ai/alerts',
  FEEDBACK: '/api/ai/feedback',
  SUMMARY: '/api/ai/summary'
};
