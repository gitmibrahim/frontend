// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { parseLocationData } from 'libs/location';
import history from './../../../main/history';
import { media } from './../../../libs/styled';

import { Message } from 'semantic-ui-react';

// COMPONENTS
import { SearchIcon, CrossIcon } from '../../../shared_components/icons';
import SemanticLocationControl from 'shared_components/Form/LocationAutoSuggest';

// ACTIONS & CONFIG
import { placeholderMixin } from '../../../libs/styled';

const Input = styled.input`
  appearance: none;
  background: none;
  border: 0;
  display: block;
  font-family: inherit;
  font-size: 16px;
  font-weight: inherit;
  outline: none;
  padding-top: 3px;
  width: 100%;
  color: #b5b5b6;

  ${placeholderMixin(`
    color: #B5B5B6;
  `)};
`;

const Wrapper = styled.div`
  position: relative;
  max-width: 504px;
  margin: auto;
`;

const TypeIcon = styled.div`
  align-items: center;
  border-radius: 50%;
  color: #c4c4c4;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  height: 40px;
  justify-content: center;
  line-height: 40px;
  margin-right: 15px;
  overflow: hidden;
  width: 40px;

  &:last-child {
    margin-right: 0;
  }
`;

const SearchBg = styled.div`
  position: relative;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  min-height: 54px;
  height: auto;
  padding: 0 15px;
  width: 90%;
  margin: auto;

  ${media.mobileMinSmall} {
    width: 100%;
  }
`;

// MODULE
const locationProps = {
  inputStyles: {
    height: '100%',
    border: 0,
  },
  inputProps: {
    placeholder: 'Type a city or country',
    as: Input,
  },
};

const LeftIcon = ({ talking, onClickTalking }) => (
  <TypeIcon onClick={talking ? onClickTalking : null}>
    {talking ? <CrossIcon /> : <SearchIcon style={{ stroke: '#c4c4c4' }} />}
  </TypeIcon>
);

const suggestionStyle = {
  width: '80vw',
  maxWidth: '505px',
  marginLeft: '-25px',
};

export default class HomeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      countryCode: undefined,
      city: undefined,
      serviceType: undefined,
      keywords: '',
      show_banner: false,
      focus: false,
    };

    this.setSearch = this.setSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.setKeyWords = this.setKeyWords.bind(this);
  }

  componentDidMount() {}

  setSearch(ev) {
    this.setState({ search: ev.target.value });
  }

  setKeyWords(ev) {
    this.setState({ keywords: ev.target.value });
  }

  handleLocationChange(address, serviceType, text) {
    if (text) {
      this.setState({ text }, this.handleSearchSubmit);
      return;
    }

    geocodeByAddress(address)
      .then(results => {
        const result = results[0];
        const { city, countryCode } = parseLocationData(result);

        this.setState({
          address,
          city,
          countryCode,
        });
        return getLatLng(result);
      })
      .then(results => {
        const { lat, lng } = results;
        this.setState(
          { address, latitude: lat, longitude: lng, serviceType },
          this.handleSearchSubmit,
        );
      });
  }

  handleSearchSubmit() {
    const query_params = {
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      city: this.state.city,
      countryCode: this.state.countryCode,
      serviceTypes: this.state.serviceType,
      text: this.state.text,
    };
    let query_arr = [];
    Object.entries(query_params).forEach(([key, value]) => {
      if (value) {
        let to_concat = key + '=' + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join('&');
    if (this.props.toggleSearch) {
      this.props.toggleSearch();
    }
    history.push(`/results?${query_string}`);
  }

  onFocus = () => {
    this.setState({
      focus: true,
    });
  };

  onBlur = () => {
    this.setState({
      focus: false,
    });
  };

  renderInputContent = () => {
    return (
      <SemanticLocationControl
        onChange={this.handleLocationChange}
        {...locationProps}
        customStyle={suggestionStyle}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );
  };

  handleDismiss = () => {
    this.setState({ show_banner: false });
  };

  render() {
    return (
      <Wrapper>
        <SearchBg style={{ zIndex: this.state.focus ? 11 : 1 }}>
          <LeftIcon />
          {this.renderInputContent()}
        </SearchBg>
        {this.state.show_banner && (
          <Message
            color="red"
            onDismiss={this.handleDismiss}
            style={{ position: 'fixed', bottom: '5px', left: '5px' }}
          >
            <Message.Header>Warning !</Message.Header>
            <p>
              Your browser does not support voice recognition so we have disabled it on this
              website. Please use a compatible desktop browser like Chrome (
              <a href="https://www.google.com/chrome/">https://www.google.com/chrome/</a>)
            </p>
          </Message>
        )}
      </Wrapper>
    );
  }
}

// Props Validation
HomeSearch.propTypes = {};
