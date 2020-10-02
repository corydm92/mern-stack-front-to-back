import React from 'react';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => (
  <Router>
    <React.Fragment>
      <Navbar />
      <Route exact path='/' render={() => <Landing />} />
      <section className='container'>
        <Switch>
          <Route exact path='/register' render={() => <Register />} />
          <Route exact path='/login' render={() => <Login />} />
        </Switch>
      </section>
    </React.Fragment>
  </Router>
);

export default App;
