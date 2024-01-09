import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axiosInstance from '../service/axiosInterceptor';

function BeAnArtistDialog() {
  const [open, setOpen] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [speciality, setSpeciality] = useState('');

  const handleSubmit = () => {
    axiosInstance.post('/artist/create', {
      artistName,
      age: parseInt(age, 10),
      gender,
      nationality,
      speciality
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        'Content-Type': 'application/json'
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
        Be an Artist
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Become an Artist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="artistName"
            label="Artist Name"
            type="text"
            fullWidth
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="age"
            label="Age"
            type="number"
            fullWidth
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <TextField
            margin="dense"
            id="gender"
            label="Gender"
            type="text"
            fullWidth
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
          <TextField
            margin="dense"
            id="nationality"
            label="Nationality"
            type="text"
            fullWidth
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />
          <TextField
            margin="dense"
            id="speciality"
            label="Speciality"
            type="text"
            fullWidth
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
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

export default BeAnArtistDialog;
