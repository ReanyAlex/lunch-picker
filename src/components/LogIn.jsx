import React, { Component } from 'react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

class LogIn extends Component {
  state = {
    userName: '',
    password: '',
    confirmationCode: '',
    needConfirmation: false
  };

  logIn() {
    const { userName, password } = this.state;
    const POOL_DATA = {
      UserPoolId: 'us-east-1_qmn8LpGk9',
      ClientId: '23m3lvis3ava8geatio6sll85c'
    };

    const userPool = new CognitoUserPool(POOL_DATA);

    const authData = {
      Username: userName,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: userName,
      Pool: userPool
    };
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
          console.log('1');

          that.setState({ needConfirmation: true });
          //if log need confirmation prompt of code can add an additional input probaly
          //make cleaner
        }
      }
    });
    return;
  }

  confirm() {
    const { userName } = this.state;

    const POOL_DATA = {
      UserPoolId: 'us-east-1_qmn8LpGk9',
      ClientId: '23m3lvis3ava8geatio6sll85c'
    };

    const userPool = new CognitoUserPool(POOL_DATA);

    const userData = {
      Username: userName,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    const that = this;

    cognitoUser.confirmRegistration(this.state.confirmationCode, true, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(result);
      that.props.history.push('/');
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(this.state.needConfirmation);
    this.state.needConfirmation ? this.confirm() : this.logIn();
  }

  renderLoginForm() {
    const { userName, password, confirmationCode } = this.state;
    console.log(this.state.needConfirmation);
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
