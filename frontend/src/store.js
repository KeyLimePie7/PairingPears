import { atom } from 'jotai';
import { GetAllDevelopers, GetAllGroups } from '../wailsjs/go/main/App';

// Initialize atoms with empty arrays
export const developersAtom = atom([]);
export const groupsAtom = atom([]);

export const displayAttributionModal = atom(false);

// Atom to track if data has been loaded
export const dataLoadedAtom = atom(false);

// Function to load initial data from backend
export const loadInitialData = async (setDevelopers, setGroups, setDataLoaded) => {
  try {
    const [devs, grps] = await Promise.all([
      GetAllDevelopers(),
      GetAllGroups()
    ]);
    
    let developersReformatted = [];
    devs?.forEach(dev => developersReformatted.push(dev.name));
    setDevelopers(developersReformatted || []);

    let groupsReformatted = [];
    grps?.forEach(group => {
      let newGrp = {
        name: group.name,
        members: group.members
      }
      groupsReformatted.push(newGrp);
    });
    setGroups(groupsReformatted || []);
    setDataLoaded(true);
  } catch (error) {
    console.error('Failed to load initial data:', error);
    setDevelopers([]);
    setGroups([]);
    setDataLoaded(true);
  }
};