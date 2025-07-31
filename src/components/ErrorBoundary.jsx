import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error for debugging
    console.error('Chart Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="h-full flex flex-col min-h-[400px]">
          <CardHeader className="flex-shrink-0 pb-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Chart Error
            </CardTitle>
            <CardDescription>Something went wrong while rendering this chart</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0 min-w-0">
            <div className="h-[300px] w-full flex flex-col items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed border-destructive/30">
              <div className="text-center space-y-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
                <div>
                  <p className="text-destructive font-medium">Unable to render chart</p>
                  <p className="text-sm text-muted-foreground mt-1">Check console for more details</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                    if (this.props.onRetry) {
                      this.props.onRetry();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-3 bg-muted rounded text-xs">
                <summary className="cursor-pointer font-medium text-destructive">
                  Debug Info (Development)
                </summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;