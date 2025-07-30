import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "./MetricCard";
import RevenueLineChart from "./LineChart";
import ChannelBarChart from "./BarChart";
import UserRoleDonutChart from "./DonutChart";
import DataTable from "./DataTable";
import { DarkModeToggle } from "./DarkModeToggle";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart2,
  RefreshCw,
  Activity,
  Wifi,
  WifiOff
} from "lucide-react";
import { Button } from "./ui/button";
import mockData from "../mock/metrics.json";
import { useRealTimeUpdates } from "../hooks/useRealTimeUpdates";

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  BarChart2
};

export default function Dashboard() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Use real-time updates hook
  const { 
    data: realtimeData, 
    isUpdating, 
    lastUpdated: realtimeLastUpdated, 
    manualUpdate 
  } = useRealTimeUpdates(mockData);

  // Merge real-time data with base data
  const mergedData = {
    ...data,
    metrics: realtimeData.metrics || data.metrics
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
    setLastUpdated(new Date());
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

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
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor your business metrics and performance
              </p>
            </div>
            
            <div className="flex items-center gap-3">
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
              
              <Button
                onClick={() => {
                  handleRefresh()
                  manualUpdate()
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

      <main className="relative container mx-auto px-4 py-12">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent mb-4">
            Performance Overview
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor your key metrics and business performance in real-time with advanced analytics
          </p>
        </div>

        {/* Metrics Cards */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mergedData.metrics.map((metric, index) => {
              const IconComponent = iconMap[metric.icon];
              return (
                <MetricCard
                  key={metric.label}
                  title={metric.label}
                  value={metric.value}
                  previousValue={metric.value - 100} // Simulate previous value for animation
                  icon={<IconComponent className="h-6 w-6" />}
                  growth={metric.change}
                  unit={metric.unit}
                  isLoading={loading || isUpdating}
                  trend={metric.change >= 0 ? 'positive' : 'negative'}
                  priority={metric.label === 'Revenue' ? 'high' : 'normal'}
                />
              );
            })}
          </div>
        </motion.section>

        {/* Charts Section */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueLineChart 
              data={mergedData.revenueData} 
              loading={loading}
            />
            <ChannelBarChart 
              data={mergedData.channelData} 
              loading={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <UserRoleDonutChart 
                data={mergedData.userRoles} 
                loading={loading}
              />
            </div>
          </div>
        </motion.section>

        {/* Data Table */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <DataTable 
            data={mergedData.tableData} 
            loading={loading}
          />
        </motion.section>
      </main>
    </div>
  );
}