import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Header from './components/Header';
import Timeline from './components/Timeline';
import CameraCapture from './components/CameraCapture';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile';
import Notifications from './components/Notifications';
import './App.css';


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6',
      light: '#A78BFA',
      dark: '#7C3AED',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#E5E7EB',
    },
    divider: '#374151',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(139, 92, 246, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #16213e 0%, #1e293b 100%)',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #16213e 0%, #1e293b 100%)',
          border: '1px solid #374151',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <Header />
                <Box sx={{ pt: 8, pb: 4 }}>
                  <Timeline />
                </Box>
              </Box>
            </ProtectedRoute>
          } />
          
          <Route path="/timeline" element={
            <ProtectedRoute>
              <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <Header />
                <Box sx={{ pt: 8, pb: 4 }}>
                  <Timeline />
                </Box>
              </Box>
            </ProtectedRoute>
          } />
          
          <Route path="/capture" element={
            <ProtectedRoute>
              <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <Header />
                <Box sx={{ pt: 8, pb: 4 }}>
                  <CameraCapture />
                </Box>
              </Box>
            </ProtectedRoute>
          } />

          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <Header />
                <Box sx={{ pt: 8, pb: 4 }}>
                  <Profile />
                </Box>
              </Box>
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                <Header />
                <Box sx={{ pt: 8, pb: 4 }}>
                  <Notifications />
                </Box>
              </Box>
            </ProtectedRoute>
          } />
          
          {/* Redirect to app if authenticated */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
