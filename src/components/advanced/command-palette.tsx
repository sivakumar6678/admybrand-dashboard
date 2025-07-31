import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import { 
  Moon, 
  Sun, 
  Brain, 
  Copy, 
  Download, 
  Search,
  Palette,
  Zap,
  Layout,
  RefreshCw,
  Settings,
  FileText,
  Share2,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

interface CommandPaletteProps {
  onGenerateInsights?: () => void;
  onResetLayout?: () => void;
  onRefreshData?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  onGenerateInsights,
  onResetLayout,
  onRefreshData
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setSearch('');
  };

  const commands = [
    {
      id: 'toggle-theme',
      icon: theme === 'dark' ? Sun : Moon,
      label: 'Toggle Theme',
      description: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
      shortcut: '⌘T',
      action: () => {
        toggleTheme();
        toast.success(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        handleClose();
      },
      category: 'Appearance'
    },
    {
      id: 'generate-insights',
      icon: Brain,
      label: 'Generate AI Insights',
      description: 'Get AI-powered analysis of your data',
      shortcut: '⌘I',
      action: () => {
        if (onGenerateInsights) {
          onGenerateInsights();
          toast.success('Generating AI insights...');
        }
        handleClose();
      },
      category: 'AI & Analytics',
      highlight: true
    },
    {
      id: 'copy-url',
      icon: Copy,
      label: 'Copy Page URL',
      description: 'Copy current dashboard URL to clipboard',
      shortcut: '⌘C',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('URL copied to clipboard!');
        handleClose();
      },
      category: 'Sharing'
    },
    {
      id: 'export-csv',
      icon: Download,
      label: 'Export to CSV',
      description: 'Export dashboard data as CSV file',
      shortcut: '⌘E',
      action: () => {
        toast.info('CSV export feature coming soon!');
        handleClose();
      },
      category: 'Data Export'
    },
    {
      id: 'refresh-data',
      icon: RefreshCw,
      label: 'Refresh Data',
      description: 'Refresh all dashboard metrics',
      shortcut: '⌘R',
      action: () => {
        if (onRefreshData) {
          onRefreshData();
          toast.success('Refreshing dashboard data...');
        }
        handleClose();
      },
      category: 'Data'
    },
    {
      id: 'reset-layout',
      icon: Layout,
      label: 'Reset Layout',
      description: 'Reset dashboard layout to default',
      shortcut: '⌘L',
      action: () => {
        if (onResetLayout) {
          onResetLayout();
          toast.success('Layout reset to default');
        }
        handleClose();
      },
      category: 'Layout'
    },
    {
      id: 'share-dashboard',
      icon: Share2,
      label: 'Share Dashboard',
      description: 'Generate shareable link',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Shareable link copied!');
        handleClose();
      },
      category: 'Sharing'
    },
    {
      id: 'dashboard-settings',
      icon: Settings,
      label: 'Dashboard Settings',
      description: 'Customize dashboard preferences',
      action: () => {
        toast.info('Dashboard settings coming soon!');
        handleClose();
      },
      category: 'Settings'
    },
    {
      id: 'export-report',
      icon: FileText,
      label: 'Generate Report',
      description: 'Create PDF report of current data',
      action: () => {
        toast.info('PDF report generation coming soon!');
        handleClose();
      },
      category: 'Reports'
    },
    {
      id: 'view-documentation',
      icon: BookOpen,
      label: 'View Documentation',
      description: 'Open dashboard documentation',
      action: () => {
        window.open('https://github.com/yourusername/admybrand-dashboard', '_blank');
        toast.success('Documentation opened');
        handleClose();
      },
      category: 'Help'
    }
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(search.toLowerCase()) ||
    command.description.toLowerCase().includes(search.toLowerCase()) ||
    command.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {} as Record<string, typeof commands>);

  return (
    <>
      {/* Trigger hint */}
      <div className="fixed bottom-4 right-4 z-40 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2">
          <Search className="h-3 w-3" />
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">⌘K</kbd>
          <span>for commands</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="p-0 max-w-2xl bg-background/95 backdrop-blur-md border shadow-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Command className="rounded-lg border-0 shadow-none bg-background">
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Command.Input
                      placeholder="Search commands..."
                      value={search}
                      onValueChange={setSearch}
                      className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
                    />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">ESC</kbd>
                    </div>
                  </div>

                  <Command.List className="max-h-96 overflow-y-auto p-2">
                    <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                      No commands found.
                    </Command.Empty>

                    {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                      <Command.Group key={category} heading={category} className="mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                        {categoryCommands.map((command) => {
                          const IconComponent = command.icon;
                          return (
                            <Command.Item
                              key={command.id}
                              onSelect={command.action}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                                "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground",
                                "data-[selected=true]:bg-gray-100 dark:data-[selected=true]:bg-gray-800 data-[selected=true]:text-foreground",
                                "aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-foreground",
                                command.highlight && "bg-primary/10 border border-primary/20 text-primary"
                              )}
                            >
                              <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-md",
                                command.highlight 
                                  ? "bg-primary/10 text-primary" 
                                  : "bg-muted text-muted-foreground"
                              )}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{command.label}</span>
                                  {command.shortcut && (
                                    <kbd className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                                      {command.shortcut}
                                    </kbd>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                  {command.description}
                                </p>
                              </div>
                            </Command.Item>
                          );
                        })}
                      </Command.Group>
                    ))}
                  </Command.List>
                </Command>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};