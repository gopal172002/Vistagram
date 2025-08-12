import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { postsAPI } from '../services/api';

const ApiTest = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.getPosts();
      console.log('Full API Response:', response);
      setApiResponse(response);
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message || 'API test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#8B5CF6' }}>
        API Response Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testApi}
        disabled={loading}
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
        }}
      >
        {loading ? 'Testing...' : 'Test API Response'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {apiResponse && (
        <Paper sx={{ p: 3, background: 'rgba(139, 92, 246, 0.05)' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#8B5CF6' }}>
            API Response Structure:
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Success:</strong> {apiResponse.success ? 'Yes' : 'No'}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Posts Count:</strong> {apiResponse.data?.posts?.length || 0}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Total Posts:</strong> {apiResponse.data?.total || 0}
          </Typography>

          {apiResponse.data?.posts?.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#EC4899' }}>
                First Post Structure:
              </Typography>
              <Paper sx={{ p: 2, background: 'rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="body2" component="pre" sx={{ 
                  fontSize: '12px', 
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {JSON.stringify(apiResponse.data.posts[0], null, 2)}
                </Typography>
              </Paper>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ApiTest;
