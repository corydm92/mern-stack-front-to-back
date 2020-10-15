import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSelfProfile } from '../../actions/profile';
import PropTypes from 'prop-types';

const Dashboard = ({ fetchSelfProfile, auth, profile }) => {
  useEffect(() => {
    fetchSelfProfile();
  }, []);
  return <div>Dashboard</div>;
};

Dashboard.propTypes = {
  fetchSelfProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
  fetchSelfProfile: () => dispatch(fetchSelfProfile()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
