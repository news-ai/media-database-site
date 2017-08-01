import React, { Component } from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import FlatButton from 'material-ui/FlatButton';
import {searchConstant} from './constants';

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
    this.props.fetchSearch({
      beats: this.state.beats.map(({value}) => value),
    });
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
        <FlatButton label='Submit' onClick={this.onSubmit} />
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
