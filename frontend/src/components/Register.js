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
  Avatar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Instagram,
  Facebook,
  Google,
  PhotoCamera,
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
  maxWidth: 450,
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

const RegisterButton = styled(Button)(({ theme }) => ({
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

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  border: '3px solid rgba(139, 92, 246, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    border: '3px solid rgba(139, 92, 246, 0.6)',
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Call the actual registration API
      const response = await authAPI.register({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        bio: formData.bio,
        profileImage: profileImage,
      });
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/app');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.log('Error response:', err.response?.data);
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    // Mock social registration
    console.log(`${provider} registration clicked`);
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
            Join Vistagram
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Start sharing your adventures today
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Profile Image Upload */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-image-upload"
            type="file"
            onChange={handleImageUpload}
          />
          <label htmlFor="profile-image-upload">
            <ProfileAvatar>
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <PhotoCamera sx={{ fontSize: 40 }} />
              )}
            </ProfileAvatar>
          </label>
          <Typography variant="body2" color="text.secondary">
            Click to upload profile picture
          </Typography>
        </Box>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledTextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
            <StyledTextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </Box>

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
            label="Bio"
            name="bio"
            multiline
            rows={2}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself (optional)"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
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
            <StyledTextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#E5E7EB' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <RegisterButton
            type="submit"
            variant="contained"
            disabled={loading || !formData.username || !formData.email || !formData.password || !formData.confirmPassword}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            ) : (
              'Create Account'
            )}
          </RegisterButton>
        </form>

        {/* Divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
          <Divider sx={{ flex: 1, borderColor: 'rgba(139, 92, 246, 0.2)' }} />
          <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
            OR
          </Typography>
          <Divider sx={{ flex: 1, borderColor: 'rgba(139, 92, 246, 0.2)' }} />
        </Box>

        {/* Social Registration */}
        <SocialButton
          variant="facebook"
          onClick={() => handleSocialRegister('Facebook')}
          startIcon={<Facebook />}
        >
          Sign up with Facebook
        </SocialButton>
        
        <SocialButton
          variant="google"
          onClick={() => handleSocialRegister('Google')}
          startIcon={<Google />}
        >
          Sign up with Google
        </SocialButton>

        {/* Login Link */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
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
              Sign in
            </Link>
          </Typography>
        </Box>
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;
