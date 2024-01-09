import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axiosInstance from '../service/axiosInterceptor';

function BeAGalleryOwnerDialog() {
  const [open, setOpen] = useState(false);
  const [artGalleryName, setArtGalleryName] = useState('');
  const [artGalleryLocation, setArtGalleryLocation] = useState('');

  const handleSubmit = () => {
    axiosInstance.post('/gallery/create', {
      artGalleryName,
      artGalleryLocation
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(response => {
      console.log(response.data);
      handleClose();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="contained" 
        size="small" 
        sx={{ 
          marginRight: 2, 
          backgroundColor: "#9c27b0",
          color: "white" 
        }} 
        onClick={handleOpen}
      >
        Be a Gallery Owner
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Your Gallery</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="artGalleryName"
            label="Gallery Name"
            type="text"
            fullWidth
            value={artGalleryName}
            onChange={(e) => setArtGalleryName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="artGalleryLocation"
            label="Gallery Location"
            type="text"
            fullWidth
            value={artGalleryLocation}
            onChange={(e) => setArtGalleryLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BeAGalleryOwnerDialog;
