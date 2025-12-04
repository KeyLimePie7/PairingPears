import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import DevelopersCard from './components/DevelopersCard';
import GroupsCard from './components/GroupsCard';
import { developersAtom, groupsAtom, dataLoadedAtom, loadInitialData, displayAttributionModal } from './store';
import { 
  ClearAllDevelopers, 
  ClearAllGroups, 
  AddDeveloper, 
  AddGroup, 
  UpdateGroup 
} from '../wailsjs/go/main/App';
import AttributionModal from './components/AttributionModal';
import PairingPearsIcon from './assets/PairingPearsIcon.png'

function App() {
  const [developers, setDevelopers] = useAtom(developersAtom);
  const [groups, setGroups] = useAtom(groupsAtom);
  const [dataLoaded, setDataLoaded] = useAtom(dataLoadedAtom);
  const [activeDeveloper, setActiveDeveloper] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const setAttributionOpen = useSetAtom(displayAttributionModal);

  // Load data from backend on startup
  useEffect(() => {
    if (!dataLoaded) {
      loadInitialData(setDevelopers, setGroups, setDataLoaded);
    }
  }, [dataLoaded, setDevelopers, setGroups, setDataLoaded]);

  const handleSave = async () => {
    try {
      // Clear existing data
      await ClearAllDevelopers();
      await ClearAllGroups();

      // Save all developers
      for (const dev of developers) {
        await AddDeveloper(dev);
      }

      // Save all groups
      for (const group of groups) {
        const newGroup = await AddGroup(group.name);
        // Update with members (convert names to IDs if needed)
        await UpdateGroup(newGroup.id, group.name, group.members);
      }

      setSnackbar({ open: true, message: 'Saved successfully!', severity: 'success' });
    } catch (error) {
      console.error('Failed to save:', error);
      setSnackbar({ open: true, message: 'Failed to save data', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDeveloper(active.data.current.developer);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDeveloper(null);

    if (!over) {
      return;
    }

    // Check if dropped over a group
    if (over.id.toString().startsWith('group-')) {
      const groupIndex = over.data.current.groupIndex;
      const developerName = active.data.current.developer;

      // Check if developer is already in this group
      if (groups[groupIndex].members.includes(developerName)) {
        return;
      }

      // Add developer to group
      const updatedGroups = [...groups];
      updatedGroups[groupIndex].members.push(developerName);
      setGroups(updatedGroups);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <AppBar position="static">
          <Toolbar>
            {/* <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Pairing Pears
            </Typography> */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img 
                src={PairingPearsIcon} 
                alt="Pairing Pears Icon" 
                style={{ height: '40px', marginRight: '12px', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => setAttributionOpen(true)}
              />
              <Typography variant="h5" component="div">
                Pairing Pears
              </Typography>
            </Box>
            <Button 
              color="inherit" 
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Left side - Developers */}
            <Grid item xs={12} md={3}>
              <DevelopersCard />
            </Grid>

            {/* Right side - Groups */}
            <Grid item xs={12} md={9}>
              <GroupsCard />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <DragOverlay>
        {activeDeveloper ? (
          <Box
            sx={{
              p: 1,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: 1,
              boxShadow: 3
            }}
          >
            <Typography>{activeDeveloper}</Typography>
          </Box>
        ) : null}
      </DragOverlay>

      <AttributionModal />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DndContext>
  );
}

export default App;