import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Favorite as LikeIcon,
  Comment as CommentIcon,
  PersonAdd as FollowIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const NotificationCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 16,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
  },
}));

const NotificationItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  marginBottom: theme.spacing(1),
  background: 'rgba(22, 33, 62, 0.3)',
  border: '1px solid rgba(139, 92, 246, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(22, 33, 62, 0.5)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
  },
}));

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'like',
          user: { username: 'traveler_jane', fullName: 'Jane Doe' },
          post: { caption: 'Amazing sunset at the beach!' },
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false,
        },
        {
          id: 2,
          type: 'comment',
          user: { username: 'adventure_mike', fullName: 'Mike Johnson' },
          post: { caption: 'Exploring the mountains today' },
          comment: 'Beautiful view! Where is this?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
        },
        {
          id: 3,
          type: 'follow',
          user: { username: 'photography_lisa', fullName: 'Lisa Chen' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: true,
        },
        {
          id: 4,
          type: 'share',
          user: { username: 'wanderlust_tom', fullName: 'Tom Wilson' },
          post: { caption: 'City lights at night' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          read: true,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <LikeIcon sx={{ color: '#EC4899' }} />;
      case 'comment':
        return <CommentIcon sx={{ color: '#8B5CF6' }} />;
      case 'follow':
        return <FollowIcon sx={{ color: '#10B981' }} />;
      case 'share':
        return <ShareIcon sx={{ color: '#F59E0B' }} />;
      default:
        return <LikeIcon sx={{ color: '#8B5CF6' }} />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return `liked your post "${notification.post.caption}"`;
      case 'comment':
        return `commented "${notification.comment}" on your post`;
      case 'follow':
        return 'started following you';
      case 'share':
        return `shared your post "${notification.post.caption}"`;
      default:
        return 'interacted with your content';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate based on notification type
    switch (notification.type) {
      case 'like':
      case 'comment':
      case 'share':
        // Navigate to the post (for now, just go to timeline)
        navigate('/app');
        break;
      case 'follow':
        // Navigate to user profile
        navigate(`/profile/${notification.user.username}`);
        break;
      default:
        navigate('/app');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ color: '#8B5CF6' }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/app')}
          sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}
        >
          Back to Timeline
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app')}
          sx={{
            color: '#8B5CF6',
            mb: 2,
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.1)',
            },
          }}
        >
          Back to Timeline
        </Button>
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff', mb: 1 }}>
          Notifications
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {notifications.filter(n => !n.read).length} new notifications
        </Typography>
      </Box>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <Card sx={{ 
          background: 'rgba(22, 33, 62, 0.5)', 
          border: '1px solid rgba(139, 92, 246, 0.2)',
          textAlign: 'center',
          py: 4
        }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            No notifications yet
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            When you get likes, comments, or new followers, they'll appear here.
          </Typography>
        </Card>
      ) : (
        <List>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              button
              onClick={() => handleNotificationClick(notification)}
              sx={{
                opacity: notification.read ? 0.7 : 1,
                background: notification.read 
                  ? 'rgba(22, 33, 62, 0.3)' 
                  : 'rgba(139, 92, 246, 0.1)',
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    width: 40,
                    height: 40,
                  }}
                >
                  {notification.user.fullName?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: notification.read ? 400 : 600,
                        color: '#ffffff',
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#8B5CF6',
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${notification.user.username}`);
                      }}
                    >
                      {notification.user.fullName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {getNotificationIcon(notification.type)}
                    </Box>
                    {!notification.read && (
                      <Chip
                        label="New"
                        size="small"
                        sx={{
                          background: 'rgba(236, 72, 153, 0.2)',
                          color: '#EC4899',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mb: 0.5,
                      }}
                    >
                      {getNotificationText(notification)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {formatTimestamp(notification.timestamp)}
                    </Typography>
                  </Box>
                }
              />
            </NotificationItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Notifications;
