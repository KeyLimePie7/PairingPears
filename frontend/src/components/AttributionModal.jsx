import { useAtom } from 'jotai';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { displayAttributionModal } from '../store';

function AttributionModal() {
  const [open, setOpen] = useAtom(displayAttributionModal);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Attribution</DialogTitle>
      <DialogContent>
        <Typography>Byron ANG</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AttributionModal;