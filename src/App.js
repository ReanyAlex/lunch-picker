import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header';

import Landing from './components/Landing';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={LogIn} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
