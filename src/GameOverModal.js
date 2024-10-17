import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CuteButton = styled(Button)({
  backgroundColor: '#ffcccb',
  borderRadius: '20px',
  color: '#fff',
  fontWeight: 'bold',
  padding: '10px 20px',
  fontSize: '16px',
  '&:hover': {
    backgroundColor: '#ff9999',
  },
});

const CuteDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    borderRadius: '10px', 
    padding: '20px',
    backgroundColor: '#fffaf0', 
  },
});

const GameOverModal = ({ open, onRestart }) => {
  return (
    <CuteDialog open={open} onClose={onRestart}>
      <DialogTitle>
        <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center', color: '#ff6666' }}>
          게임 오버 😢
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" style={{ textAlign: 'center', marginBottom: '20px' }}>
          다시 시작하시겠어요?
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <CuteButton onClick={onRestart} variant="contained">
          다시 시작!
        </CuteButton>
      </DialogActions>
    </CuteDialog>
  );
};

export default GameOverModal;
