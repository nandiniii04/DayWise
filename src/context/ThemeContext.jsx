import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext(null);

export const useThemeMode = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('daywise_theme') || 'dark');

  const toggle = () => {
    setMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('daywise_theme', next);
      return next;
    });
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#F5C518', contrastText: '#1a1a1a' },
      secondary: { main: '#2D2D2D' },
      background: mode === 'dark'
        ? { default: '#0f0f0f', paper: '#1a1a1a' }
        : { default: '#f4f4f0', paper: '#ffffff' },
      success: { main: '#4caf50' },
      error: { main: '#f44336' },
      text: mode === 'dark'
        ? { primary: '#f0f0f0', secondary: '#aaa' }
        : { primary: '#1a1a1a', secondary: '#555' },
    },
    typography: {
      fontFamily: '"DM Sans", "Roboto", sans-serif',
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
          containedPrimary: {
            background: 'linear-gradient(135deg, #F5C518, #e6b800)',
            color: '#1a1a1a',
            '&:hover': { background: 'linear-gradient(135deg, #e6b800, #cc9f00)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: mode === 'dark' ? '1px solid #2a2a2a' : '1px solid #e0e0e0',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: mode === 'dark' ? '#111111' : '#ffffff',
            borderRight: mode === 'dark' ? '1px solid #222' : '1px solid #e0e0e0',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};