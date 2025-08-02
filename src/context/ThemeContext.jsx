import { createContext, useState, useEffect, useCallback } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem("theme");
    return saved || "system";
  });

  const [darkMode, setDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const applyTheme = useCallback((isDark) => {
    const root = window.document.documentElement;
    const body = document.body;
    setIsTransitioning(true);

    // Add enhanced transition classes for smooth theme switching
    root.classList.add('theme-transitioning');
    body.classList.add('theme-transitioning');

    // Apply CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition-duration', '0.2s');
    root.style.setProperty('--theme-transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
      body.style.transition = 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
      body.style.transition = 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // Update meta theme-color for mobile browsers with enhanced colors
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0f0f0f' : '#667eea');
    }

    // Update viewport meta for better mobile experience
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    }

    setDarkMode(isDark);

    // Remove transition classes after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      root.classList.remove('theme-transitioning');
      body.classList.remove('theme-transitioning');
      // Clean up inline styles
      body.style.transition = '';
    }, 200); // Reduced to match the faster 0.2s transition duration
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      const handleChange = (e) => applyTheme(e.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, applyTheme, mounted]);

  const toggleDarkMode = useCallback(() => {
    setIsSwitching(true); // Start animation immediately
    setTimeout(() => {
      setTheme(prev => prev === "dark" ? "light" : "dark");
    }, 150); // Slight delay for smoothness
    setTimeout(() => {
      setIsSwitching(false); // Remove animation shortly after
    }, 700); // Matches the animation duration
  }, []);

  const setLightMode = useCallback(() => {
    setIsSwitching(true); // Start animation immediately
    setTimeout(() => {
      setTheme("light");
    }, 150);
    setTimeout(() => {
      setIsSwitching(false);
    }, 700);
  }, []);

  const setDarkModeTheme = useCallback(() => {
    setIsSwitching(true); // Start animation immediately
    setTimeout(() => {
      setTheme("dark");
    }, 150);
    setTimeout(() => {
      setIsSwitching(false);
    }, 700);
  }, []);

  const setSystemMode = useCallback(() => {
    setIsSwitching(true); // Start animation immediately
    setTimeout(() => {
      setTheme("system");
    }, 150);
    setTimeout(() => {
      setIsSwitching(false);
    }, 700);
  }, []);

  const contextValue = {
    darkMode,
    theme,
    setTheme,
    toggleDarkMode,
    setLightMode,
    setDarkMode: setDarkModeTheme,
    setSystemMode,
    isTransitioning,
    isSwitching,
    mounted
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
      {/* Smooth animation overlay (non-blocking) */}
      {isSwitching && (
        <div className="fixed inset-0 z-50 pointer-events-none transition-all duration-500 ease-in-out">
          {/* Subtle overlay with ripple effect */}
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 backdrop-blur-sm animate-fadeInOut" />
          
          {/* Ripple effect from center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Outer ripple */}
              <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '0.7s' }} />
              {/* Inner ripple */}
              <div className="absolute inset-4 w-24 h-24 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '0.5s', animationDelay: '0.1s' }} />
              
              {/* Central icon */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="animate-spin-slow">
                  {darkMode ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-2xl border-2 border-white/20">
                      <span className="text-xl">🌙</span>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl border-2 border-white/20">
                      <span className="text-xl">☀️</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Provider>
  );
};
