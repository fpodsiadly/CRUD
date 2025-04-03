import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './index.css';
import App from './App';

const AppWithThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <header style={{ padding: '1rem', textAlign: 'right' }}>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Dark Theme off' : 'Dark Theme on'}
        </button>
      </header>
      <App />
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithThemeToggle />
  </StrictMode>
);
