import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types';

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const post = await axios.post('/api/users', { name, email, password });
  console.log(post);
};
