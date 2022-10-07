import { createAction, createReducer } from "@reduxjs/toolkit";

export const toggleTheme = createAction('theme/toggle');

export const setTheme = createAction('theme/set');

const initialState = "dark";
export default createReducer(initialState, builder => builder
    .addCase(toggleTheme, state => {
        return state === initialState ? 'light' : initialState;
    })
    .addCase(setTheme, (state, action) => {
        return action.payload;
    })
);