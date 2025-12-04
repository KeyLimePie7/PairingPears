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
import { groupsAtom } from '../store';

function AddGroupModal({ open, onClose }) {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [newGroupName, setNewGroupName] = useState('');

  const handleAdd = () => {
    if (newGroupName.trim()) {
      setGroups([...groups, { name: newGroupName.trim(), members: [] }]);
      setNewGroupName('');
      onClose();
    }
  };

  const handleClose = () => {
    setNewGroupName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
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

export default AddGroupModal;