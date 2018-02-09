import React, { Component } from 'react';
import { AWSURL } from '../utils/cognitoSetup';

import axios from 'axios';

class Landing extends Component {
  state = {
    favorite: ''
  };

  componentDidMount() {
    this.getAWSUsers();
    this.props.updateUser();
  }

  getAWSUsers() {
    axios
      .get(AWSURL)
      .then(data => {
        let favorite = '';
        data.data.forEach(user => {
          if (user.userId === this.props.userId) {
            favorite = user.favorite;
          }
        });
        this.setState({ favorite });
      })
      .catch(err => console.log(err));
  }

  onSubmit(e) {
    e.preventDefault();
    const { userId } = this.props;
    const { favorite } = this.state;
    const object = { userId, favorite, going: false };
    console.log(object);

    axios
      .post(AWSURL, object)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  render() {
    const { favorite } = this.state;

    return (
      <div>
        <form onSubmit={e => this.onSubmit(e)}>
          <fieldset>
            <legend>Information:</legend>
            <span>User: {this.props.userId}</span>
            <br />
            <label htmlFor="favorite">Lunch Selection:</label>
            <input
              id="favorite"
              type="text"
              name="favorite"
              value={favorite}
              onChange={e => this.setState({ favorite: e.target.value })}
            />
            <br />
            <input type="submit" value="Submit" />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Landing;
