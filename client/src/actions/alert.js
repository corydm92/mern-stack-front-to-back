import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => (disaptch) => {
  const id = uuid.v4();
  disaptch({ type: SET_ALERT, payload: { msg, alertType, id } });
};

export const removeAlert = (alertId) => {
  return { type: REMOVE_ALERT, payload: alertId };
};
