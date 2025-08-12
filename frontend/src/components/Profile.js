import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { usersAPI } from '../services/api';

const ProfileHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    zIndex: 0,
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid rgba(139, 92, 246, 0.3)',
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  fontSize: '3rem',
  fontWeight: 700,
  zIndex: 1,
  position: 'relative',
}));

const PostCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 16,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.4)',
  },
}));

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUserProfile(username);
      setProfile(response.data.user);
      setPosts(response.data.posts || []);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      fullName: profile.fullName || '',
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
    });
    setEditDialog(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await usersAPI.updateProfile(editForm);
      setProfile({ ...profile, ...response.data.user });
      setEditDialog(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postDate = new Date(timestamp);
    
    if (isNaN(postDate.getTime())) {
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return postDate.toLocaleDateString();
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

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          User not found
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

  const isOwnProfile = currentUser?.username === username;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app')}
          sx={{
            color: '#8B5CF6',
            '&:hover': {
              background: 'rgba(139, 92, 246, 0.1)',
            },
          }}
        >
          Back to Timeline
        </Button>
      </Box>

      {/* Profile Header */}
      <ProfileHeader>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <ProfileAvatar>
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile.fullName?.charAt(0).toUpperCase() || 'U'
                )}
              </ProfileAvatar>
            </Grid>
            
            <Grid item xs>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
                  {profile.fullName}
                </Typography>
                {profile.isVerified && (
                  <Chip
                    label="Verified"
                    size="small"
                    sx={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  />
                )}
              </Box>
              
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                @{profile.username}
              </Typography>
              
              {profile.bio && (
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                  {profile.bio}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {profile.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {profile.location}
                    </Typography>
                  </Box>
                )}
                
                {profile.website && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <WebsiteIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {profile.website}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            
            <Grid item>
              {isOwnProfile ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  sx={{
                    borderColor: 'rgba(139, 92, 246, 0.5)',
                    color: '#8B5CF6',
                    '&:hover': {
                      borderColor: '#8B5CF6',
                      background: 'rgba(139, 92, 246, 0.1)',
                    },
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PersonIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                    },
                  }}
                >
                  Follow
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </ProfileHeader>

      {/* Stats */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card sx={{ 
              background: 'rgba(22, 33, 62, 0.5)', 
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center',
              py: 2
            }}>
              <Typography variant="h6" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                {posts.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Posts
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ 
              background: 'rgba(22, 33, 62, 0.5)', 
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center',
              py: 2
            }}>
              <Typography variant="h6" sx={{ color: '#EC4899', fontWeight: 700 }}>
                {profile.followers?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Followers
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ 
              background: 'rgba(22, 33, 62, 0.5)', 
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center',
              py: 2
            }}>
              <Typography variant="h6" sx={{ color: '#8B5CF6', fontWeight: 700 }}>
                {profile.following?.length || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Following
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Posts */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#ffffff' }}>
          Posts
        </Typography>
        
        {posts.length === 0 ? (
          <Card sx={{ 
            background: 'rgba(22, 33, 62, 0.5)', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center',
            py: 4
          }}>
            <CameraIcon sx={{ fontSize: 48, color: 'rgba(139, 92, 246, 0.3)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No posts yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isOwnProfile ? 'Start sharing your amazing adventures!' : 'This user hasn\'t posted anything yet.'}
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <PostCard>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={post.image}
                      alt={post.caption}
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      p: 1,
                    }}>
                      <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.8rem' }}>
                        {formatTimestamp(post.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ 
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {post.caption}
                    </Typography>
                  </CardContent>
                </PostCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          color: '#ffffff'
        }}>
          Edit Profile
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={editForm.fullName}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Website"
            value={editForm.website}
            onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
