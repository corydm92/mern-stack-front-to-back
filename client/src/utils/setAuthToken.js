import axios from 'axios';

const setAuthToken = (token) => {
  // Purpose is to set our x-auth-token to our axios instance on app init and user load,
  // giving us access to restricted routes and persists between reloads
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
