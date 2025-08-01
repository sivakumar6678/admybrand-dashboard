import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
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
  WifiOff
} from 'lucide-react';

import mockData from './mock/metrics.json';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';
import { generateFilteredMockData, getDefaultDateRange } from './utils/dateFilter';
import './index.css';

// Removed ResponsiveGridLayout - using CSS Grid instead

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  BarChart2
};

// Legacy layout configurations removed - using CSS Grid instead

// Theme-aware App Content Component
function AppContent() {
  const { theme, darkMode } = useContext(ThemeContext);
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const [data, setData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  // Removed layouts state - using CSS Grid instead

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

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Removed layout functions - using CSS Grid instead

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="min-h-screen bg-background text-foreground antialiased relative overflow-hidden"
        >
          {/* Enhanced Animated Background Orbs with Theme Awareness */}
          <div className="fixed inset-0 pointer-events-none">
            <motion.div
              className="bg-orb bg-orb-1"
              animate={{
                scale: darkMode ? [1, 1.1, 1] : [1, 1.2, 1],
                opacity: darkMode ? [0.2, 0.3, 0.2] : [0.3, 0.4, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="bg-orb bg-orb-2"
              animate={{
                scale: darkMode ? [1, 1.2, 1] : [1, 1.1, 1],
                opacity: darkMode ? [0.15, 0.25, 0.15] : [0.25, 0.35, 0.25]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              className="bg-orb bg-orb-3"
              animate={{
                scale: darkMode ? [1, 1.15, 1] : [1, 1.25, 1],
                opacity: darkMode ? [0.1, 0.2, 0.1] : [0.2, 0.3, 0.2]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
              className="bg-orb bg-orb-4"
              animate={{
                scale: darkMode ? [1, 1.1, 1] : [1, 1.2, 1],
                opacity: darkMode ? [0.05, 0.1, 0.05] : [0.1, 0.15, 0.1]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
          </div>

          {/* Theme-aware gradient overlay */}
          <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${
            darkMode
              ? 'bg-gradient-to-br from-slate-900/20 via-transparent to-slate-800/20'
              : 'bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30'
          }`} />
        
          {/* Enhanced Header with Theme Awareness */}
          <motion.header
            className="relative border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 bg-background/95 shadow-md transition-all duration-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    ADmyBRAND Analytics
                  </h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    AI-powered insights for Indian businesses
                  </p>
                </div>
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
                
                {/* Enhanced AI Insights Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => setIsInsightsModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-300/60 hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-400/80 transition-all duration-300"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Brain className="h-4 w-4" />
                    </motion.div>
                    🧠 Generate Insights
                  </Button>
                </motion.div>
                
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


                
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </motion.header>

          {/* Enhanced Main Content with Theme-Aware Layout */}
          <motion.main
            className="relative container mx-auto px-4 py-8 space-y-8 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
          {/* Smart Summary Panel - Full Width */}
          <section className="w-full">
            <SmartSummaryPanel data={mergedData} />
          </section>

            {/* Enhanced Metrics Cards with Staggered Animation */}
            <motion.section
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {mergedData.metrics.map((metric, index) => {
                const IconComponent = iconMap[metric.icon];
                return (
                  <motion.div
                    key={`metric-${index}`}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4 + index * 0.1,
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                  >
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
                </motion.div>
              );
            })}
          </motion.section>

          {/* AI Alert System - Full Width */}
          <section className="w-full">
            <AIAlertSystem data={mergedData} />
          </section>

            {/* Enhanced Charts Section with Improved Animations */}
            <motion.section
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
              <RevenueLineChart
                data={mergedData.revenueData}
                loading={loading}
              />
            </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
              <ChannelBarChart
                data={mergedData.channelData}
                loading={loading}
              />
            </motion.div>
          </motion.section>

          {/* AI Components Section - 3 Column Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AIInsightCard data={mergedData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <NaturalLanguageQuery data={mergedData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <UserRoleDonutChart
                data={mergedData.userRoles}
                loading={loading}
              />
            </motion.div>
          </section>

          {/* Data Table - Full Width */}
          <section className="w-full">
            <DataTable
              data={mergedData.tableData}
              loading={loading}
            />
          </section>

        </motion.main>

          {/* AI Smart Insights Modal */}
          <SmartInsightsModal
            isOpen={isInsightsModalOpen}
            onClose={() => setIsInsightsModalOpen(false)}
            data={mergedData}
          />

          {/* AI Feedback Floating Button */}
          <AIFeedbackButton data={mergedData} />



          {/* Toast Notifications with Theme Awareness */}
          <Toaster />
        </motion.div>
      </AnimatePresence>
    </TooltipProvider>
  );
}

// Main App Component with Theme Provider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;