import { useState } from 'react';
import { useAtom } from 'jotai';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { developersAtom } from '../store';

function AddDeveloperModal({ open, onClose }) {
  const [developers, setDevelopers] = useAtom(developersAtom);
  const [newDeveloperName, setNewDeveloperName] = useState('');

  const handleAdd = () => {
    if (newDeveloperName.trim()) {
      // const newDeveloper = {
      //   id: Date.now() + Math.floor(Math.random() * 1000000), // Temporary ID until saved to backend
      //   name: newDeveloperName.trim()
      // };
      // setDevelopers([...developers, newDeveloper]);
      setDevelopers([...developers, newDeveloperName.trim()]);
      setNewDeveloperName('');
      onClose();
    }
  };

  const handleClose = () => {
    setNewDeveloperName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Developer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Developer Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newDeveloperName}
          onChange={(e) => setNewDeveloperName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddDeveloperModal;