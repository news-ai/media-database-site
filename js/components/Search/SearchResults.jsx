import React, { Component } from 'react';
import {connect} from 'react-redux';
import Contacts from 'components/Contacts/Contacts';
import withRouter from 'react-router/lib/withRouter';
import queryString from 'query-string';
import Select from 'react-select';
import isEmpty from 'lodash/isEmpty';
import RaisedButton from 'material-ui/RaisedButton';
import {searchConstant} from './constants';

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

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: []
    };
  }

  componentWillMount() {
    if (!isEmpty(this.props.query)) {
      const query = JSON.parse(this.props.query);
      this.props.fetchSearch(query);
      this.setState({
        beats: query.beats.map(beat => ({value: beat}))
      });
    }
  }

  render() {
    console.log(this.props.query);
    return (
      <div>
        <div className='vertical-center' style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          padding: '5px 10px',
          borderBottom: '1px solid black'
        }} >
          <div style={{width: 200}} >
            <Select
            multi
            labelKey='value'
            value={this.state.beats}
            options={beatOptions}
            onChange={beats => this.setState({beats})}
            />
          </div>
          <div className='right'>
            <RaisedButton label='Search' />
          </div>
        </div>
        <div style={{marginTop: 50}} >
          <div>
            <span>{this.props.total} results found.</span>
          </div>
          <Contacts {...this.props} />
        </div>
        <RaisedButton label='Next' />
      </div>
    );
  }
}

export default connect(
  ({searchReducer, contactReducer}, {location}) => {
    return {
      isReceiving: searchReducer.isReceiving,
      contacts: searchReducer.mostRecentReceived.map(id => contactReducer[id]),
      query: queryString.parse(location.search).q,
      total: searchReducer.total
    };
  },
  (dispatch) => ({
    fetchSearch: query => dispatch({type: searchConstant.REQUEST, query})
  })
  )(withRouter(SearchResults));
