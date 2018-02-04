import React, { Component } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { userPool } from '../utils/cognitoSetup';
import { AWSURL } from '../utils/cognitoSetup';

import axios from 'axios';

class LogIn extends Component {
  state = {
    userName: '',
    password: '',
    confirmationCode: '',
    needConfirmation: false
  };

  logIn() {
    const { userName, password } = this.state;

    const authData = {
      Username: userName,
      Password: password
    };

    const authDetails = new AuthenticationDetails(authData);

    const userData = { Username: userName, Pool: userPool };

    const cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.authenticateUser(authDetails, {
      onSuccess(result) {
        console.log(result);

        that.props.history.push('/');
      },
      onFailure(err) {
        console.log(err);
        if (err.message === 'User is not confirmed.') {
          that.setState({ needConfirmation: true });
        }
      }
    });
    return;
  }

  confirm() {
    const { userName } = this.state;
    const userData = { Username: userName, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);
    const that = this;

    cognitoUser.confirmRegistration(this.state.confirmationCode, true, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      const object = { userId: userName, favorite: 'please enter favorite food in profile', going: false };

      axios
        .post(AWSURL, object, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'allow'
          }
        })
        .then(data => {
          console.log(data);
          that.logIn();
        })
        .catch(err => console.log(err));
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.state.needConfirmation ? this.confirm() : this.logIn();
  }

  renderLoginForm() {
    const { userName, password, confirmationCode } = this.state;
    return this.state.needConfirmation ? (
      <form onSubmit={e => this.onSubmit(e)}>
        <fieldset>
          <legend>Comfirmation Code:</legend>
          <label htmlFor="confirmationCode">Please Enter Comfirmation Code:</label>
          <input
            id="confirmationCode"
            type="text"
            name="confirmationCode"
            value={confirmationCode}
            onChange={e => this.setState({ confirmationCode: e.target.value })}
          />
          <br />
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
    ) : (
      <form onSubmit={e => this.onSubmit(e)}>
        <fieldset>
          <legend>Log In:</legend>
          <label htmlFor="userName">User Name:</label>
          <input
            id="userName"
            type="text"
            name="userName"
            value={userName}
            onChange={e => this.setState({ userName: e.target.value })}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
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
    );
  }

  render() {
    return <div>{this.renderLoginForm()}</div>;
  }
}

export default LogIn;
