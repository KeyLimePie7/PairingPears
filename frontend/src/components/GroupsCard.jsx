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
  Box,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDroppable } from '@dnd-kit/core';
import { groupsAtom, developersAtom } from '../store';
import AddGroupModal from './AddGroupModal';

function GroupCard({ group, groupIndex, onDeleteGroup, onRemoveMember }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `group-${groupIndex}`,
    data: {
      groupIndex
    }
  });

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {group.name}
          </Typography>
          <IconButton 
            size="small"
            onClick={onDeleteGroup}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          ref={setNodeRef}
          sx={{
            minHeight: '60px',
            backgroundColor: isOver ? '#e3f2fd' : 'transparent',
            borderRadius: 1,
            p: 1,
            border: isOver ? '2px dashed #1976d2' : '2px dashed transparent',
            transition: 'all 0.2s'
          }}
        >
          <Grid container spacing={1}>
            {group.members.map((member, memberIndex) => (
              <Grid item xs={12} key={memberIndex}>
                <Card variant="outlined" sx={{ backgroundColor: '#fafafa' }}>
                  <CardContent sx={{ py: 0.5, '&:last-child': { pb: 0.5 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">
                        {member}
                      </Typography>
                      <IconButton 
                        size="small"
                        onClick={() => onRemoveMember(memberIndex)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

function GroupsCard() {
  const [groups, setGroups] = useAtom(groupsAtom);
  const [developers] = useAtom(developersAtom);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteGroup = (indexToDelete) => {
    setGroups(groups.filter((_, index) => index !== indexToDelete));
  };

  const handleRemoveMember = (groupIndex, memberIndex) => {
    const updatedGroups = [...groups];
    updatedGroups[groupIndex].members = updatedGroups[groupIndex].members.filter(
      (_, index) => index !== memberIndex
    );
    setGroups(updatedGroups);
  };

  const handleAutoAssign = () => {
    if (groups.length === 0) {
      return;
    }

    // Get all developers that are already assigned to any group
    const assignedDevelopers = new Set();
    groups.forEach(group => {
      group.members.forEach(member => {
        assignedDevelopers.add(member);
      });
    });

    // Get unassigned developers
    const unassignedDevelopers = developers.filter(dev => !assignedDevelopers.has(dev));

    if (unassignedDevelopers.length === 0) {
      return;
    }

    // Shuffle the unassigned developers randomly using Fisher-Yates algorithm
    const shuffled = [...unassignedDevelopers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Create a copy of groups to modify
    const updatedGroups = groups.map(group => ({ 
      ...group, 
      members: [...group.members] 
    }));

    // Distribute developers one by one, always adding to the group with fewest members
    shuffled.forEach(developer => {
      // Find the group with the smallest number of members
      let minIndex = 0;
      let minCount = updatedGroups[0].members.length;
      
      for (let i = 1; i < updatedGroups.length; i++) {
        if (updatedGroups[i].members.length < minCount) {
          minCount = updatedGroups[i].members.length;
          minIndex = i;
        }
      }
      
      updatedGroups[minIndex].members.push(developer);
    });

    setGroups(updatedGroups);
  };

  const handleClearDevs = () => {
    // Remove all members from all groups
    const updatedGroups = groups.map(group => ({
      ...group,
      members: []
    }));
    setGroups(updatedGroups);
  };

  // Check if any group has members
  const hasAnyMembers = groups.some(group => group.members.length > 0);

  return (
    <>
      <Card>
      {/* <Card sx={{ minHeight: '400px' }}> */}
        <CardHeader title="Groups" />
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
            fullWidth 
            onClick={handleAutoAssign}
            sx={{ mb: 2 }}
            disabled={groups.length === 0 || developers.length === 0}
          >
            Auto-Assign Devs
          </Button>

          <Button 
            variant="outlined" 
            color="error"
            fullWidth 
            onClick={handleClearDevs}
            sx={{ mb: 3 }}
            disabled={!hasAnyMembers}
          >
            Clear Devs
          </Button>

          <Grid container spacing={2}>
            {groups.map((group, groupIndex) => (
              <Grid item xs={12} sm={6} md={4} key={groupIndex}>
                <GroupCard
                  group={group}
                  groupIndex={groupIndex}
                  onDeleteGroup={() => handleDeleteGroup(groupIndex)}
                  onRemoveMember={(memberIndex) => handleRemoveMember(groupIndex, memberIndex)}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <AddGroupModal open={openModal} onClose={handleCloseModal} />
    </>
  );
}

export default GroupsCard;