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
          className={`heavy-button relative overflow-hidden group border-2 shadow-xl backdrop-blur-md
            bg-card/80 hover:bg-card/90 border-border hover:border-primary/50
            transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
            isTransitioning ? 'animate-pulse shadow-primary/30' : 'hover:shadow-primary/20'
          }`}
        >
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="relative z-10"
          >
            {getThemeIcon()}
          </motion.div>

          {/* Enhanced layered background animations */}
          <motion.div
            className={`absolute inset-0 transition-opacity duration-500 ${
              darkMode
                ? 'bg-gradient-to-r from-blue-500/15 via-purple-500/20 to-blue-500/15'
                : 'bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15'
            }`}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              scale: [1, 1.02, 1]
            }}
            transition={{
              backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Additional glow effect */}
          <motion.div
            className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100"
            animate={{
              opacity: [0, 0.3, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 p-3 border-2 shadow-2xl backdrop-blur-lg bg-card/90
          border-border rounded-xl"
      >
        <DropdownMenuItem
          onClick={() => handleThemeChange('light')}
          className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-all duration-300
            hover:shadow-md hover:scale-[1.02] cursor-pointer border border-transparent
            ${theme === 'light'
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-600 shadow-md'
              : 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-200 dark:hover:border-amber-700'
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
          className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-all duration-300
            hover:shadow-md hover:scale-[1.02] cursor-pointer border border-transparent
            ${theme === 'dark'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-600 shadow-md'
              : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700'
            }`}
        >
          <Moon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <div className="flex flex-col">
            <span className="font-medium">Dark</span>
            <span className="text-xs text-muted-foreground">Dark theme</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-3 border-gray-200 dark:border-gray-700" />

        <DropdownMenuItem
          onClick={() => handleThemeChange('system')}
          className={`flex items-center gap-3 p-3 rounded-lg font-semibold transition-all duration-300
            hover:shadow-md hover:scale-[1.02] cursor-pointer border border-transparent
            ${theme === 'system'
              ? 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-300 dark:border-gray-600 shadow-md'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:border-gray-200 dark:hover:border-gray-700'
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
