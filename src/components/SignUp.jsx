import React, { Component } from 'react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { userPool } from '../utils/cognitoSetup';

class SignUp extends Component {
  state = {
    userName: '',
    email: '',
    password: ''
  };

  signUp() {
    const { userName, email, password } = this.state;
    const user: User = {
      username: userName,
      email: email,
      password: password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = { Name: 'email', Value: user.email };
    const that = this;

    attrList.push(new CognitoUserAttribute(emailAttribute));

    userPool.signUp(user.username, user.password, attrList, null, (err, result) => {
      if (err) {
        console.log(err);
        this.props.updateUser();
        return;
      }
      console.log(result);
      that.props.history.push('/login');
    });
    return;
  }

  onSubmit(e) {
    e.preventDefault();
    this.signUp();
  }

  render() {
    const { userName, email, password } = this.state;

    return (
      <div>
        <form onSubmit={e => this.onSubmit(e)}>
          <fieldset>
            <legend>Sign Up:</legend>
            <label htmlFor="userName2">User Name:</label>
            <input
              id="userName2"
              type="text"
              name="userName"
              value={userName}
              onChange={e => this.setState({ userName: e.target.value })}
            />
            <br />
            <label htmlFor="email2">E-Mail:</label>
            <input
              id="email2"
              type="text"
              name="email"
              value={email}
              onChange={e => this.setState({ email: e.target.value })}
            />
            <br />
            <label htmlFor="password2">Password:</label>
            <input
              id="password2"
              type="password"
              name="password"
              value={password}
              onChange={e => this.setState({ password: e.target.value })}
            />
            <br />
            <span>Must contains a Lowercase Letter, Uppercase Letter and Number</span>
            <br />
            <input type="submit" value="Submit" />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SignUp;
