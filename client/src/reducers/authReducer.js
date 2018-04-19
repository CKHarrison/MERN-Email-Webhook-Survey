import { FETCH_USER } from '../actions/types';

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      // returns the payload or false if empty string, which happens is user is logged out
      return action.payload || false;
    default:
      return state;
  }
}
