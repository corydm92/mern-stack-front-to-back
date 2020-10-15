import { PROFILE_SUCCESS, PROFILE_FAIL } from '../actions/types';

const initialState = {
  skills: [],
  user: null,
  status: null,
  company: null,
  website: null,
  location: null,
  bio: null,
  githubusername: null,
  social: {
    youtube: null,
    facebook: null,
    twitter: null,
    instagram: null,
    linkedin: null,
  },
  experience: [],
  education: [],
  date: null,
};

const profile = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PROFILE_SUCCESS:
      console.log(payload);
    case PROFILE_FAIL:
    default:
      return state;
  }
};

export default profile;
