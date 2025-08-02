import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const { theme, setTheme, darkMode, isTransitioning, isSwitching, setLightMode, setDarkMode, setSystemMode } = useContext(ThemeContext);
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
    // Use the appropriate theme switching function for instant animation
    switch(newTheme) {
      case 'light':
        setLightMode();
        break;
      case 'dark':
        setDarkMode();
        break;
      case 'system':
        setSystemMode();
        break;
      default:
        setTheme(newTheme);
    }

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
          disabled={isTransitioning || isSwitching}
          className={`heavy-button relative overflow-hidden group border-2 shadow-xl backdrop-blur-md
            bg-card/80 hover:bg-card/90 border-border hover:border-primary/50
            transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
            (isTransitioning || isSwitching)
              ? 'animate-pulse shadow-primary/50 scale-110 border-primary/70 bg-primary/10'
              : 'hover:shadow-primary/20'
          }`}
        >
          <AnimatePresence mode="wait">
            {(isTransitioning || isSwitching) ? (
              <motion.div
                key="loading"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="relative z-10 flex items-center justify-center"
              >
                {/* Professional loading animation */}
                <div className="relative">
                  {/* Rotating outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="w-5 h-5 border-2 border-primary/40 border-t-primary border-r-primary/20 rounded-full" />
                  </motion.div>

                  {/* Counter-rotating inner icon */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 flex items-center justify-center"
                  >
                    {darkMode ? (
                      <Moon className="h-3 w-3 text-primary" />
                    ) : (
                      <Sun className="h-3 w-3 text-primary" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ) : (
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
            )}
          </AnimatePresence>

          {/* Enhanced layered background animations */}
          <motion.div
            className={`absolute inset-0 transition-opacity duration-500 ${
              (isTransitioning || isSwitching)
                ? 'bg-gradient-to-r from-primary/20 via-blue-500/25 to-primary/20'
                : darkMode
                ? 'bg-gradient-to-r from-blue-500/15 via-purple-500/20 to-blue-500/15'
                : 'bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15'
            }`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: (isTransitioning || isSwitching) ? 1 : 0,
              backgroundPosition: (isTransitioning || isSwitching)
                ? ['0% 50%', '100% 50%', '0% 50%']
                : ['0% 50%', '100% 50%', '0% 50%'],
              scale: (isTransitioning || isSwitching) ? [1, 1.05, 1] : [1, 1.02, 1]
            }}
            whileHover={{ opacity: (isTransitioning || isSwitching) ? 1 : 1 }}
            transition={{
              opacity: { duration: 0.2 },
              backgroundPosition: {
                duration: (isTransitioning || isSwitching) ? 0.8 : 2,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: (isTransitioning || isSwitching) ? 0.6 : 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />

          {/* Enhanced glow effect for loading state */}
          <motion.div
            className={`absolute inset-0 rounded-md ${
              (isTransitioning || isSwitching)
                ? 'bg-primary/10'
                : 'bg-primary/5 opacity-0 group-hover:opacity-100'
            }`}
            animate={{
              opacity: (isTransitioning || isSwitching) ? [0.5, 1, 0.5] : [0, 0.3, 0]
            }}
            transition={{
              duration: (isTransitioning || isSwitching) ? 0.6 : 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Loading state pulse rings */}
          {(isTransitioning || isSwitching) && (
            <>
              <motion.div
                className="absolute inset-0 rounded-md border-2 border-primary/30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0, 1]
                }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-md border-2 border-blue-500/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0, 1]
                }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
              />
            </>
          )}
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
