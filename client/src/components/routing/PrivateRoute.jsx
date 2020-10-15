import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  // x : y is not destructuring, simply renaming convention.
  // Adding brackets causes destructure (auth).
  component: Component,
  auth: { isAuthenticated, loading },
  // Spread of props (rest) can only be done as the last element.
  // Pulls out all other properties not defined above.
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, {})(PrivateRoute);
