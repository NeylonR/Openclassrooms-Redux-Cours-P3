import produce from "immer";
import { selectProfile } from "../utils/selectors";
const initialState = {
    
}

const FETCHING = 'profile/fetching';
const RESOLVED = 'profile/resolved';
const REJECTED = 'profile/rejected';

const profileFetching = (freelanceId) => ({ 
    type: FETCHING, 
    payload: { freelanceId} 
});
const profileResolved = (freelanceId, data) => ({ 
    type: RESOLVED, 
    payload: {freelanceId, data}
});
const profileRejected = (freelanceId, error) => ({ 
    type: REJECTED, 
    payload: {freelanceId, error}
});


export async function fetchOrUpdateProfile(store, freelanceId){
    const selectFreelancesById = selectProfile(freelanceId);
    const status = selectFreelancesById(store.getState()).status;
    if(status === 'pending' || status === 'updating') return;
    store.dispatch(profileFetching(freelanceId));
    try {
        const response = await fetch(`http://localhost:8000/freelance?id=${freelanceId}`);
        const data = await response.json();
        store.dispatch(profileResolved(freelanceId, data));
    } catch (error) {
        store.dispatch(profileRejected(freelanceId, error));
    }
    
}
export default function profileReducer(state = initialState, action) {
    const { type, payload } = action
    return produce(state, (draft) => {
      // si l'action est une des action de freelance
      if (type === RESOLVED || type === FETCHING || type === REJECTED) {
        // on vérifie que le state contient la propriété correspondante à l'Id du freelance
        if (draft[payload.freelanceId] === undefined) {
          // si elle n'existe pas, on l'initialise avec void
          draft[payload.freelanceId] = { status: 'void' }
        }
      }
      switch (type) {
        case FETCHING: {
          if (draft[payload.freelanceId].status === 'void') {
            draft[payload.freelanceId].status = 'pending'
            return
          }
          if (draft[payload.freelanceId].status === 'rejected') {
            draft[payload.freelanceId].error = null
            draft[payload.freelanceId].status = 'pending'
            return
          }
          if (draft[payload.freelanceId].status === 'resolved') {
            draft[payload.freelanceId].status = 'updating'
            return
          }
          return
        }
        case RESOLVED: {
          if (
            draft[payload.freelanceId].status === 'pending' ||
            draft[payload.freelanceId].status === 'updating'
          ) {
            draft[payload.freelanceId].data = payload.data
            draft[payload.freelanceId].status = 'resolved'
            return
          }
          return
        }
        case REJECTED: {
          if (
            draft[payload.freelanceId].status === 'pending' ||
            draft[payload.freelanceId].status === 'updating'
          ) {
            draft[payload.freelanceId].error = payload.error
            draft[payload.freelanceId].data = null
            draft[payload.freelanceId].status = 'rejected'
            return
          }
          return
        }
        default:
          return
      }
    })
  }