// NPM
import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import LocationFormControl from "../../../shared_components/Form/LocationControl";
import FormControl from "../../../shared_components/Form/FormControl";

import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import moment from "moment";
import querystring from "query-string";
import history from "./../../../main/history";

import { Checkbox as SemanticCheckbox } from "semantic-ui-react";
import { Icon } from 'semantic-ui-react';

import * as results_actions from "./../../../scenes/results/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// STYLES
const Wrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Checkbox = styled(SemanticCheckbox)`
  margin-left: 1%;
  margin-right: 1%;
`;

const ClearInputIcon = styled(Icon)`
  position: relative;
  right: 20px;
`;

const CheckboxWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 1%;
  padding-bottom: 1%;
`;

// MODULE
class SearchFilters extends Component {

  constructor(props){
    super(props);
    this.state = {
      address: props.search_query.address || undefined,
      latitude: props.search_query.latitude || undefined,
      longitude: props.search_query.longitude || undefined,
      start_date: props.search_query.start_date ? props.search_query.start_date : moment().format(),
      end_date: props.search_query.end_date ? props.search_query.end_date : moment().add(1, 'days').format(),
      person_nb: props.search_query.person_nb || undefined,
      service_type: props.search_query.type || [],
      tags: [],
      //service_type: { trip: false, place: false, activity: false, food: false }
    }
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.refetch_results = this.refetch_results.bind(this);
    this.get_query_params = this.get_query_params.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    //this.reverse_geocode = this.reverse_geocode.bind(this);
    this.handleServiceTypeChange = this.handleServiceTypeChange.bind(this);
    this.clear_address = this.clear_address.bind(this);
    this.clear_start_date = this.clear_start_date.bind(this);
    this.clear_end_date = this.clear_end_date.bind(this);
    this.clear_person_nb = this.clear_person_nb.bind(this);
  }

  // componentDidMount(){
  //   if(this.props.latitude && this.props.longitude){
  //     this.reverse_geocode(this.props.latitude, this.props.longitude);
  //   }
  // }

  // componentWillUpdate(next_props) {
  //   if (this.did_search_query_changed(this.props, next_props)) {
  //     if(next_props.latitude && next_props.longitude){
  //       setTimeout(() => {
  //         this.reverse_geocode(next_props.latitude, next_props.longitude);
  //       }, 3000);
  //     }
  //   }
  // }

  // did_search_query_changed = (current_props, next_props) => {
  //   return (
  //     current_props.latitude !== next_props.latitude ||
  //     current_props.longitude !== next_props.longitude
  //   );
  // };

  // reverse_geocode(latitude, longitude){
  //   let params = {
  //     key: 'AIzaSyDICUW2RF412bnmELi3Y_zCCzHa-w8WnXc',
  //     latlng: `${latitude},${longitude}`,
  //   };
  //   let qs = querystring.stringify(params);
  //
  //   fetch(
  //     `https://maps.googleapis.com/maps/api/geocode/json?${qs}`)
  //       .then((res) => res.json())
  //       .then((json) => {
  //         if (json.status !== 'OK') {
  //           throw new Error(`Geocode error: ${json.status}`);
  //         }
  //         return json;
  //       }).then(addr_array => {
  //         if(addr_array.results.length){
  //           let addr = addr_array.results[0];
  //           this.setState({address: addr.formatted_address})
  //           return addr.formatted_address;
  //         }else{
  //           console.log("could not reverse geocode lat/lng")
  //         }
  //       })
  // }

  get_query_params(){
    return {
      type: this.props.search_query.type,
      start_date: this.props.search_query.start_date,
      end_date: this.props.search_query.end_date,
      person_nb: this.props.search_query.person_nb,
      latitude: this.props.search_query.latitude,
      longitude: this.props.search_query.longitude,
      address: this.props.search_query.address,
      tags: this.props.search_query.tags
    };
  }

  refetch_results(param_object){
    const query_params = this.get_query_params();
    query_params[Object.keys(param_object)[0]] = param_object[Object.keys(param_object)[0]];
    this.props.update_path(query_params);
  }

  refetch_results_for_location(lat, lon, addr){
    const query_params = this.get_query_params();
    query_params.latitude = lat;
    query_params.longitude = lon;
    query_params.address = addr;
    this.props.update_path(query_params);
  }

  handleStartDateChange(dateObject) {
    const date_start = dateObject.toISOString();
    this.setState({ start_date: date_start });
    this.refetch_results({ start_date: date_start });
  }

  handleEndDateChange(dateObject) {
    const date_end = dateObject.toISOString();
    this.setState({ end_date: date_end });
    this.refetch_results({ end_date: date_end });
  }

  handleLocationChange(address) {
    let addr = ""
    geocodeByAddress(address)
      .then(results => {
        //console.log(results);
        addr = results[0].formatted_address;
        this.setState({ address: addr });
        return getLatLng(results[0]);
      })
      .then(results => {
        const { lat, lng } = results;
        this.setState({ latitude: lat, longitude: lng });
        this.refetch_results_for_location(lat, lng, addr);
      });
  }

  handleServiceTypeChange(event) {
    const service_types = [ ...this.props.search_query.type ];
    let types = service_types;
    const type = event.target.innerText.toLowerCase();
    if(types.includes(type)){
      types = types.filter(st => st !== type);
    }else{
      types = types.concat(type);
    }
    this.setState({ service_type: types });
    this.refetch_results({ type: types });
  }

  handlePersonChange(person) {
    this.setState({ person_nb: person });
    this.refetch_results({ person_nb: person });
  }

  clear_address(){
    this.setState({ latitude: "", longitude: "", address: "" });
    this.refetch_results_for_location("", "", "");
  }

  clear_start_date(){
    this.setState({ start_date: "" });
    this.refetch_results({ start_date: "" });
  }

  clear_end_date(){
    this.setState({ end_date: "" });
    this.refetch_results({ end_date: "" });
  }

  clear_person_nb(){
    this.setState({ person_nb: "" });
    this.refetch_results({ person_nb: "" });
  }

  render(){
    let start_date = this.props.search_query.start_date;
    let formatted_start_date = (start_date && start_date.length) ? moment(start_date).format() : "";
    let end_date = this.props.search_query.end_date;
    let formatted_end_date = (end_date && end_date.length) ? moment(end_date).format() : "";
    let person_nb = this.props.search_query.person_nb;
    let service_types = this.props.search_query.type;
    let address = this.props.search_query.address; // || this.state.address; //|| this.props.address;
    //let address = this.state.address || this.props.address;
    return(
      <section>
        <Wrap>

          <LocationFormControl formatted_address={address} onChange={this.handleLocationChange} />
          <ClearInputIcon onClick={this.clear_address} link name='close' />

          <FormControl
            type="date"
            onChange={this.handleStartDateChange}
            placeholder="Start date"
            leftIcon="date"
            value={formatted_start_date}
          />
          <ClearInputIcon onClick={this.clear_start_date} link name='close' />

          <FormControl
            type="date"
            onChange={this.handleEndDateChange}
            placeholder="End date"
            leftIcon="date"
            value={formatted_end_date}
          />
          <ClearInputIcon onClick={this.clear_end_date} link name='close' />

          <FormControl
            type="number"
            onChange={this.handlePersonChange}
            placeholder="Nb"
            leftIcon="person"
            min={1}
            max={10}
            value={person_nb}
          />
          <ClearInputIcon onClick={this.clear_person_nb} link name='close' />

        </Wrap>

        <CheckboxWrap>
          <Checkbox
            label="Trip"
            value="trip"
            onClick={this.handleServiceTypeChange}
            checked={service_types && service_types.includes("trip")}
          />
          <Checkbox
            label="Place"
            value="place"
            onClick={this.handleServiceTypeChange}
            checked={service_types && service_types.includes("place")}
          />
          <Checkbox
            label="Activity"
            value="activity"
            onClick={this.handleServiceTypeChange}
            checked={service_types && service_types.includes("activity")}
          />
          <Checkbox
            label="Food"
            value="food"
            onClick={this.handleServiceTypeChange}
            checked={service_types && service_types.includes("food")}
          />
        </CheckboxWrap>
      </section>
    )
  }


}


const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results,
    search_query: state.ResultsReducer.search_query
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);