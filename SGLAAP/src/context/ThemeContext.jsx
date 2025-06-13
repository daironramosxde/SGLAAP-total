// src/context/ThemeContext.jsx
import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar tema desde localStorage al iniciar
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    setDarkMode(storedTheme === 'dark');
  }, []);

  // Aplicar clase al body y guardar en localStorage al cambiar darkMode
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
