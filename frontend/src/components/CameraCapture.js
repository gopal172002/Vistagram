import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  PhotoCamera as PhotoCameraIcon,
  FlipCameraAndroid as FlipCameraIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Webcam from 'react-webcam';
import { postsAPI } from '../services/api';

const CaptureCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
}));

const CameraContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 16,
  overflow: 'hidden',
  background: '#000',
  '& video': {
    borderRadius: 16,
  },
}));

const CaptureButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  color: '#ffffff',
  borderRadius: 50,
  width: 80,
  height: 80,
  minWidth: 'unset',
  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    boxShadow: '0 6px 25px rgba(139, 92, 246, 0.5)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.3s ease',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'rgba(139, 92, 246, 0.1)',
  color: '#8B5CF6',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: 12,
  padding: '10px 20px',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
    border: '1px solid rgba(139, 92, 246, 0.5)',
  },
  transition: 'all 0.3s ease',
}));

const CameraCapture = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('user');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.username || 'User';
  });

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode,
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setCaption('');
  };

  const flipCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  const handleSubmit = async () => {
    if (!capturedImage || !caption.trim()) {
      setSnackbar({
        open: true,
        message: 'Please capture an image and add a caption',
        severity: 'error'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Convert base64 to blob
      const base64Data = capturedImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      formData.append('username', currentUser);
      formData.append('caption', caption.trim());

      // Upload to backend using the API service
      await postsAPI.createPost({
        image: capturedImage, // For now, we'll use the base64 directly
        caption: caption.trim()
      });

      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success'
      });

      // Navigate back to timeline after a short delay
      setTimeout(() => {
        navigate('/app');
      }, 1500);

    } catch (err) {
      console.error('Error creating post:', err);
      setSnackbar({
        open: true,
        message: 'Failed to create post. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

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
          Capture Your Adventure
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Take a photo of an amazing place and share it with the world
        </Typography>
      </Box>

      <CaptureCard elevation={0}>
        <CardContent sx={{ p: 4 }}>
          {!capturedImage ? (
           
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CameraIcon sx={{ fontSize: 28, color: '#8B5CF6', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Camera
                </Typography>
                <Chip
                  icon={<LocationIcon />}
                  label="Point of Interest"
                  size="small"
                  sx={{
                    ml: 'auto',
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: '#8B5CF6',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                />
              </Box>

              <CameraContainer>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={{ width: '100%', height: 'auto' }}
                />
                
             
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Tooltip title="Flip Camera">
                    <IconButton
                      onClick={flipCamera}
                      sx={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#ffffff',
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.7)',
                        },
                      }}
                    >
                      <FlipCameraIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CameraContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <CaptureButton onClick={capture}>
                  <PhotoCameraIcon sx={{ fontSize: 32 }} />
                </CaptureButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <ActionButton onClick={() => navigate('/')}>
                  Cancel
                </ActionButton>
              </Box>
            </Box>
          ) : (
            // Preview and Caption
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PhotoCameraIcon sx={{ fontSize: 28, color: '#8B5CF6', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Preview & Caption
                </Typography>
                <IconButton
                  onClick={retake}
                  sx={{ ml: 'auto', color: '#E5E7EB' }}
                >
                  <RefreshIcon />
                </IconButton>
              </Box>

              <Box sx={{ position: 'relative', mb: 3 }}>
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 16,
                    maxHeight: 400,
                    objectFit: 'cover',
                  }}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="What's amazing about this place?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share your experience and what makes this place special..."
                variant="outlined"
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(139, 92, 246, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#8B5CF6',
                    },
                  },
                }}
                inputProps={{
                  maxLength: 500,
                }}
                helperText={`${caption.length}/500 characters`}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <ActionButton onClick={retake}>
                  Retake Photo
                </ActionButton>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !caption.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(139, 92, 246, 0.3)',
                    },
                  }}
                >
                  {loading ? 'Posting...' : 'Share Post'}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </CaptureCard>

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

export default CameraCapture;
