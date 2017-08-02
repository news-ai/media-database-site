import React, { Component } from 'react';
import {connect} from 'react-redux';
import Contacts from 'components/Contacts/Contacts';
import withRouter from 'react-router/lib/withRouter';
import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';
import {searchConstant} from './constants';

class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!isEmpty(this.props.query)) {
      this.props.fetchSearch(JSON.parse(this.props.query));
    }
  }

  render() {
    console.log(this.props.query);
    return (
      <div>
        <Contacts {...this.props} />
      </div>
    );
  }
}

export default connect(
  ({searchReducer, contactReducer}, {location}) => {
    return {
      isReceiving: searchReducer.isReceiving,
      contacts: searchReducer.mostRecentReceived.map(id => contactReducer[id]),
      query: queryString.parse(location.search).q
    };
  },
  (dispatch) => ({
    fetchSearch: query => dispatch({type: searchConstant.REQUEST, query})
  })
  )(withRouter(SearchResults));
