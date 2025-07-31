import React, { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "system";
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (isDark) => {
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      setDarkMode(isDark);
    };

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
  }, [theme]);

  const toggleDarkMode = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      theme, 
      setTheme, 
      toggleDarkMode,
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
