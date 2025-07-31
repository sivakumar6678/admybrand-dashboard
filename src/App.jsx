import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toast';
import { TooltipProvider } from './components/ui/tooltip';
import { Button } from './components/ui/button';
import { DarkModeToggle } from './components/DarkModeToggle';
import { AdvancedDateRangePicker } from './components/advanced/date-range-picker';
import { SmartInsightsModal } from './components/advanced/smart-insights-modal';

// Import dashboard components
import MetricCard from './components/MetricCard';
import RevenueLineChart from './components/LineChart';
import ChannelBarChart from './components/BarChart';
import UserRoleDonutChart from './components/DonutChart';
import DataTable from './components/DataTable';

// Import new AI components
import SmartSummaryPanel from './components/SmartSummaryPanel';
import AIInsightCard from './components/AIInsightCard';
import NaturalLanguageQuery from './components/NaturalLanguageQuery';
import AIAlertSystem from './components/AIAlertSystem';
import AIFeedbackButton from './components/AIFeedbackButton';

import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart2,
  RefreshCw,
  Brain,
  Wifi,
  WifiOff,
  GripVertical
} from 'lucide-react';

import mockData from './mock/metrics.json';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { generateFilteredMockData, getDefaultDateRange } from './utils/dateFilter';
import './index.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  BarChart2
};

// Responsive layout configurations
const getDefaultLayouts = () => ({
  lg: [
    // Smart Summary Panel at the top
    { i: 'smart-summary', x: 0, y: 0, w: 12, h: 3, minW: 8, minH: 2 },

    // Metric Cards
    { i: 'metric-0', x: 0, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-1', x: 3, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-2', x: 6, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-3', x: 9, y: 3, w: 3, h: 2, minW: 2, minH: 2 },

    // AI Alert System
    { i: 'ai-alerts', x: 0, y: 5, w: 12, h: 2, minW: 8, minH: 1 },

    // Charts
    { i: 'revenue-chart', x: 0, y: 7, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'channel-chart', x: 6, y: 7, w: 6, h: 4, minW: 4, minH: 3 },

    // AI Components
    { i: 'ai-insights', x: 0, y: 11, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'natural-language', x: 4, y: 11, w: 4, h: 6, minW: 3, minH: 4 },
    { i: 'donut-chart', x: 8, y: 11, w: 4, h: 4, minW: 3, minH: 3 },

    // Data Table
    { i: 'data-table', x: 0, y: 17, w: 12, h: 4, minW: 8, minH: 3 }
  ],
  md: [
    // Smart Summary Panel
    { i: 'smart-summary', x: 0, y: 0, w: 10, h: 3, minW: 6, minH: 2 },

    // Metric Cards - 2x2 layout
    { i: 'metric-0', x: 0, y: 3, w: 5, h: 2, minW: 2, minH: 2 },
    { i: 'metric-1', x: 5, y: 3, w: 5, h: 2, minW: 2, minH: 2 },
    { i: 'metric-2', x: 0, y: 5, w: 5, h: 2, minW: 2, minH: 2 },
    { i: 'metric-3', x: 5, y: 5, w: 5, h: 2, minW: 2, minH: 2 },

    // AI Alert System
    { i: 'ai-alerts', x: 0, y: 7, w: 10, h: 2, minW: 6, minH: 1 },

    // Charts - stacked
    { i: 'revenue-chart', x: 0, y: 9, w: 10, h: 4, minW: 6, minH: 3 },
    { i: 'channel-chart', x: 0, y: 13, w: 10, h: 4, minW: 6, minH: 3 },

    // AI Components - 2 column layout
    { i: 'ai-insights', x: 0, y: 17, w: 5, h: 6, minW: 3, minH: 4 },
    { i: 'natural-language', x: 5, y: 17, w: 5, h: 6, minW: 3, minH: 4 },
    { i: 'donut-chart', x: 0, y: 23, w: 10, h: 4, minW: 6, minH: 3 },

    // Data Table
    { i: 'data-table', x: 0, y: 27, w: 10, h: 4, minW: 6, minH: 3 }
  ],
  sm: [
    // Smart Summary Panel
    { i: 'smart-summary', x: 0, y: 0, w: 6, h: 3, minW: 4, minH: 2 },

    // Metric Cards - 2 column layout
    { i: 'metric-0', x: 0, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-1', x: 3, y: 3, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-2', x: 0, y: 5, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-3', x: 3, y: 5, w: 3, h: 2, minW: 2, minH: 2 },

    // AI Alert System
    { i: 'ai-alerts', x: 0, y: 7, w: 6, h: 2, minW: 4, minH: 1 },

    // Charts - full width stacked
    { i: 'revenue-chart', x: 0, y: 9, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'channel-chart', x: 0, y: 13, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'donut-chart', x: 0, y: 17, w: 6, h: 4, minW: 4, minH: 3 },

    // AI Components - full width stacked
    { i: 'ai-insights', x: 0, y: 21, w: 6, h: 6, minW: 4, minH: 4 },
    { i: 'natural-language', x: 0, y: 27, w: 6, h: 6, minW: 4, minH: 4 },

    // Data Table
    { i: 'data-table', x: 0, y: 33, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  xs: [
    // All components stacked vertically
    { i: 'smart-summary', x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
    { i: 'metric-0', x: 0, y: 3, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'metric-1', x: 0, y: 5, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'metric-2', x: 0, y: 7, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'metric-3', x: 0, y: 9, w: 4, h: 2, minW: 2, minH: 2 },
    { i: 'ai-alerts', x: 0, y: 11, w: 4, h: 2, minW: 2, minH: 1 },
    { i: 'revenue-chart', x: 0, y: 13, w: 4, h: 4, minW: 2, minH: 3 },
    { i: 'channel-chart', x: 0, y: 17, w: 4, h: 4, minW: 2, minH: 3 },
    { i: 'donut-chart', x: 0, y: 21, w: 4, h: 4, minW: 2, minH: 3 },
    { i: 'ai-insights', x: 0, y: 25, w: 4, h: 6, minW: 2, minH: 4 },
    { i: 'natural-language', x: 0, y: 31, w: 4, h: 6, minW: 2, minH: 4 },
    { i: 'data-table', x: 0, y: 37, w: 4, h: 4, minW: 2, minH: 3 }
  ],
  xxs: [
    // Ultra-compact mobile layout
    { i: 'smart-summary', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'metric-0', x: 0, y: 4, w: 2, h: 3, minW: 2, minH: 2 },
    { i: 'metric-1', x: 0, y: 7, w: 2, h: 3, minW: 2, minH: 2 },
    { i: 'metric-2', x: 0, y: 10, w: 2, h: 3, minW: 2, minH: 2 },
    { i: 'metric-3', x: 0, y: 13, w: 2, h: 3, minW: 2, minH: 2 },
    { i: 'ai-alerts', x: 0, y: 16, w: 2, h: 3, minW: 2, minH: 2 },
    { i: 'revenue-chart', x: 0, y: 19, w: 2, h: 5, minW: 2, minH: 4 },
    { i: 'channel-chart', x: 0, y: 24, w: 2, h: 5, minW: 2, minH: 4 },
    { i: 'donut-chart', x: 0, y: 29, w: 2, h: 5, minW: 2, minH: 4 },
    { i: 'ai-insights', x: 0, y: 34, w: 2, h: 7, minW: 2, minH: 5 },
    { i: 'natural-language', x: 0, y: 41, w: 2, h: 7, minW: 2, minH: 5 },
    { i: 'data-table', x: 0, y: 48, w: 2, h: 5, minW: 2, minH: 4 }
  ]
});

function App() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [data, setData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [layouts, setLayouts] = useState(() => {
    const savedLayouts = localStorage.getItem('dashboard-layouts');
    return savedLayouts ? JSON.parse(savedLayouts) : getDefaultLayouts();
  });

  // Use real-time updates hook
  const { 
    data: realtimeData, 
    isUpdating, 
    lastUpdated: realtimeLastUpdated, 
    manualUpdate 
  } = useRealTimeUpdates(mockData);

  // Filter data when date range changes
  useEffect(() => {
    const filtered = generateFilteredMockData(data, dateRange);
    setFilteredData(filtered);
  }, [data, dateRange]);

  // Merge real-time data with filtered data
  const mergedData = {
    ...filteredData,
    metrics: realtimeData.metrics || filteredData.metrics
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Trigger manual update and refresh data
    manualUpdate();
    setData(prevData => ({
      ...prevData,
      metrics: prevData.metrics.map(metric => ({
        ...metric,
        value: metric.label === "Revenue" 
          ? Math.floor(Math.random() * 50000) + 100000
          : metric.label === "Users"
          ? Math.floor(Math.random() * 1000) + 2500
          : Math.random() * 20 + 5,
        change: Math.random() * 10 - 5
      }))
    }));
    
    setLoading(false);
  };

  const handleLayoutChange = (_, layouts) => {
    setLayouts(layouts);
    localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const resetLayout = () => {
    const defaultLayouts = getDefaultLayouts();
    setLayouts(defaultLayouts);
    localStorage.setItem('dashboard-layouts', JSON.stringify(defaultLayouts));
  };

  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground antialiased relative">
          {/* Animated Background Orbs */}
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        
        {/* Header */}
        <motion.header 
          className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">ADmyBRAND Insights</h1>
                <p className="text-muted-foreground">
                  Advanced analytics dashboard with AI-powered insights
                </p>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap">
                {/* Date Range Picker */}
                <AdvancedDateRangePicker 
                  dateRange={dateRange}
                  onDateChange={handleDateChange}
                />

                {/* Real-time status indicator */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {isUpdating ? (
                    <WifiOff className="h-3 w-3 animate-pulse" />
                  ) : (
                    <Wifi className="h-3 w-3 text-green-500" />
                  )}
                  <span>
                    {isUpdating ? 'Updating...' : `Updated ${realtimeLastUpdated.toLocaleTimeString()}`}
                  </span>
                </div>
                
                {/* AI Insights Button */}
                <Button
                  onClick={() => setIsInsightsModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300 hover:from-purple-500/20 hover:to-blue-500/20"
                >
                  <Brain className="h-4 w-4" />
                  🧠 Generate Insights
                </Button>
                
                {/* Refresh Button */}
                <Button
                  onClick={() => {
                    handleRefresh();
                    manualUpdate();
                  }}
                  variant="outline"
                  size="sm"
                  disabled={loading || isUpdating}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${(loading || isUpdating) ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                {/* Reset Layout Button */}
                <Button
                  onClick={resetLayout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <GripVertical className="h-4 w-4" />
                  Reset Layout
                </Button>
                
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content with Grid Layout */}
        <main className="relative container mx-auto px-4 py-8">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]}
            containerPadding={[16, 16]}
            useCSSTransforms={true}
            compactType="vertical"
            preventCollision={false}
          >
            {/* Smart Summary Panel */}
            <div key="smart-summary" className="grid-item">
              <SmartSummaryPanel data={mergedData} />
            </div>

            {/* Metric Cards */}
            {mergedData.metrics.map((metric, index) => {
              const IconComponent = iconMap[metric.icon];
              return (
                <div key={`metric-${index}`} className="grid-item">
                  <MetricCard
                    title={metric.label}
                    value={metric.value}
                    previousValue={metric.value - 100}
                    icon={<IconComponent className="h-6 w-6" />}
                    growth={metric.change}
                    unit={metric.unit}
                    isLoading={loading || isUpdating}
                    trend={metric.change >= 0 ? 'positive' : 'negative'}
                    priority={metric.label === 'Revenue' ? 'high' : 'normal'}
                  />
                </div>
              );
            })}

            {/* AI Alert System */}
            <div key="ai-alerts" className="grid-item">
              <AIAlertSystem data={mergedData} />
            </div>

            {/* Revenue Chart */}
            <div key="revenue-chart" className="grid-item">
              <RevenueLineChart 
                data={mergedData.revenueData} 
                loading={loading}
              />
            </div>

            {/* Channel Chart */}
            <div key="channel-chart" className="grid-item">
              <ChannelBarChart
                data={mergedData.channelData}
                loading={loading}
              />
            </div>

            {/* AI Insights Card */}
            <div key="ai-insights" className="grid-item">
              <AIInsightCard data={mergedData} />
            </div>

            {/* Natural Language Query */}
            <div key="natural-language" className="grid-item">
              <NaturalLanguageQuery data={mergedData} />
            </div>

            {/* Donut Chart */}
            <div key="donut-chart" className="grid-item">
              <UserRoleDonutChart
                data={mergedData.userRoles}
                loading={loading}
              />
            </div>

            {/* Data Table */}
            <div key="data-table" className="grid-item">
              <DataTable
                data={mergedData.tableData}
                loading={loading}
              />
            </div>
          </ResponsiveGridLayout>
        </main>

          {/* AI Smart Insights Modal */}
          <SmartInsightsModal
            isOpen={isInsightsModalOpen}
            onClose={() => setIsInsightsModalOpen(false)}
            data={mergedData}
          />

          {/* AI Feedback Floating Button */}
          <AIFeedbackButton data={mergedData} />

          {/* Toast Notifications */}
          <Toaster />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;