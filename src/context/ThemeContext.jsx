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

  const applyTheme = useCallback((isDark) => {
    const root = window.document.documentElement;
    const body = document.body;
    setIsTransitioning(true);

    // Add enhanced transition classes for smooth theme switching
    root.classList.add('theme-transitioning');
    body.classList.add('theme-transitioning');

    // Apply CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition-duration', '0.5s');
    root.style.setProperty('--theme-transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
      body.style.transition = 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
      body.style.transition = 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), color 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
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
    }, 500); // Increased to match the 0.5s transition duration
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
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }, []);

  const setLightMode = useCallback(() => {
    setTheme("light");
  }, []);

  const setDarkModeTheme = useCallback(() => {
    setTheme("dark");
  }, []);

  const setSystemMode = useCallback(() => {
    setTheme("system");
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
    mounted
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
