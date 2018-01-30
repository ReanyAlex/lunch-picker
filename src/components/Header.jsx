import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <nav>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </nav>
    );
  }
}

export default Header;
