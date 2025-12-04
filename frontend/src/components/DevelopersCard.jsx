import { useState } from 'react';
import { useAtom } from 'jotai';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Grid,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDraggable } from '@dnd-kit/core';
import { developersAtom } from '../store';
import AddDeveloperModal from './AddDeveloperModal';

function DeveloperCard({ developer, index, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `dev-${index}`,
    data: {
      // developer: developer.name,
      developer,
      index
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <Card 
      ref={setNodeRef}
      variant="outlined"
      sx={{
        ...style,
        cursor: isDragging ? 'grabbing' : 'grab',
        backgroundColor: 'white',
      }}
      {...listeners}
      {...attributes}
    >
      <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1">
            {/* {developer.name} */}
            {developer}
          </Typography>
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

function DevelopersCard() {
  const [developers, setDevelopers] = useAtom(developersAtom);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteDeveloper = (indexToDelete) => {
    setDevelopers(developers.filter((_, index) => index !== indexToDelete));
  };

  const handleClearAll = () => {
    setDevelopers([]);
  };

  return (
    <>
      <Card>
        <CardHeader title="Developers" />
        <CardContent>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleOpenModal}
            sx={{ mb: 2 }}
          >
            Add
          </Button>

          <Button 
            variant="outlined" 
            color="error"
            fullWidth 
            onClick={handleClearAll}
            sx={{ mb: 2 }}
            disabled={developers.length === 0}
          >
            Clear All
          </Button>

          <Grid container spacing={1}>
            {developers.map((dev, index) => (
              <Grid item xs={12} key={index}>
                <DeveloperCard 
                  developer={dev}
                  index={index}
                  onDelete={() => handleDeleteDeveloper(index)}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <AddDeveloperModal open={openModal} onClose={handleCloseModal} />
    </>
  );
}

export default DevelopersCard;