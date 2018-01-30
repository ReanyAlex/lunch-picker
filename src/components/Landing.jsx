import React, { Component } from 'react';
import axios from 'axios';

class Landing extends Component {
  state = {
    name: '',
    diet: ''
  };

  componentDidMount() {
    const url = 'https://wlhi41bngi.execute-api.us-east-1.amazonaws.com/dev/lunch-picker';
    axios
      .get(url)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  onSubmit(e) {
    e.preventDefault();
    const { name, diet } = this.state;
    const url = 'https://wlhi41bngi.execute-api.us-east-1.amazonaws.com/dev/lunch-picker';
    const object = { userId: name, diet: diet };
    axios
      .post(url, object)
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  render() {
    const { name, diet } = this.state;
    return (
      <div className="Landing">
        <form onSubmit={e => this.onSubmit(e)}>
          <fieldset>
            <legend>Information:</legend>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <br />
            <label htmlFor="diet">Diet:</label>
            <input
              id="diet"
              type="text"
              name="diet"
              value={diet}
              onChange={e => this.setState({ diet: e.target.value })}
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
