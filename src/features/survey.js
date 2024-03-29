import { createSlice} from "@reduxjs/toolkit";
import { selectSurvey } from "../utils/selectors";

const initialState = {
    status: 'void',
    data: null,
    error: null,
};

const { actions, reducer } = createSlice({
    name: 'survey',
    initialState: initialState,
    reducers: {
        fetching: (draft, action) => {
            if(draft.status === 'void'){
                draft.status = 'pending';
                return
            };
            if(draft.status === 'rejected'){
                draft.error = null;
                draft.status = 'pending';
                return
            };
            if(draft.status === 'resolved'){
                draft.status = 'updating';
                return
            };
            return;
        },
        resolved: {
            prepare: (data) => ({ payload: {data}}),
            reducer: (draft, action) => {
                if(draft.status === 'pending' || draft.status === 'updating'){
                    draft.data = action.payload.data;
                    draft.status = 'resolved';
                    return;
                }
                return;
            },
        },
        rejected: {
            prepare: (error) => ({ payload: {error}}),
            reducer: (draft, action) => {
                if(draft.status === 'pending' || draft.status === 'updating'){
                    draft.error = action.payload.error;
                    draft.data = null;
                    draft.status = 'rejected';
                    return;
                }
                return;
            },
        },
    }
})

export async function fetchOrUpdateSurvey(dispatch, getState){
    const status = selectSurvey(getState()).status;
    if (status === 'pending' || status === 'updating') {
      return;
    }
    dispatch(fetching());
    try {
      const response = await fetch('http://localhost:8000/survey');
      const data = await response.json();
      dispatch(resolved(data));
    } catch (error) {
      dispatch(rejected(error));
    }
};

const { fetching, resolved, rejected } = actions;

export default reducer;