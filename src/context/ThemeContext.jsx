import { createContext, useState, useEffect, useCallback } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "system";
  });

  const [darkMode, setDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const applyTheme = useCallback((isDark) => {
    const root = window.document.documentElement;
    setIsTransitioning(true);

    // Add transition class for smooth theme switching
    root.style.setProperty('--theme-transition', 'all 0.3s ease-in-out');

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setDarkMode(isDark);

    // Remove transition after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, []);

  useEffect(() => {
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
  }, [theme, applyTheme]);

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
    isTransitioning
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
