import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Component to handle auth initialization inside Router context
function AuthInitializer() {
  const fetchUser = useAuthStore(state => state.fetchUser);
  const initialized = useAuthStore(state => state.initialized);
  const location = useLocation();

  // Initialize auth on app mount - only if not on auth pages
  useEffect(() => {
    if (!initialized) {
      const isAuthPage =
        location.pathname === '/login' || location.pathname === '/register';
      if (!isAuthPage) {
        // Only fetch user if not on login/register pages
        fetchUser();
      } else {
        // On auth pages, just mark as initialized without API call
        useAuthStore.setState({ initialized: true, loading: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return null;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthInitializer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
