import React, { Component } from 'react';
import { AWSURL } from '../utils/cognitoSetup';
import axios from 'axios';
import fetch from 'node-fetch';

import styled from 'styled-components';

import Restaurant from './Restaurant';

const MainWrapper = styled.div`
  margin: 0 auto;
  text-align: center;
`;

const GoingButton = styled.input`
  height: 75px;
  width: 300px;
  border-radius: 100px;
  background: #e20100;
  color: white;
  &:hover {
    color: #ffcb16;
  }
`;

const Button = styled.button`
  height: 75px;
  width: 300px;
  border-radius: 100px;
  background: #e20100;
  color: white;
  &:hover {
    color: #ffcb16;
  }
`;
const PeopleGoingList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PeopleGoing = styled.li`
  list-style-type: none;
  display: inline-block;
  margin: 0 5px 0 5px;
`;

const FoodInput = styled.input`
  display: block;
  margin: 0 auto;
  margin-bottom: 20px;
`;

class Landing extends Component {
  state = {
    favorite: '',
    going: null,
    whosGoing: []
  };

  componentDidMount() {
    console.log('did mount');
    this.getAWSUsers();
    this.props.updateUser();
  }

  componentDidUpdate(prevProps, prevState) {
    // if (prevState.going === Boolean) {
    //   return;
    // }
    console.log('did update');
    if (prevState.going !== this.state.going && this.state.going !== null) {
      // this.getAWSUsers();
    }
  }

  getAWSUsers(nextStateGoing) {
    console.log('getAWSUsers');
    axios
      .get(AWSURL)
      .then(data => {
        console.log('incoming data', data);
        let favorite = '';
        const whosGoing = [];
        let going;
        data.data.forEach(user => {
          const { userId } = user;
          if (user.going) {
            whosGoing.push(userId);
          }

          if (userId === this.props.userId) {
            favorite = user.favorite;
            going = user.going;
          }
        });

        this.setState({ favorite, whosGoing, going });
      })
      .catch(err => console.log(err));
  }

  onSubmit(e) {
    console.log('on submit');
    e.preventDefault();
    const { favorite, whosGoing } = this.state;
    const { userId } = this.props;
    const going = !this.state.going;
    const index = whosGoing.indexOf(userId);

    if (going && index === -1) {
      whosGoing.push(userId);
    } else {
      whosGoing.splice(index, 1);
    }

    this.setState({ going, whosGoing });
    const object = { userId, favorite, going };
    axios.post(AWSURL, object).catch(err => console.log(err));
  }

  restaurantPick() {
    const choices = [];
    axios
      .get(AWSURL)
      .then(data => {
        data.data.forEach(user => {
          choices.push(user.favorite);
        });
        console.log(choices);
        const length = choices.length;
        const selectorIndex = Math.floor(Math.random() * length);
        const searchItem = choices[selectorIndex];
        console.log(searchItem);
        this.yelpSearch(searchItem);
      })
      .catch(err => console.log(err));
  }

  yelpSearch() {
    const APIKEY =
      '-BugizLEvh-iEqv1gPuCHiBboqB7UlXJGvLSNei6pv-bpOPztYnUXbUWRUSH9il14KbZ-4Bot7rdvlyYUKdLS1INKdxygWllOS3aaYeQjoP1_jucyd8PSXWA23d2WnYx';
    const YELPURL = 'https://api.yelp.com/v3/businesses/search?term=pizza&location=atlanta';

    axios
      .get(YELPURL, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${APIKEY}`
        }
      })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  }

  renderWhoIsGoing(user) {
    return <PeopleGoing key={user}>{user}</PeopleGoing>;
  }

  render() {
    const { favorite, going, whosGoing } = this.state;
    return (
      <MainWrapper className="Landing">
        <h2>{`Welcome ${this.props.userId} `}</h2>
        <div>
          <h3>Are you going to lunch today?</h3>
          <form onSubmit={e => this.onSubmit(e)}>
            <fieldset>
              <br />
              <label htmlFor="favorite">What is you Lunch Selection For Today:</label>
              <FoodInput
                id="favorite"
                type="text"
                name="favorite"
                value={favorite}
                onChange={e => this.setState({ favorite: e.target.value })}
              />
            </fieldset>
            <GoingButton type="submit" value={going ? 'Exit the Train' : 'Board the Lunch Train'} />
          </form>
        </div>
        <div>
          <h3>Who is already Going:</h3>
          <PeopleGoingList>{whosGoing.map(user => this.renderWhoIsGoing(user))}</PeopleGoingList>
        </div>
        <div>
          <Button onClick={() => this.restaurantPick()}>Press When Ready For Lunch</Button>
        </div>
        <Restaurant />
      </MainWrapper>
    );
  }
}

export default Landing;
