export const selectTheme = state => state.theme;

export const selectFreelances = state => state.freelances;

export const selectProfile = (freelanceId) => (state) => {
    return state.profile[freelanceId] ?? {status:'void'}
};
export const selectSurvey = state => state.survey;