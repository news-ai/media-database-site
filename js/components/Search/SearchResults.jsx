import React, { Component } from 'react';
import {connect} from 'react-redux';
import Contacts from 'components/Contacts/Contacts';
import withRouter from 'react-router/lib/withRouter';
import Link from 'react-router/lib/Link';
import queryString from 'query-string';
import Select from 'react-select';
import isEmpty from 'lodash/isEmpty';
import RaisedButton from 'material-ui/RaisedButton';
import {searchConstant} from './constants';
import {blue500, grey700, grey800} from 'material-ui/styles/colors';

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

const styles = {
  pagesContainer: {padding: '15px 10px', margin: '30px 10px'},
  contactItemContainer: {margin: '10px 5px'},
  limit: {
    label: {margin: '0 5px', color: grey800},
    container: {margin: '10px 0'},
    select: {width: 60}
  },
  copy: {
    btn: {margin: '0 5px', float: 'right'}
  },
  controls: {
    checkbox: {fill: blue500},
    container: {margin: '10px 0'}
  },
  selectLabel: {margin: '0 5px', float: 'right', color: grey700},
  dialog: {
    container: {height: 400},
  },
  container: {marginTop: 20, marginBottom: 10},
  text: {fontSize: '2em', marginRight: 10}
};

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: [],
    };
    this.handlePageLimitChange = this.handlePageLimitChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const page = this.props.page !== undefined ? this.props.page : 1;
    const limit = this.props.limit !== undefined ? this.props.limit : 20;
    if (nextProps.page !== page || nextProps.limit !== limit) {
      const start = (nextProps.page - 1) * nextProps.limit;
      const end = nextProps.page * nextProps.limit;
      if (end > nextProps.contacts.length) {
        console.log('FETCH MORE');
        const query = JSON.parse(nextProps.query);
        this.props.fetchSearch(query);
      }
    }
  }

  handlePageLimitChange(e) {
    this.props.router.push({
      pathname: `/search`,
      query: {
        q: this.props.query,
        limit: parseInt(e.target.value, 10),
        page: 1
      }
    });
  }

  render() {
    const {total, isReceiving, contacts} = this.props;
    const page = this.props.page !== undefined ? this.props.page : 1;
    const limit = this.props.limit !== undefined ? this.props.limit : 20;

    const slicedContacts = contacts.slice(
      (page - 1) * limit,
      page * limit
      );

    const numPages = total % limit > 0 ? Math.floor(total / limit) + 1 : Math.floor(total / limit);
    let pages = [];

    for (let i = 1; i < numPages + 1; i++) {
      pages.push(
        <Link
        key={`page-${i}`}
        to={{
          pathname: `/search`,
          query: {
            q: this.props.query,
            limit: parseInt(limit, 10),
            page: i
          }
        }}
        style={{
          padding: '2px 5px',
          margin: '0 3px',
          border: '1px solid gray',
          backgroundColor: i === page ? 'red' : '#ffffff',
          display: 'inline-block'
        }} >{i}</Link>
        );
    }
    console.log(page);
    console.log((page - 1) * limit);
    console.log(page * limit);
    console.log(slicedContacts);

    return (
      <div style={{marginTop: 50}} >
        <div>
          <span>{this.props.total} results found.</span>
          <span className='text' style={styles.limit.label}>Showing</span>
          <select
          style={styles.limit.select}
          className='clearfix'
          value={limit}
          onChange={this.handlePageLimitChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <span className='text' style={styles.limit.label} >results per page</span>
        </div>
        <Contacts isReceiving={isReceiving} contacts={slicedContacts} />
        <div style={{margin: '30px 0'}} className='horizontal-center'>{pages}</div>
      </div>
    );
  }
}

export class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: [],
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
    const {isReceiving, contacts} = this.props;

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
        {isReceiving || !contacts ? <div>LOADING...</div> : <SearchResults {...this.props} />}
      </div>
    );
  }
}


export default connect(
  ({searchReducer, contactReducer}, {router}) => {
    const {q, page, limit} = router.location.query;
    return {
      isReceiving: searchReducer.isReceiving,
      contacts: searchReducer.mostRecentReceived.map(id => contactReducer[id]),
      query: q,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      total: searchReducer.total,
    };
  },
  (dispatch) => ({
    fetchSearch: query => dispatch({type: searchConstant.REQUEST, query})
  })
  )(withRouter(SearchContainer));
