import { useEffect, useReducer } from 'react'

function fetchReducer(state, action){
  if(action.type === 'fetching'){
    return { ...state, isLoading: true };
  }
  if(action.type === 'resolved'){
    return { ...state, isLoading: false, data: action.payload, error: null}
  }
  if(action.type === 'rejected'){
    return { ...state, isLoading: false, data: null, error: action.payload}
  }
}
export function useFetch(url) {
  const [state, dispatch] = useReducer(fetchReducer, {
    isLoading: true,
    data: null,
    error: null
  });
  const { isLoading, data, error } = state;

  useEffect(() => {
    if (!url) return
    dispatch({ type: 'fetching'});
    async function fetchData() {
      try {
        const response = await fetch(url)
        const data = await response.json()
        dispatch({ type: 'resolved', payload: data });
      } catch (err) {
        console.log(err)
        dispatch({ type: 'rejected', payload: err });
      }
    }
    fetchData()
  }, [url])
  return { isLoading, data, error }
}