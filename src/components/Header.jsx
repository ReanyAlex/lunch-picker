import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

const Nav = styled.nav`
  min-width: 320px;
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
  background-color: #ffcb16;
  border-bottom: 1px solid lightgray;
  margin-bottom: 2rem;
`;
const HeaderItem = styled.span`
  color: gray;
  font-size: 1.25rem;
  padding-left: 10px;
  &:hover {
    color: white;
  }
`;

const UserHeader = styled.span`
  color: #e20100;
  font-size: 1.25rem;
  padding-left: 10px;
`;

const HeaderLogo = styled.span`
  padding-left: 0.5rem;
  color: #e20100;
  font-size: 1.5rem;
  font-weight: 500;
  &:hover {
    color: white;
  }
  @media only screen and (min-width: 576px) {
    font-size: 1.75rem;
  }
`;

class Header extends Component {
  renderNav() {
    const { userId } = this.props;
    return userId === null ? (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="/signup" className="nav-link ">
            <HeaderItem>Sign Up</HeaderItem>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link ">
            <HeaderItem>Log In</HeaderItem>
          </Link>
        </li>
      </ul>
    ) : (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <span className="nav-link">
            <UserHeader>{`Welcome ${userId}`}</UserHeader>
          </span>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link ">
            <HeaderItem>Profile</HeaderItem>
          </Link>
        </li>
        <li className="nav-item">
          <span className="nav-link">
            <HeaderItem onClick={() => this.props.logOut()}>Log Out</HeaderItem>
          </span>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <Nav className="navbar navbar-expand-md navbar-light">
        <Link className="navbar-brand" to="/">
          <HeaderLogo>Lunch Picker</HeaderLogo>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {this.renderNav()}
        </div>
      </Nav>
    );
  }
}

export default Header;
