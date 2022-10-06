export const toggleTheme = () => ({type: 'theme/toggle'});

export const setTheme = (theme = 'light') => ({
    type: 'theme/set',
    payload: theme,
})

const initialState = "dark";
export default function reducer(state = initialState, action){
    if(action.type === 'theme/toggle'){
        return state === 'light' ? 'dark' : 'light';
    }
    if(action.type === 'theme/set'){
        return action.payload;
    }
    return state;
};