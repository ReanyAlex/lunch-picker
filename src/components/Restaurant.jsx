import React, { Component } from 'react';
// import { yelp } from '../yelp';

import styled from 'styled-components';

const MainWrapper = styled.div`
  width: 350px;
  margin: 0 auto;
`;

const HeaderWrapper = styled.div`
  padding-bottom: 20px;
  text-align: center;
`;

const MainHeader = styled.h2`
  margin: 0;
  padding: 0;
`;

const YelpDisclamer = styled.span`
  font-size: 0.75rem;
`;

const Image = styled.img`
  border: 1px solid black;
`;

class Restaurant extends Component {
  render() {
    const { name, location, categories, url, rating, price, image_url } = this.props.restaurantInfo[0];

    return (
      <MainWrapper>
        <HeaderWrapper>
          <MainHeader>Restaurant Information</MainHeader>
          <YelpDisclamer>Generated from Yelp</YelpDisclamer>
        </HeaderWrapper>
        <div>
          <p>Restaurant Name: {name}</p>
          <p>Category: {categories[0].title}</p>
          <p>Rating: {rating}</p>
          <p>Cost: {price}</p>
          <Image src={image_url} alt=" restaurant image" />
          <p>
            Restaurant Address: {location.address1}. {location.city},{location.state} {location.zip_code}
          </p>
          <a href={url} target="_blank">
            Link to Yelp
          </a>
        </div>
      </MainWrapper>
    );
  }
}

export default Restaurant;
