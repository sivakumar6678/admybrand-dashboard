import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";

export default function MetricCard({ title, value, icon, growth, unit = "" }) {
  const formatValue = (val) => {
    if (unit === "$") {
      return `$${val.toLocaleString()}`;
    }
    if (unit === "%") {
      return `${val}%`;
    }
    return val.toLocaleString();
  };

  const getGradientClass = (title) => {
    switch (title.toLowerCase()) {
      case 'revenue': return 'gradient-primary';
      case 'users': return 'gradient-success';
      case 'conversion rate': return 'gradient-secondary';
      case 'growth %': return 'gradient-warning';
      default: return 'gradient-primary';
    }
  };

  const gradientClass = getGradientClass(title);

  return (
    <Card className="group relative overflow-hidden hover:shadow-heavy transition-all duration-500 transform hover:scale-105 card-3d border-0">
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${gradientClass} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles effect */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
      </div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={`p-3 rounded-xl ${gradientClass} shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:rotate-12`}>
          <div className="text-white">{icon}</div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-3xl font-black bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
          {formatValue(value)}
        </div>
        
        {growth !== undefined && (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium">
              {growth >= 0 ? (
                <div className="flex items-center text-emerald-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>+{Math.abs(growth)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <TrendingDown className="mr-1 h-4 w-4" />
                  <span>-{Math.abs(growth)}%</span>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="flex-1 ml-3">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${gradientClass} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(Math.abs(growth) * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Subtle pattern overlay */}
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots)" />
          </svg>
        </div>
      </CardContent>
      
      {/* Glow effect border */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
}
