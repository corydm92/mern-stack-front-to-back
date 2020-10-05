import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (alert) => {
  return { type: SET_ALERT, payload: alert };
};

export const removeAlert = (alertId) => {
  return { type: REMOVE_ALERT, payload: alertId };
};
