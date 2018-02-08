import React, { Component } from 'react';
import { AWSURL } from '../utils/cognitoSetup';
import axios from 'axios';
import fetch from 'node-fetch';

import styled from 'styled-components';

import Restaurant from './Restaurant';
import { yelp } from '../yelp';

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
    whosGoing: [],
    generateLunch: false,
    restaurantInfo: {}
  };

  componentDidMount() {
    console.log('mount');
    this.getAWSUsers();
    this.props.updateUser();
  }

  getAWSUsers(nextStateGoing) {
    console.log('getAWSUsers');
    axios
      .get(AWSURL)
      .then(data => {
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
      .catch(err => console.error(err));
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
    axios.post(AWSURL, object).catch(err => console.error(err));
  }

  restaurantPick() {
    const choices = [];
    axios
      .get(AWSURL)
      .then(data => {
        data.data.forEach(user => {
          if (user.going) {
            choices.push(user.favorite);
          }
        });
        console.log(choices);
        const length = choices.length;
        const selectorIndex = Math.floor(Math.random() * length);
        console.log(selectorIndex);
        const searchItem = choices[selectorIndex];
        console.log(searchItem);
        this.yelpSearch(searchItem);
      })
      .catch(err => console.error(err));
  }

  yelpSearch(searchItem) {
    const AWSRESTAURANTURL = 'https://wlhi41bngi.execute-api.us-east-1.amazonaws.com/dev/lunch-picker/restaurant';
    const body = {};

    body.term = searchItem;
    body.latitude = this.props.currentLocation.latitude;
    body.longitude = this.props.currentLocation.longitude;
    body.radius = 8050;
    body.sort_by = 'rating';

    axios
      .post(AWSRESTAURANTURL, body)
      .then(data => {
        console.log(data.data);
        this.setState({ generateLunch: true, restaurantInfo: data.data });
      })
      .catch(err => console.error(err.message));
  }

  renderWhoIsGoing(user) {
    return <PeopleGoing key={user}>{user}</PeopleGoing>;
  }

  renderForm() {
    const { favorite, going, whosGoing } = this.state;
    return (
      <MainWrapper className="Landing">
        <h2>{`Welcome ${this.props.userId} `}</h2>
        <div>
          {!this.state.going ? <h3>Are you going to lunch today?</h3> : <h3>Hope you enjoy lunch!</h3>}
          <form onSubmit={e => this.onSubmit(e)}>
            <fieldset>
              <br />
              {!this.state.going ? (
                <span>
                  <label htmlFor="favorite">What is you Lunch Selection For Today:</label>
                  <FoodInput
                    id="favorite"
                    type="text"
                    name="favorite"
                    value={favorite}
                    onChange={e => this.setState({ favorite: e.target.value })}
                  />
                </span>
              ) : (
                <span>You Chose {this.state.favorite} for lunch</span>
              )}
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
      </MainWrapper>
    );
  }

  renderRestautant() {
    return (
      <div>
        <button onClick={() => this.setState({ generateLunch: false })}>Undo Restaurant Selection</button>
        <Restaurant restaurantInfo={this.state.restaurantInfo} />
      </div>
    );
  }

  render() {
    return this.state.generateLunch ? this.renderRestautant() : this.renderForm();
  }
}

export default Landing;
