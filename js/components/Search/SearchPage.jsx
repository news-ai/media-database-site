import React, { Component } from 'react';
import {connect} from 'react-redux';
import withRouter from 'react-router/lib/withRouter';
import Select from 'react-select';
import {searchConstant} from './constants';

import FlatButton from 'material-ui/FlatButton';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import pickBy from 'lodash/pickBy';

import 'react-select/dist/react-select.css';

const beatOptions = [
  {value: 'Arts and Entertainment'},
  {value: 'Beauty'},
  {value: 'Business and Finance'},
  {value: 'Crime and Justice'},
  {value: 'Education'},
  {value: 'Energy'},
  {value: 'Environment'},
  {value: 'Fashion'},
  {value: 'Food and Dining'},
  {value: 'Health'},
  {value: 'Media'},
  {value: 'Opinion and Editorial'},
  {value: 'Politics'},
  {value: 'Real Estate'},
  {value: 'Religion'},
  {value: 'Science'},
  {value: 'Sports'},
  {value: 'Technology'},
  {value: 'Transportation'},
  {value: 'Travel'},
  {value: 'Weather'},
  {value: 'World'},
];

class LocationSelector extends Component {
  constructor(props) {
    super(props);
    this.onCountrySelect = this.onCountrySelect.bind(this);
  }

  onCountrySelect(index, object) {
    const country = object.value;
    const {state, city} = this.props.locations[index];
    this.props.onLocationSelect(index, {country, state, city});
  }

  render() {
    return (
      <div>
      {this.props.locations.map(({country, state, city}, i) =>
        <div key={`select-${i}`} >
          <div onClick={_ => this.props.onLocationDelete(i)}>-</div>
          <Select labelKey='value' onChange={obj => this.props.onLocationSelect(i, {country: !!obj ? obj.value : undefined, state, city})} value={country} options={[{value: 'United States'}]} />
          <Select labelKey='value' onChange={obj => this.props.onLocationSelect(i, {country, state: !!obj ? obj.value : undefined, city})} value={state} options={[{value: 'New York'}]} />
          <Select labelKey='value' onChange={obj => this.props.onLocationSelect(i, {country, state, city: !!obj ? obj.value : undefined})} value={city} options={[{value: 'Boston'}]} />
        </div>
        )}
        <div onClick={this.props.onLocationAdd} >+</div>
      </div>
    );
  }
}


class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: [],
      locations: [{}]
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.onLocationAdd = this.onLocationAdd.bind(this);
    this.onLocationDelete = this.onLocationDelete.bind(this);
  }

  onSubmit() {
    const isFreelancer = this.isFreelancer.checked;
    const freelancerType = this.freelancerType.checked;
    const baseQuery = {};
    if (this.state.beats.length > 0) baseQuery.beats = this.state.beats.map(({value}) => value);
    if (freelancerType) baseQuery.isFreelancer = isFreelancer;
    if (this.state.locations.some(({country, city, state}) => country || state || city)) {
      const locations = this.state.locations
      .filter(({country, city, state}) => country || state || city)
      .map(loc => pickBy(loc, val => !!val));
      baseQuery.locations = locations;
    }

    if (!isEmpty(baseQuery)) {
      // this.props.fetchSearch(baseQuery);
      this.props.router.push({
        pathname: `/search`,
        query: {
          q: JSON.stringify(baseQuery)
        }
      });
    }
  }

  onLocationAdd() {
    const {locations} = this.state;
    this.setState({locations: [...locations, {country: 'United States'}]});
  }

  onLocationDelete(index) {
    const {locations} = this.state;
    this.setState({locations: locations.filter((loc, i) => i !== index)});
  }

  onLocationSelect(index, {country, state, city}) {
    const {locations} = this.state;
    this.setState({
      locations: locations.map((loc, i) => i === index ? ({country, state, city}) : loc)
    });
  }

  render() {
    return (
      <div>
        <div>
          <label>Beats</label>
          <Select
          multi
          labelKey='value'
          value={this.state.beats}
          options={beatOptions}
          onChange={beats => this.setState({beats})}
          />
        </div>
        <div>
          <label>Specify Freelancer Type</label>
          <input type='checkbox' ref={ref => this.freelancerType = ref} />
          <label>Is a Freelancer?</label>
          <input type='checkbox' ref={ref => this.isFreelancer = ref} />
        </div>
        <div>
          <label>Location(s)</label>
        </div>
        <LocationSelector
        locations={this.state.locations}
        onLocationSelect={this.onLocationSelect}
        onLocationAdd={this.onLocationAdd}
        onLocationDelete={this.onLocationDelete}
        />
        <FlatButton label='Submit' onClick={this.onSubmit} />
      </div>
    );
  }
}

export default connect(
  (state, props) => ({}),
  (dispatch) => ({
    fetchSearch: query => dispatch({type: searchConstant.REQUEST, query})
  })
  )(withRouter(SearchPage));
