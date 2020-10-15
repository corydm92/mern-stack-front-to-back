import { PROFILE_SUCCESS, PROFILE_FAIL } from './types';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchSelfProfile = () => async (dispatch) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/profile/me`);

    console.log(res);
    console.log('here');

    dispatch({ type: PROFILE_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: PROFILE_FAIL });
  }
};
