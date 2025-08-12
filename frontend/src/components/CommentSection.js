import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { postsAPI } from '../services/api';

const CommentContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(139, 92, 246, 0.05)',
  borderRadius: 12,
  border: '1px solid rgba(139, 92, 246, 0.1)',
}));

const CommentItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: 8,
  border: '1px solid rgba(139, 92, 246, 0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
  },
}));

const CommentSection = ({ postId, commentCount = 0, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user || {};
  });

  useEffect(() => {
    if (expanded && comments.length === 0) {
      fetchComments();
    }
  }, [expanded, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.getComments(postId);
      setComments(response.data.comments || []);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await postsAPI.addComment(postId, newComment.trim());
      
      // Add new comment to the list
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
      
      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const commentDate = new Date(timestamp);
    
    if (isNaN(commentDate.getTime())) {
      return 'Just now';
    }
    
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return commentDate.toLocaleDateString();
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <CommentContainer>
      {/* Comment Count and Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ cursor: 'pointer' }}
          onClick={toggleExpanded}
        >
          {commentCount} comment{commentCount !== 1 ? 's' : ''}
        </Typography>
        {commentCount > 0 && (
          <IconButton 
            size="small" 
            onClick={toggleExpanded}
            sx={{ color: '#8B5CF6' }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {/* Add Comment Form */}
      <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            }}
          >
            {currentUser.username?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(139, 92, 246, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(139, 92, 246, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#8B5CF6',
                },
              },
              '& .MuiInputBase-input': {
                color: 'text.primary',
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!newComment.trim() || submitting}
            sx={{
              minWidth: 'auto',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              '&:disabled': {
                background: 'rgba(139, 92, 246, 0.3)',
              },
            }}
          >
            {submitting ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <SendIcon />
            )}
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Comments List */}
      <Collapse in={expanded}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
          </Box>
        ) : (
          <Box>
            {comments.map((comment) => (
              <CommentItem key={comment._id}>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    }}
                  >
                    {comment.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        {comment.author?.username || 'Unknown User'}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                      >
                        {formatTimestamp(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.primary',
                        lineHeight: 1.4,
                        mb: 1
                      }}
                    >
                      {comment.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <FavoriteBorderIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" color="text.secondary">
                        {comment.likes?.length || 0}
                      </Typography>
                      <IconButton size="small" sx={{ color: 'text.secondary' }}>
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="caption" color="text.secondary">
                        Reply
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CommentItem>
            ))}
            
            {comments.length === 0 && commentCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>
        )}
      </Collapse>
    </CommentContainer>
  );
};

export default CommentSection;

