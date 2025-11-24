import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { validateEmail } from '../utils/validation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.error || 'Invalid email');
      return;
    }

    if (!password || password.length === 0) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err: any) {
      // Don't expose detailed error messages to prevent information leakage
      const errorMessage = err.response?.status === 401 
        ? 'Invalid email or password'
        : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
            <Box textAlign="center">
              <MuiLink component={Link} to="/register" variant="body2">
                Don't have an account? Sign Up
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

