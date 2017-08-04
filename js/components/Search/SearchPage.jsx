import React, { Component } from 'react';
import {connect} from 'react-redux';
import withRouter from 'react-router/lib/withRouter';
import Select from 'react-select';
import {searchConstant} from './constants';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import pickBy from 'lodash/pickBy';
import {grey600, grey800} from 'material-ui/styles/colors';
import LocationSelector from 'components/Search/LocationSelector';

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
      beats: [],
      locations: [{}],
      advanceSearchOpen: false,
      isFreelancer: false,
      isNotFreelancer: false,
      isInfluencer: false,
      isNotInfluencer: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.onLocationAdd = this.onLocationAdd.bind(this);
    this.onLocationDelete = this.onLocationDelete.bind(this);
  }

  componentWillMount() {
    if (this.props.queryString) {
      const query = JSON.parse(this.props.queryString);
      if (query.beats) this.setState({beats: query.beats.map(beat => ({value: beat}))});
      if (query.isFreelancer === true) this.setState({isFreelancer: true, isNotFreelancer: false});
      else if (query.isFreelancer === false) this.setState({isNotFreelancer: true, isFreelancer: false});

      if (query.isFreelancer === true) this.setState({isInfluencer: true, isNotInfluencer: false});
      else if (query.isFreelancer === false) this.setState({isNotInfluencer: true, isInfluencer: false});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.queryString !== nextProps.queryString) {
      const query = JSON.parse(nextProps.queryString);
      if (query.beats) this.setState({beats: query.beats.map(beat => ({value: beat}))});
      if (query.isFreelancer === true) this.setState({isFreelancer: true, isNotFreelancer: false});
      else if (query.isFreelancer === false) this.setState({isNotFreelancer: true, isFreelancer: false});

      if (query.isFreelancer === true) this.setState({isInfluencer: true, isNotInfluencer: false});
      else if (query.isFreelancer === false) this.setState({isNotInfluencer: true, isInfluencer: false});
    }
  }

  onSubmit() {
    const baseQuery = {};
    if (this.state.beats.length > 0) baseQuery.beats = this.state.beats.map(({value}) => value);
    if (this.state.advanceSearchOpen) {
      if (this.state.isFreelancer) baseQuery.isFreelancer = true;
      else if (this.state.isNotFreelancer) baseQuery.isFreelancer = false;

      if (this.state.isInfluencer) baseQuery.isInfluencer = true;
      else if (this.state.isNotInfluencer) baseQuery.isNotInfluencer = false;

      if (this.state.locations.some(({country, city, state}) => country || state || city)) {
        const locations = this.state.locations
        .filter(({country, city, state}) => country || state || city)
        .map(loc => pickBy(loc, val => !!val));
        baseQuery.locations = locations;
      }
    }

    if (!isEmpty(baseQuery)) {
      this.props.fetchSearch(baseQuery);
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
    const {advanceSearchOpen, isNotFreelancer, isFreelancer, isInfluencer, isNotInfluencer} = this.state;
    return (
      <div >
        <FlatButton className='right' label='Submit' onClick={this.onSubmit} />
        <div className='right' onClick={_ => this.setState(prev => ({advanceSearchOpen: !prev.advanceSearchOpen}))}>
          <span
          className='pointer'
          style={{color: grey800, margin: '0 10px', userSelect: 'none'}}
          >Advance Search <i className={`fa fa-${advanceSearchOpen ? 'minus' : 'plus'} `} /> </span>
        </div>
        <div style={{width: 300}} >
          <Select
          multi
          placeholder='Beats (e.g. Technology, Science)'
          labelKey='value'
          value={this.state.beats}
          options={beatOptions}
          onChange={beats => this.setState({beats})}
          />
        </div>
      {advanceSearchOpen &&
        <div>
          <div className='vertical-center'>
            <div style={{margin: '0 10px'}} >
              <label>Non-Freelancer Only</label>
              <input disabled={isFreelancer} type='checkbox' checked={isNotFreelancer} onChange={e => this.setState({isNotFreelancer: e.target.checked})} />
            </div>
            <div style={{margin: '0 10px'}} >
              <label>Freelancer Only</label>
              <input disabled={isNotFreelancer} type='checkbox' checked={isFreelancer} onChange={e => this.setState({isFreelancer: e.target.checked})} />
            </div>
            <div style={{margin: '0 10px'}} >
              <label>Non-Influencer Only</label>
              <input disabled={isInfluencer} type='checkbox' checked={isNotInfluencer} onChange={e => this.setState({isNotInfluencer: e.target.checked})} />
            </div>
            <div style={{margin: '0 10px'}} >
              <label>Influencer Only</label>
              <input disabled={isNotInfluencer} type='checkbox' checked={isInfluencer} onChange={e => this.setState({isInfluencer: e.target.checked})} />
            </div>
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
        </div>}
      </div>
    );
  }
}

export default connect(
  (state, props) => ({}),
  (dispatch) => ({
    fetchSearch: query => dispatch({type: 'FETCH_QUERY_SEARCH', query})
  })
  )(withRouter(SearchPage));
