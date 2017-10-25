import React, { Component } from 'react';
import {connect} from 'react-redux';
import withRouter from 'react-router/lib/withRouter';
import styled from 'styled-components';
import Select from 'react-select';
import {searchConstant} from './constants';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import isEmpty from 'lodash/isEmpty';
import queryString from 'query-string';
import pickBy from 'lodash/pickBy';
import {grey400, grey500, grey600, grey700, grey800} from 'material-ui/styles/colors';
import LocationSelector from 'components/Search/LocationSelector';
import MultiToggle from 'components/MultiToggle';

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

const StyledSelect = styled(Select)`
  & .Select-placeholder {
    font-size: 0.8em;
  }
`;

const freelancerToggleOptions = [
  {displayName: 'Include', value: 'freelancerInclude'},
  {displayName: 'Exclude', value: 'freelancerExclude'},
  {displayName: 'Only', value: 'freelancerOnly'},
];

const influencerToggleOptions = [
  {displayName: 'Include', value: 'influencerInclude'},
  {displayName: 'Exclude', value: 'influencerExclude'},
  {displayName: 'Only', value: 'influencerOnly'},
];

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beats: [],
      locations: [{country: 'United States'}],
      freelancerSelect: 'freelancerInclude',
      influencerSelect: 'influencerInclude',
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

      if (query.isFreelancer === true) this.setState({freelancerSelect: 'freelancerOnly'});
      else if (query.isFreelancer === false) this.setState({freelancerSelect: 'freelancerExclude'});
      else this.setState({freelancerSelect: 'freelancerInclude'});

      if (query.isInfluencer === true) this.setState({influencerSelect: 'influencerOnly'});
      else if (query.isInfluencer === false) this.setState({influencerSelect: 'influencerExclude'});
      else this.setState({influencerSelect: 'influencerInclude'});
    }
  }

  onSubmit() {
    const baseQuery = {};
    if (this.state.beats.length > 0) baseQuery.beats = this.state.beats.map(({value}) => value);
    if (this.state.advancedSearchOpen || !this.props.hideable) {
      if (this.state.freelancerSelect === 'freelancerOnly') baseQuery.isFreelancer = true;
      else if (this.state.freelancerSelect === 'freelancerExclude') baseQuery.isFreelancer = false;

      if (this.state.influencerSelect === 'influencerOnly') baseQuery.isInfluencer = true;
      else if (this.state.influencerSelect === 'influencerExclude') baseQuery.isInfluencer = false;

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
    // TODO: implement more countries when available
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
    const {freelancerSelect, influencerSelect} = this.state;
    return (
      <div style={{minWidth: 400}} >
        <div style={{margin: '5px 0', width: 250, display: 'block'}} >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} >
            <label>Beat(s)</label>
          </div>
          <StyledSelect
          multi
          placeholder='Beats (e.g. Technology, Science)'
          labelKey='value'
          value={this.state.beats}
          options={beatOptions}
          onChange={beats => this.setState({beats})}
          />
        </div>
        <div>
          <div style={{width: 400}} >
            <MultiToggle
            options={freelancerToggleOptions}
            selectedOption={freelancerSelect}
            onSelectOption={value => this.setState({freelancerSelect: value})}
            label='Is Freelancer'
            />
          </div>
          <div style={{width: 400}} >
            <MultiToggle
            options={influencerToggleOptions}
            selectedOption={influencerSelect}
            onSelectOption={value => this.setState({influencerSelect: value})}
            label='Is Influencer'
            />
          </div>
        </div>
        <div style={{margin: '10px 0'}} >
          <div className='vertical-center'>
            <label>Location Filter(s)</label>
            <FontIcon
            className='fa fa-plus pointer'
            style={{fontSize: '0.9em', margin: '0 10px'}}
            color={grey500}
            hoverColor={grey700}
            onClick={this.onLocationAdd}
            />
          </div>
          <LocationSelector
          locations={this.state.locations}
          onLocationSelect={this.onLocationSelect}
          onLocationAdd={this.onLocationAdd}
          onLocationDelete={this.onLocationDelete}
          />
        </div>
        <div className='horizontal-center' style={{margin: '30px 0'}} >
          <RaisedButton primary label='Submit' onClick={this.onSubmit} />
        </div>
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
