import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import RevenueLineChart from "./LineChart";
import ChannelBarChart from "./BarChart";
import UserRoleDonutChart from "./DonutChart";
import DataTable from "./DataTable";
import DarkModeToggle from "./DarkModeToggle";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart2,
  RefreshCw,
  Activity
} from "lucide-react";
import { Button } from "./ui/button";
import mockData from "../mock/metrics.json";

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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        metrics: prevData.metrics.map(metric => ({
          ...metric,
          value: metric.label === "Revenue" 
            ? metric.value + Math.floor(Math.random() * 1000) - 500
            : metric.label === "Users"
            ? metric.value + Math.floor(Math.random() * 20) - 10
            : metric.value + (Math.random() * 2 - 1),
          change: metric.change + (Math.random() * 1 - 0.5)
        }))
      }));
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate new data
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
      <header className="relative border-b bg-card/80 backdrop-blur-xl shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 py-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
                  <Activity className="relative h-10 w-10 text-primary animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    Analytics Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Real-time business intelligence
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-muted/50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Live
                  </span>
                </div>
                <div className="text-sm text-muted-foreground font-mono">
                  {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
                className="relative overflow-hidden group hover:shadow-glow transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <RefreshCw className={`relative mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="relative">Refresh</span>
              </Button>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {data.metrics.map((metric, index) => {
            const IconComponent = iconMap[metric.icon];
            return (
              <div key={index} className="float" style={{ animationDelay: `${index * 0.2}s` }}>
                <MetricCard
                  title={metric.label}
                  value={metric.value}
                  icon={<IconComponent className="h-6 w-6" />}
                  growth={metric.change}
                  unit={metric.unit}
                />
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">Analytics Insights</h3>
            <p className="text-muted-foreground">Detailed performance metrics and trends</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-heavy transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="relative">
                  <RevenueLineChart data={data.revenueData} loading={loading} />
                </div>
              </div>
            </div>
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-heavy transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
                <div className="relative">
                  <ChannelBarChart data={data.channelData} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-heavy transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
              <div className="relative">
                <UserRoleDonutChart data={data.userRoles} loading={loading} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {/* Enhanced mini metric cards */}
              <div className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-heavy transition-all duration-500 p-8">
                <div className="absolute inset-0 gradient-success opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Avg. Session Duration
                    </h3>
                    <div className="p-2 rounded-lg gradient-success">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
                    4m 32s
                  </p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">+12% from last week</span>
                  </div>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-success rounded-full w-3/4 transition-all duration-1000" />
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg hover:shadow-heavy transition-all duration-500 p-8">
                <div className="absolute inset-0 gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Bounce Rate
                    </h3>
                    <div className="p-2 rounded-lg gradient-secondary">
                      <BarChart2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
                    34.2%
                  </p>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
                    <span className="text-red-500 font-medium">+2.1% from last week</span>
                  </div>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-secondary rounded-full w-1/3 transition-all duration-1000" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">User Analytics</h3>
            <p className="text-muted-foreground">Comprehensive user data and insights</p>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />
            <div className="relative">
              <DataTable data={data.tableData} loading={loading} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}