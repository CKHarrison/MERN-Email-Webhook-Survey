import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

// fetch user action creator to see if the user is logged in
// when redux thunk sees that fetch user is returning a function it will send a dispatch function
// we can dispatch whenever we want to
export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async (dispatch) => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

// fetching the list of surveys
export const fetchSurveys = () => async (dispatch) => {
  const res = await axios.get('/api/surveys');

  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
