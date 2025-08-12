import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 46, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 700,
  fontSize: '1.8rem',
  letterSpacing: '-0.5px',
}));

const NavButton = styled(Button)(({ theme, $active }) => ({
  color: $active ? '#8B5CF6' : '#E5E7EB',
  backgroundColor: $active ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
  borderRadius: 12,
  padding: '8px 16px',
  margin: '0 4px',
  '&:hover': {
    backgroundColor: $active ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const CaptureButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  color: '#ffffff',
  borderRadius: 25,
  padding: '10px 24px',
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user')) || { username: 'User' };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/app')}>
          <CameraIcon sx={{ fontSize: 32, color: '#8B5CF6', mr: 1 }} />
          <LogoText variant="h4">Vistagram</LogoText>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <NavButton
            startIcon={<HomeIcon />}
            $active={isActive('/app')}
            onClick={() => navigate('/app')}
          >
            Timeline
          </NavButton>
          <NavButton
            startIcon={<CameraIcon />}
            $active={isActive('/capture')}
            onClick={() => navigate('/capture')}
          >
            Capture
          </NavButton>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Capture button for mobile */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Tooltip title="Capture Photo">
              <IconButton
                onClick={() => navigate('/capture')}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  color: '#ffffff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                  },
                }}
              >
                <CameraIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Desktop capture button */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <CaptureButton
              startIcon={<CameraIcon />}
              onClick={() => navigate('/capture')}
            >
              Capture
            </CaptureButton>
          </Box>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              sx={{ color: '#E5E7EB' }}
              onClick={() => navigate('/notifications')}
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User menu */}
          <Tooltip title="Profile">
            <IconButton
              onClick={handleMenuOpen}
              sx={{ color: '#E5E7EB' }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  fontSize: '0.875rem',
                }}
              >
                {currentUser.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: 'rgba(22, 33, 62, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                mt: 1,
              },
            }}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              navigate(`/profile/${currentUser.username}`);
            }}>
              <PersonIcon sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <SettingsIcon sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
