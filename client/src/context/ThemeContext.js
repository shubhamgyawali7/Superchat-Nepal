"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const ThemeContext = createContext();

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  return localStorage.getItem('app-theme') || 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return;
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setExplicitTheme = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setTheme(mode);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setExplicitTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
