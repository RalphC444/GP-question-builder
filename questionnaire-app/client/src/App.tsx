import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QuestionnaireProvider } from './context/QuestionnaireContext';
import { QuestionBuilder } from './components/QuestionBuilder';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QuestionnaireProvider>
        <QuestionBuilder />
      </QuestionnaireProvider>
    </ThemeProvider>
  );
}

export default App; 