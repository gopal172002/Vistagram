import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Instagram,
  Facebook,
  Google,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const AuthCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 400,
  background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 20,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #8B5CF6 100%)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      border: '1px solid rgba(139, 92, 246, 0.4)',
      background: 'rgba(255, 255, 255, 0.08)',
    },
    '&.Mui-focused': {
      border: '1px solid #8B5CF6',
      background: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#E5E7EB',
    '&.Mui-focused': {
      color: '#8B5CF6',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
    '&::placeholder': {
      color: '#9CA3AF',
      opacity: 1,
    },
  },
}));

const SocialButton = styled(Button)(({ theme, variant }) => ({
  width: '100%',
  marginBottom: theme.spacing(1.5),
  borderRadius: 12,
  padding: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  background: variant === 'facebook' 
    ? 'linear-gradient(135deg, #1877F2 0%, #166FE5 100%)'
    : variant === 'google'
    ? 'linear-gradient(135deg, #DB4437 0%, #C5392B 100%)'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
  color: '#ffffff',
  '&:hover': {
    background: variant === 'facebook' 
      ? 'linear-gradient(135deg, #166FE5 0%, #1464D9 100%)'
      : variant === 'google'
      ? 'linear-gradient(135deg, #C5392B 0%, #B33426 100%)'
      : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
  },
  transition: 'all 0.3s ease',
}));

const LoginButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  padding: theme.spacing(1.5),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1.1rem',
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  color: '#ffffff',
  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(139, 92, 246, 0.3)',
    transform: 'none',
    boxShadow: 'none',
  },
  transition: 'all 0.3s ease',
}));

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the actual login API
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/app');
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.log('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // Mock social login
    console.log(`${provider} login clicked`);
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthCard elevation={0}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            mb: 2,
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
          }}>
            <Instagram sx={{ fontSize: 40, color: '#ffffff' }} />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Vistagram
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Share your amazing adventures
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          
          <StyledTextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#E5E7EB' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoginButton
            type="submit"
            variant="contained"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            ) : (
              'Sign In'
            )}
          </LoginButton>
        </form>

        {/* Divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
          <Divider sx={{ flex: 1, borderColor: 'rgba(139, 92, 246, 0.2)' }} />
          <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1, borderColor: 'rgba(139, 92, 246, 0.2)' }} />
        </Box>

        {/* Social Login */}
        <SocialButton
          variant="facebook"
          onClick={() => handleSocialLogin('Facebook')}
          startIcon={<Facebook />}
        >
          Continue with Facebook
        </SocialButton>
        
        <SocialButton
          variant="google"
          onClick={() => handleSocialLogin('Google')}
          startIcon={<Google />}
        >
          Continue with Google
        </SocialButton>

        {/* Register Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/register')}
              sx={{
                color: '#8B5CF6',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  color: '#A78BFA',
                  textDecoration: 'underline',
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;
