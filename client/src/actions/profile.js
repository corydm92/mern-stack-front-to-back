import { PROFILE_SUCCESS, PROFILE_FAIL } from './types';
import { setAlert } from './alert';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchSelfProfile = () => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/profile/me`);

    console.log(res);
    console.log('here');

    dispatch({ type: PROFILE_SUCCESS, payload: res.data });
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err.response);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: PROFILE_FAIL });
  }
};
