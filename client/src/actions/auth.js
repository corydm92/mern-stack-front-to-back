import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
} from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${BASE_URL}/api/auth`);

    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = (name, email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      `${BASE_URL}/api/users`,
      {
        name,
        email,
        password,
      },
      config
    );

    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(
      `${BASE_URL}/api/auth`,
      {
        email,
        password,
      },
      config
    );

    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({ type: LOGIN_FAIL });
  }
};
