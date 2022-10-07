import { createSlice } from "@reduxjs/toolkit";
import { selectProfile } from "../utils/selectors";
const initialState = {};


function setVoidIfUndefined(draft, freelanceId) {
  if (draft[freelanceId] === undefined) {
    draft[freelanceId] = { status: 'void' };
  }
};

const { actions, reducer } = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetching: {
      prepare: (freelanceId) => ({ payload:{freelanceId} }),
      reducer: (draft, action) => {
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
      },
    },
    resolved: {
      prepare: (freelanceId, data) => ({ payload : {freelanceId, data} }),
      reducer: (draft, action) => {
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
      },
    },
    rejected: {
      prepare: (freelanceId, error) => ({ payload : {freelanceId, error} }),
      reducer: (draft, action) => {
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
      },
    },
  }

})

export function fetchOrUpdateProfile(freelanceId){
  return async (dispatch, getState) => {
    const selectFreelancesById = selectProfile(freelanceId);
    const status = selectFreelancesById(getState()).status;
    if(status === 'pending' || status === 'updating') return;
    dispatch(fetching(freelanceId));
    try {
        const response = await fetch(`http://localhost:8000/freelance?id=${freelanceId}`);
        const data = await response.json();
        dispatch(resolved(freelanceId, data));
    } catch (error) {
        dispatch(rejected(freelanceId, error));
    }
  }
};

export const { fetching, resolved, rejected } = actions;

export default reducer;