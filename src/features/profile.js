import { createAction, createReducer } from "@reduxjs/toolkit";
import { selectProfile } from "../utils/selectors";
const initialState = {};

const profileFetching = createAction(
  'profile/fetching' , 
  (freelanceId) => ({ payload:{freelanceId} })
);
const profileResolved = createAction(
  'profile/resolved', 
  (freelanceId, data) => ({ payload : {freelanceId, data} })
);
const profileRejected = createAction(
  'profile/rejected', 
  (freelanceId, error) => ({ payload: {freelanceId, error} })
);

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
};

function setVoidIfUndefined(draft, freelanceId) {
  if (draft[freelanceId] === undefined) {
    draft[freelanceId] = { status: 'void' };
  }
};

export default createReducer(initialState, builder => builder
  .addCase(profileFetching, (draft, action) => {
    const {freelanceId} = action.payload;
    setVoidIfUndefined(draft, freelanceId);
    if (draft[freelanceId].status === 'void') {
      draft[freelanceId].status = 'pending';
      return;
    }
    if (draft[freelanceId].status === 'rejected') {
      draft[freelanceId].error = null;
      draft[freelanceId].status = 'pending';
      return;
    }
    if (draft[freelanceId].status === 'resolved') {
      draft[freelanceId].status = 'updating';
      return;
    }
    return;
  })
  .addCase(profileResolved, (draft, action) => {
    const {freelanceId, data} = action.payload;
    setVoidIfUndefined(draft, freelanceId);
    if (
      draft[freelanceId].status === 'pending' ||
      draft[freelanceId].status === 'updating'
    ) {
      draft[freelanceId].data = data;
      draft[freelanceId].status = 'resolved';
      return;
    }
    return;
  })
  .addCase(profileRejected, (draft, action) => {
    const {freelanceId, error} = action.payload;
    setVoidIfUndefined(draft, freelanceId);
    if (
      draft[freelanceId].status === 'pending' ||
      draft[freelanceId].status === 'updating'
    ) {
      draft[freelanceId].error = error;
      draft[freelanceId].data = null;
      draft[freelanceId].status = 'rejected';
      return;
    }
    return;
  })
);