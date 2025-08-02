import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ThemeContext";
import { Button } from "./ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useToast } from "../hooks/useToast";

export function DarkModeToggle() {
  const { theme, setTheme, darkMode, isTransitioning } = useContext(ThemeContext);
  const { toast } = useToast();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 text-amber-500 dark:text-amber-400" />
      case 'dark':
        return <Moon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
      default:
        return <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    }
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);

    const themeNames = {
      light: 'Light Mode',
      dark: 'Dark Mode',
      system: 'System Theme'
    };

    const themeIcons = {
      light: '☀️',
      dark: '🌙',
      system: '💻'
    };

    toast({
      title: `${themeIcons[newTheme]} ${themeNames[newTheme]}`,
      description: `Switched to ${themeNames[newTheme].toLowerCase()}`,
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          className={`relative overflow-hidden group transition-all duration-500 ${
            isTransitioning ? 'animate-pulse' : 'hover:shadow-glow'
          }`}
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            {getThemeIcon()}
          </motion.div>

          {/* Enhanced animated background */}
          <motion.div
            className={`absolute inset-0 transition-opacity duration-500 ${
              darkMode
                ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10'
                : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10'
            }`}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 p-2">
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${
            theme === 'light' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300' : ''
          }`}
        >
          <Sun className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          <div className="flex flex-col">
            <span className="font-medium">Light</span>
            <span className="text-xs text-muted-foreground">Bright theme</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${
            theme === 'dark' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : ''
          }`}
        >
          <Moon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <div className="flex flex-col">
            <span className="font-medium">Dark</span>
            <span className="text-xs text-muted-foreground">Dark theme</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className={`flex items-center gap-3 p-3 rounded-md transition-all duration-200 ${
            theme === 'system' ? 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300' : ''
          }`}
        >
          <Monitor className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <div className="flex flex-col">
            <span className="font-medium">System</span>
            <span className="text-xs text-muted-foreground">Auto detect</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
