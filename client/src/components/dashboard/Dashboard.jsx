import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchSelfProfile } from '../../actions/profile';

const Dashboard = ({ fetchSelfProfile }) => {
  useEffect(() => {
    fetchSelfProfile();
  }, []);
  return <div>Dashboard</div>;
};

const mapDispatchToProps = (dispatch) => ({
  fetchSelfProfile: () => dispatch(fetchSelfProfile()),
});

export default connect(null, mapDispatchToProps)(Dashboard);
