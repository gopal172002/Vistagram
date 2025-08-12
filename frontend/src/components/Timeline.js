import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { postsAPI } from '../services/api';
import CommentSection from './CommentSection';

const PostCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
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

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 400,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
    zIndex: 1,
  },
}));

const ActionButton = styled(IconButton)(({ theme, $active }) => ({
  color: $active ? '#EC4899' : '#E5E7EB',
  backgroundColor: $active ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
  borderRadius: 8,
  padding: 8,
  margin: '0 4px',
  '&:hover': {
    backgroundColor: $active ? 'rgba(236, 72, 153, 0.2)' : 'rgba(139, 92, 246, 0.1)',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
  color: '#E5E7EB',
  backgroundColor: 'transparent',
  borderRadius: 8,
  padding: 8,
  margin: '0 4px',
  '&:hover': {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: '#8B5CF6',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
}));

const Timeline = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user || { username: 'User' };
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      console.log('API Response:', response); // Debug log
      
      // Handle different response structures
      const postsData = response.data?.posts || response.posts || response.data || [];
      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
      setPosts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, currentLikes, isLiked) => {
    try {
      const response = await postsAPI.toggleLike(postId);
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: response.data.post.likes || [],
              likeCount: response.data.likeCount || 0
            }
          : post
      ));
      
      setSnackbar({
        open: true,
        message: response.data.isLiked ? 'Post liked!' : 'Post unliked!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Like error:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update like',
        severity: 'error'
      });
    }
  };

  const handleShare = async (postId) => {
    try {
      const response = await postsAPI.sharePost(postId);
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, shares: response.data.shares }
          : post
      ));
      
      // Copy post URL to clipboard
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      
      setSnackbar({
        open: true,
        message: 'Post shared! Link copied to clipboard.',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to share post',
        severity: 'error'
      });
    }
  };

  const handleSave = async (postId, currentSaves, isSaved) => {
    try {
      const response = await postsAPI.toggleSave(postId);
      
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              saves: response.data.saves || [],
              saveCount: response.data.saveCount || 0
            }
          : post
      ));
      
      setSnackbar({
        open: true,
        message: response.data.isSaved ? 'Post saved!' : 'Post removed from saves!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Save error:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update save',
        severity: 'error'
      });
    }
  };

  const handleCommentAdded = (postId) => {
    // Update comment count for the post
    setPosts(posts.map(post => 
      post._id === postId 
        ? { ...post, commentCount: (post.commentCount || 0) + 1 }
        : post
    ));
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postDate = new Date(timestamp);
    
    // Check if the date is valid
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
          onClick={fetchPosts}
          sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            mb: 2
          }}
        >
          Explore Amazing Places
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover incredible points of interest shared by travelers around the world
        </Typography>
      </Box>

      {Array.isArray(posts) && posts.map((post) => {
        const isLiked = post.likes?.some(like => like === currentUser._id) || false;
        const isSaved = post.saves?.some(save => save === currentUser._id) || false;
        const commentCount = post.comments?.length || post.commentCount || 0;
        const saveCount = post.saves?.length || post.saveCount || 0;
        
        return (
          <PostCard key={post._id} elevation={0}>
            <StyledCardMedia
              image={post.image || 'https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=No+Image'}
              title={post.caption}
            />
            
            <CardContent sx={{ p: 3 }}>
              {/* Post Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    mr: 2,
                    width: 40,
                    height: 40,
                  }}
                >
                  {post.author?.profilePicture ? (
                    <img src={post.author.profilePicture} alt={post.author.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <PersonIcon />
                  )}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#8B5CF6',
                      }
                    }}
                    onClick={() => navigate(`/profile/${post.author?.username || post.username}`)}
                  >
                    {post.author?.username || post.username}
                    {post.author?.isVerified && (
                      <span style={{ color: '#8B5CF6', marginLeft: 4 }}>✓</span>
                    )}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatTimestamp(post.createdAt || post.timestamp)}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<LocationIcon />}
                  label={post.location?.name || "Point of Interest"}
                  size="small"
                  sx={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8B5CF6',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                />
              </Box>

              <Divider sx={{ mb: 2, borderColor: 'rgba(139, 92, 246, 0.2)' }} />

              {/* Caption */}
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2, 
                  lineHeight: 1.6,
                  color: 'text.primary'
                }}
              >
                {post.caption}
              </Typography>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={`#${tag}`}
                      size="small"
                      sx={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        color: '#EC4899',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        '&:hover': {
                          background: 'rgba(236, 72, 153, 0.2)',
                        }
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* View Count */}
              {post.viewCount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ViewIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.viewCount} view{post.viewCount !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}

              {/* Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                    <ActionButton
                      $active={isLiked}
                      onClick={() => handleLike(post._id, post.likes, isLiked)}
                    >
                      {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </ActionButton>
                  </Tooltip>
                  <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
                    {post.likeCount || post.likes?.length || 0}
                  </Typography>

                  <Tooltip title="Comment">
                    <ActionButton>
                      <CommentIcon />
                    </ActionButton>
                  </Tooltip>
                  <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
                    {commentCount}
                  </Typography>

                  <Tooltip title="Share">
                    <ShareButton onClick={() => handleShare(post._id)}>
                      <ShareIcon />
                    </ShareButton>
                  </Tooltip>
                  <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
                    {typeof post.shares === 'number' ? post.shares : (post.shares?.count || 0)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title={isSaved ? 'Remove from saves' : 'Save post'}>
                    <ActionButton
                      $active={isSaved}
                      onClick={() => handleSave(post._id, post.saves, isSaved)}
                    >
                      {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </ActionButton>
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    {saveCount}
                  </Typography>
                </Box>
              </Box>

              {/* Comment Section */}
              <CommentSection 
                postId={post._id} 
                commentCount={commentCount}
                onCommentAdded={() => handleCommentAdded(post._id)}
              />
            </CardContent>
          </PostCard>
        );
      })}

      {posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No posts yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Be the first to share an amazing place!
          </Typography>
        </Box>
      )}

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

export default Timeline;
