import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Loader2,
  CheckCircle,
  History,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useNaturalLanguageQuery } from '../hooks/useNaturalLanguageQuery';
import { cn } from '../utils/cn';

const QueryResponse = ({ response }) => {
  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
    if (confidence >= 80) return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-blue-500/5 border border-primary/20"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        
        <div className="flex-1 space-y-3">
          <p className="text-sm leading-relaxed">{response.response}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getConfidenceColor(response.confidence))}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {response.confidence}% confidence
              </Badge>
              
              {response.sources && response.sources.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Sources:</span>
                  {response.sources.slice(0, 2).map((source, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {source.replace('_', ' ')}
                    </Badge>
                  ))}
                  {response.sources.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{response.sources.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QueryHistoryItem = ({ item, onRequery }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer"
    onClick={() => onRequery(item.query)}
  >
    <div className="space-y-2">
      <p className="text-sm font-medium">{item.query}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {item.response.response}
      </p>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {item.response.confidence}% confidence
        </Badge>
        <span className="text-xs text-muted-foreground">
          {item.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  </motion.div>
);

const NaturalLanguageQuery = ({ data, className }) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const {
    processQuery,
    isProcessing,
    response,
    error,
    queryHistory,
    clearResponse,
    clearHistory,
    hasResponse,
    hasHistory
  } = useNaturalLanguageQuery(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      processQuery(query);
    }
  };

  const handleRequery = (historicalQuery) => {
    setQuery(historicalQuery);
    setShowHistory(false);
  };

  const suggestedQueries = [
    "How is our revenue performing?",
    "What's the user engagement like?",
    "Tell me about team productivity",
    "How are our conversion rates?"
  ];

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            Ask AI
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </CardTitle>
          
          {hasHistory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              {showHistory ? 'Hide' : 'History'}
            </Button>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">
          Ask questions about your dashboard data in natural language
        </p>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your data..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!query.trim() || isProcessing}
              size="sm"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </form>

        {/* Suggested Queries */}
        {!hasResponse && !isProcessing && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="text-xs h-auto py-1 px-2"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="text-center space-y-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-blue-500/10 rounded-full mx-auto w-fit"
              >
                <Brain className="h-6 w-6 text-blue-500" />
              </motion.div>
              <p className="text-sm font-medium">Processing your question...</p>
              <p className="text-xs text-muted-foreground">AI is analyzing your data</p>
            </div>
          </motion.div>
        )}

        {/* Response */}
        <AnimatePresence>
          {hasResponse && (
            <div className="space-y-3">
              <QueryResponse response={response} />
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearResponse}
                  className="text-xs"
                >
                  Clear Response
                </Button>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* History */}
        <AnimatePresence>
          {showHistory && hasHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Recent Queries</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {queryHistory.slice(0, 5).map((item) => (
                  <QueryHistoryItem
                    key={item.id}
                    item={item}
                    onRequery={handleRequery}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default NaturalLanguageQuery;
