import { createAction, createReducer } from "@reduxjs/toolkit";
import { selectSurvey } from "../utils/selectors";

const initialState = {
    status: 'void',
    data: null,
    error: null,
};

const surveyFetching = createAction('survey/fetching');
const surveyResolved = createAction(
    'survey/resolved',
    (data) => ({ payload: {data}})
);
const surveyRejected = createAction(
    'survey/rejected',
    (error) => ({ payload: {error}})
);

export async function fetchOrUpdateSurvey(dispatch, getState){
    const status = selectSurvey(getState()).status;
    if (status === 'pending' || status === 'updating') {
      return;
    }
    dispatch(surveyFetching());
    try {
      const response = await fetch('http://localhost:8000/survey');
      const data = await response.json();
      dispatch(surveyResolved(data));
    } catch (error) {
      dispatch(surveyRejected(error));
    }
};

export default createReducer(initialState, builder => builder 
    .addCase(surveyFetching, (draft, action) => {
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
    })
    .addCase(surveyResolved, (draft, action) => {
        if(draft.status === 'pending' || draft.status === 'updating'){
            draft.data = action.payload.data;
            draft.status = 'resolved';
            return;
        }
        return;
    })
    .addCase(surveyRejected, (draft, action) => {
        if(draft.status === 'pending' || draft.status === 'updating'){
            draft.error = action.payload.error;
            draft.data = null;
            draft.status = 'rejected';
            return;
        }
        return;
    })
);