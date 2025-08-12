import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  CameraAlt,
  Explore,
  Share,
  Favorite,
  Instagram,
  ArrowForward,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
    zIndex: 1,
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 20,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  color: '#ffffff',
  borderRadius: 50,
  padding: '15px 40px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)',
  },
  transition: 'all 0.3s ease',
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  border: '2px solid rgba(139, 92, 246, 0.5)',
  color: '#8B5CF6',
  borderRadius: 50,
  padding: '13px 38px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'transparent',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
    border: '2px solid #8B5CF6',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CameraAlt sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Capture Moments',
      description: 'Take stunning photos of amazing places and share your adventures with the world.',
    },
    {
      icon: <Explore sx={{ fontSize: 40, color: '#EC4899' }} />,
      title: 'Discover Places',
      description: 'Explore incredible points of interest shared by travelers around the globe.',
    },
    {
      icon: <Share sx={{ fontSize: 40, color: '#8B5CF6' }} />,
      title: 'Share Stories',
      description: 'Share your travel experiences and connect with fellow adventurers.',
    },
    {
      icon: <Favorite sx={{ fontSize: 40, color: '#EC4899' }} />,
      title: 'Engage & Connect',
      description: 'Like, comment, and interact with posts from the Vistagram community.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, mb: 3 }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    mr: 2,
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
                  }}>
                    <Instagram sx={{ fontSize: 40, color: '#ffffff' }} />
                  </Box>
                  <Typography 
                    variant="h3" 
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
                </Box>
                
                <Typography 
                  variant="h2" 
                  component="h2" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Share Your
                  <Box component="span" sx={{ 
                    display: 'block',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Amazing Adventures
                  </Box>
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 4, 
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Capture and share incredible moments from your travels. Connect with fellow explorers and discover amazing places around the world.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <CTAButton
                    onClick={() => navigate('/register')}
                    endIcon={<ArrowForward />}
                  >
                    Get Started
                  </CTAButton>
                  <SecondaryButton
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </SecondaryButton>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                position: 'relative',
              }}>
                <Box sx={{
                  width: 400,
                  height: 500,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                  borderRadius: 30,
                  border: '2px solid rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                    borderRadius: 35,
                    zIndex: -1,
                    filter: 'blur(20px)',
                  },
                }}>
                  <CameraAlt sx={{ fontSize: 120, color: 'rgba(139, 92, 246, 0.3)' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 8, background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Why Choose Vistagram?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Experience the perfect blend of social media and travel discovery
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard elevation={0}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
        borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 3,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join thousands of travelers sharing their amazing adventures
            </Typography>
            <CTAButton
              onClick={() => navigate('/register')}
              endIcon={<ArrowForward />}
              size="large"
            >
              Create Your Account
            </CTAButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

