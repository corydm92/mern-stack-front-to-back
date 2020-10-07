import uuid from 'uuid/v4';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuid();
  dispatch({ type: SET_ALERT, payload: { msg, alertType, id } });
  // Having dispatch instead of a blanket return allows us to call multiple actions without needing an intermediary action creator
  setTimeout(() => dispatch(removeAlert(id)), 5000);
};

export const removeAlert = (alertId) => {
  return { type: REMOVE_ALERT, payload: alertId };
};
