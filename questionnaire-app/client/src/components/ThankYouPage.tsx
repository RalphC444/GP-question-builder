import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface ThankYouPageProps {
  onNewScreener: () => void;
}

export function ThankYouPage({ onNewScreener }: ThankYouPageProps) {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your screener has been submitted successfully.  We will review your screener and get back to you soon.
        </Typography>
      </Paper>
      <Button
          variant="contained"
          color="primary"
          onClick={onNewScreener}
          sx={{ mt: 2 }}
        >
          restart flow
        </Button>
    </Box>
  );
} 