import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axiosInstance from '../service/axiosInterceptor';

const AddWorkshopDialog = ({ open, onClose, onWorkshopAdded }) => {
  const [workshopDetails, setWorkshopDetails] = useState({
    workshopDescription: '',
    dateTime: new Date(),
    duration: '',
    mediumId: '',
    price: '',
    capacity: '',
    title: '',
    workshopType: '',
  });

  const handleChange = (field) => (event) => {
    setWorkshopDetails({ ...workshopDetails, [field]: event.target.value });
  };

  const handleSubmit = () => {
    const requestData = {
      ...workshopDetails,
      dateTime: workshopDetails.dateTime.toISOString(),
    };
  
    axiosInstance.post('/workshop/create', requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    .then(response => {
      onClose();
      if (onWorkshopAdded) {
        onWorkshopAdded();
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Workshop</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          margin="dense"
          value={workshopDetails.title}
          onChange={handleChange('title')}
        />
        <TextField
          label="Description"
          fullWidth
          margin="dense"
          value={workshopDetails.workshopDescription}
          onChange={handleChange('workshopDescription')}
          multiline
          rows={4}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Date & Time"
            value={workshopDetails.dateTime}
            onChange={handleChange('dateTime')}
            renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
          />
        </LocalizationProvider>
        <TextField
          label="Duration (minutes)"
          fullWidth
          margin="dense"
          value={workshopDetails.duration}
          onChange={handleChange('duration')}
        />
        <TextField
          label="Medium ID"
          fullWidth
          margin="dense"
          value={workshopDetails.mediumId}
          onChange={handleChange('mediumId')}
        />
        <TextField
          label="Price"
          fullWidth
          margin="dense"
          value={workshopDetails.price}
          onChange={handleChange('price')}
        />
        <TextField
          label="Capacity"
          fullWidth
          margin="dense"
          value={workshopDetails.capacity}
          onChange={handleChange('capacity')}
        />
        <TextField
          select
          label="Workshop Type"
          fullWidth
          margin="dense"
          value={workshopDetails.workshopType}
          onChange={handleChange('workshopType')}
        >
          <MenuItem value="WEB">WEB</MenuItem>
          <MenuItem value="TUT">TUT</MenuItem>
          <MenuItem value="WRK">WRK</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkshopDialog;
