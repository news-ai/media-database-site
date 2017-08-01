import React, { Component } from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import {searchConstant} from './constants';

import FlatButton from 'material-ui/FlatButton';

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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: []
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const isFreelancer = this.isFreelancer.checked;
    const freelancerType = this.freelancerType.checked;
    let baseQuery = {};
    if (this.state.beats.length > 0) baseQuery.beats = this.state.beats.map(({value}) => value);
    if (freelancerType) baseQuery.isFreelancer = isFreelancer;
    this.props.fetchSearch(baseQuery);
  }

  render() {
    return (
      <div>
        <label>Beats</label>
        <Select
        multi
        labelKey='value'
        value={this.state.beats}
        options={beatOptions}
        onChange={beats => this.setState({beats})}
        />
        <label>Specify Freelancer Type</label>
        <input type='checkbox' ref={ref => this.freelancerType = ref} />
        <label>Is a Freelancer?</label>
        <input type='checkbox' ref={ref => this.isFreelancer = ref} />
        <div>
          <FlatButton label='Submit' onClick={this.onSubmit} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    fetchSearch: query => dispatch({type: searchConstant.REQUEST, query})
  })
  )(SearchPage);
