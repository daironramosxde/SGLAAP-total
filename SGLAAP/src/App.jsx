// src/App.jsx
import AppRouter from './routes/AppRouter';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { useContext } from 'react';

const AppContent = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <AppRouter />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
