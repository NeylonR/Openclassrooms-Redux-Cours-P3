import { createSlice } from "@reduxjs/toolkit";

const initialState = "dark";

const { actions, reducer } = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        toggle: state => {
            return state === initialState ? 'light' : initialState;
        },
        set: (state, action) => {
            return action.payload;
        },
    },
});

export const { set, toggle } = actions;

export default reducer;