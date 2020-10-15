import { PROFILE_SUCCESS, PROFILE_FAIL } from '../actions/types';

const initialState = {
  // skills: [],
  // user: null,
  // status: null,
  // company: null,
  // website: null,
  // location: null,
  // bio: null,
  // githubusername: null,
  // social: {
  //   youtube: null,
  //   facebook: null,
  //   twitter: null,
  //   instagram: null,
  //   linkedin: null,
  // },
  // experience: [],
  // education: [],
  // date: null,
  profile: null,
  profiles: [],
  repos: [],
  loading: [],
  error: {},
};

const profile = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PROFILE_SUCCESS:
      return { ...state, profile: payload, loading: false };
    case PROFILE_FAIL:
      return { ...state, error: payload, loading: false };
    default:
      return state;
  }
};

export default profile;
