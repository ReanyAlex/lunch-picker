import React, { Component } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { BrowserRouter, Route } from 'react-router-dom';
import { userPool } from './utils/cognitoSetup';

import './App.css';
import Header from './components/Header';

import Landing from './components/Landing';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Profile from './components/Profile';

class App extends Component {
  state = {
    userId: null,
    currentLocation: {}
  };

  componentDidMount() {
    this.findUser();
    this.currentLocation();
  }

  currentLocation() {
    navigator.geolocation.getCurrentPosition(location => {
      const currentLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      this.setState({ currentLocation });
    });
  }

  findUser() {
    let userId = null;

    if (userPool.getCurrentUser() !== null) {
      userId = userPool.getCurrentUser().username;
    }

    this.setState({ userId });
  }

  //callback on Landing to update user when logOut
  //find better way
  updateUser() {
    this.findUser();
  }

  logOut() {
    const userName = userPool.getCurrentUser() ? userPool.getCurrentUser().username : '';
    const userData = { Username: userName, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.signOut();
    this.setState({ userId: null });
  }

  render() {
    const userProps = {
      userId: this.state.userId,
      updateUser: this.updateUser.bind(this),
      currentLocation: this.state.currentLocation
    };

    return (
      <BrowserRouter>
        <div>
          <Header logOut={this.logOut.bind(this)} userId={this.state.userId} />
          <Route exact path="/" render={routeProps => <Landing {...routeProps} {...userProps} />} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/profile" render={routeProps => <Profile {...routeProps} {...userProps} />} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
