import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme';
import freelancesReducer from '../features/freelances';
import profileReducer from '../features/profile';

export default configureStore({
  reducer: {
    theme: themeReducer,
    freelances: freelancesReducer,
    profile: profileReducer,
  },
})