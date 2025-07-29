import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button } from "./ui/button";
import { Sun, Moon, Stars } from "lucide-react";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      aria-label="Toggle Dark Mode"
      className="relative overflow-hidden group hover:shadow-glow transition-all duration-500 border-2"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Rotating background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent rotate-45 scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-90" />
      
      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center">
        {darkMode ? (
          <div className="relative">
            <Sun className="h-5 w-5 text-amber-500 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110" />
            <div className="absolute inset-0 animate-ping">
              <Sun className="h-5 w-5 text-amber-500/30" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <Moon className="h-5 w-5 text-blue-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <Stars className="absolute -top-1 -right-1 h-2 w-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
        darkMode 
          ? 'shadow-[0_0_20px_rgba(245,158,11,0.3)] opacity-0 group-hover:opacity-100' 
          : 'shadow-[0_0_20px_rgba(59,130,246,0.3)] opacity-0 group-hover:opacity-100'
      }`} />
    </Button>
  );
}
