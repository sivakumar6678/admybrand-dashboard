// Mock AI Service for simulating AI-powered features
import { format, subDays, isAfter } from 'date-fns';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock insights data
const insightTemplates = [
  "User engagement increased {percentage}% this week due to better onboarding flow.",
  "Revenue growth is {trend} with a {percentage}% change compared to last month.",
  "Your top-performing channel {channel} shows {percentage}% higher conversion rates.",
  "Team productivity metrics indicate {percentage}% improvement in efficiency.",
  "Customer satisfaction scores have {trend} by {percentage}% this quarter.",
  "Mobile traffic increased {percentage}% while desktop usage remained stable.",
  "Peak usage hours shifted to {timeframe}, suggesting changing user behavior patterns.",
  "Conversion funnel optimization could potentially increase revenue by {percentage}%."
];

const alertTemplates = [
  {
    type: "warning",
    icon: "⚠️",
    title: "Sudden drop in focus levels",
    message: "Focus levels among developers dropped {percentage}% on {day}.",
    severity: "medium"
  },
  {
    type: "info", 
    icon: "📈",
    title: "Traffic spike detected",
    message: "Website traffic increased {percentage}% in the last {timeframe}.",
    severity: "low"
  },
  {
    type: "success",
    icon: "✅",
    title: "Conversion rate improvement",
    message: "Conversion rates improved {percentage}% after recent optimizations.",
    severity: "low"
  },
  {
    type: "warning",
    icon: "🔄",
    title: "High bounce rate detected",
    message: "Bounce rate increased to {percentage}% on {channel} channel.",
    severity: "high"
  },
  {
    type: "info",
    icon: "👥",
    title: "User behavior change",
    message: "Users are spending {percentage}% more time on {feature} feature.",
    severity: "low"
  }
];

const feedbackTemplates = [
  "Consider reducing meeting hours on {day} to improve productivity by an estimated {percentage}%.",
  "Your {channel} channel shows strong performance. Consider allocating {percentage}% more budget here.",
  "User engagement patterns suggest implementing {feature} could boost retention by {percentage}%.",
  "Based on current trends, focusing on {area} could yield {percentage}% improvement in {metric}.",
  "The data indicates {insight}. I recommend {action} to optimize performance.",
  "Your conversion funnel has a {percentage}% drop-off at {stage}. Consider A/B testing improvements.",
  "Peak performance hours are {timeframe}. Scheduling important updates during this window could improve success rates by {percentage}%."
];

// Generate random insights
export const generateAIInsights = async (data) => {
  await delay(1500 + Math.random() * 1000); // 1.5-2.5s delay
  
  const insights = [];
  const numInsights = Math.floor(Math.random() * 3) + 2; // 2-4 insights
  
  for (let i = 0; i < numInsights; i++) {
    const template = insightTemplates[Math.floor(Math.random() * insightTemplates.length)];
    const percentage = Math.floor(Math.random() * 30) + 5; // 5-35%
    const trend = Math.random() > 0.5 ? 'increasing' : 'stable';
    const channel = data?.channelData?.[0]?.channel || 'Organic Search';
    const timeframe = ['morning hours', 'afternoon', 'evening', 'weekends'][Math.floor(Math.random() * 4)];
    
    const insight = template
      .replace('{percentage}', percentage)
      .replace('{trend}', trend)
      .replace('{channel}', channel)
      .replace('{timeframe}', timeframe);
    
    insights.push({
      id: `insight-${i}`,
      text: insight,
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
      category: ['performance', 'user-behavior', 'revenue', 'optimization'][Math.floor(Math.random() * 4)],
      timestamp: new Date()
    });
  }
  
  return insights;
};

// Natural language query processing
export const processNaturalLanguageQuery = async (query, data) => {
  await delay(800 + Math.random() * 700); // 0.8-1.5s delay
  
  const queryLower = query.toLowerCase();
  
  // Simple keyword matching for demo purposes
  if (queryLower.includes('revenue') || queryLower.includes('money') || queryLower.includes('sales')) {
    const revenue = data?.metrics?.find(m => m.label === 'Revenue')?.value || 124500;
    const growth = data?.metrics?.find(m => m.label === 'Growth %')?.value || 12.3;
    return {
      response: `Current revenue is $${revenue.toLocaleString()} with a growth rate of ${growth}%. Revenue has been ${growth > 10 ? 'performing excellently' : 'showing steady growth'} this quarter.`,
      confidence: 95,
      sources: ['revenue_metrics', 'growth_data']
    };
  }
  
  if (queryLower.includes('user') || queryLower.includes('customer') || queryLower.includes('engagement')) {
    const users = data?.metrics?.find(m => m.label === 'Users')?.value || 3200;
    const conversion = data?.metrics?.find(m => m.label === 'Conversion Rate')?.value || 8.7;
    return {
      response: `You have ${users.toLocaleString()} active users with a ${conversion}% conversion rate. User engagement is ${conversion > 8 ? 'above average' : 'within normal range'} for your industry.`,
      confidence: 92,
      sources: ['user_metrics', 'engagement_data']
    };
  }
  
  if (queryLower.includes('performance') || queryLower.includes('metric') || queryLower.includes('kpi')) {
    return {
      response: `Overall performance metrics show positive trends across key areas. Revenue growth is at ${Math.floor(Math.random() * 10) + 10}%, user acquisition is steady, and conversion rates are optimizing well.`,
      confidence: 88,
      sources: ['performance_dashboard', 'kpi_analysis']
    };
  }
  
  if (queryLower.includes('team') || queryLower.includes('productivity') || queryLower.includes('work')) {
    return {
      response: `Team productivity metrics indicate ${Math.floor(Math.random() * 15) + 10}% improvement this month. Focus levels are optimal during morning hours, with collaboration scores trending upward.`,
      confidence: 85,
      sources: ['team_analytics', 'productivity_metrics']
    };
  }
  
  // Default response for unmatched queries
  return {
    response: `Based on your current data, I can see positive trends in most key metrics. Your dashboard shows healthy growth patterns and user engagement. Would you like me to analyze any specific area in more detail?`,
    confidence: 75,
    sources: ['general_analytics']
  };
};

// Generate AI alerts
export const generateAIAlerts = async (data) => {
  await delay(500 + Math.random() * 500); // 0.5-1s delay
  
  const alerts = [];
  const numAlerts = Math.floor(Math.random() * 3) + 1; // 1-3 alerts
  
  for (let i = 0; i < numAlerts; i++) {
    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const percentage = Math.floor(Math.random() * 25) + 5; // 5-30%
    const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)];
    const timeframe = ['hour', '2 hours', '24 hours'][Math.floor(Math.random() * 3)];
    const channel = data?.channelData?.[Math.floor(Math.random() * (data?.channelData?.length || 1))]?.channel || 'Social Media';
    const feature = ['dashboard', 'analytics', 'reports', 'user profile'][Math.floor(Math.random() * 4)];
    
    const alert = {
      id: `alert-${i}`,
      type: template.type,
      icon: template.icon,
      title: template.title,
      message: template.message
        .replace('{percentage}', percentage)
        .replace('{day}', day)
        .replace('{timeframe}', timeframe)
        .replace('{channel}', channel)
        .replace('{feature}', feature),
      severity: template.severity,
      timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24h
      dismissed: false
    };
    
    alerts.push(alert);
  }
  
  return alerts;
};

// Generate AI feedback
export const generateAIFeedback = async (data) => {
  await delay(1200 + Math.random() * 800); // 1.2-2s delay
  
  const template = feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
  const percentage = Math.floor(Math.random() * 20) + 10; // 10-30%
  const day = ['Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 3)];
  const channel = data?.channelData?.[0]?.channel || 'Organic Search';
  const feature = ['user onboarding', 'checkout process', 'mobile experience'][Math.floor(Math.random() * 3)];
  const area = ['user experience', 'conversion optimization', 'performance monitoring'][Math.floor(Math.random() * 3)];
  const metric = ['conversion rate', 'user engagement', 'revenue growth'][Math.floor(Math.random() * 3)];
  const insight = 'strong user engagement patterns with room for optimization';
  const action = 'implementing targeted A/B tests and user feedback collection';
  const stage = ['product selection', 'checkout', 'registration'][Math.floor(Math.random() * 3)];
  const timeframe = ['9-11 AM', '2-4 PM', '7-9 PM'][Math.floor(Math.random() * 3)];
  
  const feedback = template
    .replace('{percentage}', percentage)
    .replace('{day}', day)
    .replace('{channel}', channel)
    .replace('{feature}', feature)
    .replace('{area}', area)
    .replace('{metric}', metric)
    .replace('{insight}', insight)
    .replace('{action}', action)
    .replace('{stage}', stage)
    .replace('{timeframe}', timeframe);
  
  return {
    feedback,
    confidence: Math.floor(Math.random() * 15) + 85, // 85-100%
    category: 'optimization',
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
    estimatedImpact: `${percentage}% improvement potential`,
    timestamp: new Date()
  };
};

// Generate smart summary
export const generateSmartSummary = async (data) => {
  await delay(1000 + Math.random() * 500); // 1-1.5s delay
  
  const revenue = data?.metrics?.find(m => m.label === 'Revenue')?.value || 124500;
  const growth = data?.metrics?.find(m => m.label === 'Growth %')?.value || 12.3;
  const users = data?.metrics?.find(m => m.label === 'Users')?.value || 3200;
  const conversion = data?.metrics?.find(m => m.label === 'Conversion Rate')?.value || 8.7;
  
  const summaries = [
    `You're on track! Revenue rose ${Math.floor(Math.random() * 10) + 5}% while maintaining steady user growth.`,
    `Strong performance this quarter with ${growth}% growth and ${conversion}% conversion rate.`,
    `Excellent momentum: ${users.toLocaleString()} active users generating $${revenue.toLocaleString()} revenue.`,
    `Dashboard shows positive trends across all key metrics with ${Math.floor(Math.random() * 15) + 10}% overall improvement.`,
    `Your analytics indicate healthy business growth with optimization opportunities in user engagement.`
  ];
  
  return {
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    keyMetrics: {
      revenue: { value: revenue, trend: growth > 10 ? 'up' : 'stable' },
      users: { value: users, trend: 'up' },
      conversion: { value: conversion, trend: conversion > 8 ? 'up' : 'stable' }
    },
    recommendations: Math.floor(Math.random() * 3) + 2, // 2-4 recommendations available
    lastUpdated: new Date()
  };
};
