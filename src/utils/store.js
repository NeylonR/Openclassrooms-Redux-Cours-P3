import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme';
import freelancesReducer from '../features/freelances';
import profileReducer from '../features/profile';
import surveyReducer from '../features/survey'

export default configureStore({
  reducer: {
    theme: themeReducer,
    freelances: freelancesReducer,
    profile: profileReducer,
    survey: surveyReducer
  },
});