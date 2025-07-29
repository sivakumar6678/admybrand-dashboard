import React, { Suspense, lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from '../context/ThemeContext'
import { Toaster } from './shared/Toaster'
import { LoadingSkeleton } from './shared/LoadingSkeleton'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

// Lazy load the main dashboard for better initial load performance
const OptimizedDashboard = lazy(() => 
  import('./OptimizedDashboard').then(module => ({ 
    default: module.OptimizedDashboard 
  }))
)

// Enhanced error boundary component
const AppErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="max-w-md w-full text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={resetErrorBoundary}
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
        
        <details className="text-left">
          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            Error Details
          </summary>
          <pre className="mt-2 text-xs bg-muted p-3 rounded-md overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  </div>
)

// Enhanced loading component
const AppLoading = () => (
  <div className="min-h-screen bg-background">
    {/* Header Skeleton */}
    <div className="border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <LoadingSkeleton className="h-8 w-64" />
            <LoadingSkeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <LoadingSkeleton className="h-10 w-32" />
            <LoadingSkeleton className="h-10 w-20" />
            <LoadingSkeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <LoadingSkeleton className="h-4 w-20" />
              <LoadingSkeleton className="h-10 w-10 rounded-full" />
            </div>
            <LoadingSkeleton className="h-8 w-24 mb-2" />
            <LoadingSkeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingSkeleton className="h-80 rounded-lg" />
        <LoadingSkeleton className="h-80 rounded-lg" />
      </div>
    </div>
  </div>
)

export function OptimizedApp() {
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground antialiased relative overflow-hidden">
          {/* Enhanced Background Orbs with better performance */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            <Suspense fallback={<AppLoading />}>
              <OptimizedDashboard />
            </Suspense>
          </div>
          
          {/* Toast Notifications */}
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}