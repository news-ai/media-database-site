import React, { Component } from 'react';
import * as api from 'actions/api';
// import {connect} from 'react-redux';
// import withRouter from 'react-router/lib/withRouter';
import Select from 'react-select';
// import {searchConstant} from './constants';

import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import {grey600} from 'material-ui/styles/colors';
import debounce from 'es6-promise-debounce';

import 'react-select/dist/react-select.css';

const styles = {
  select: {
    width: 200,
    display: 'inline-block'
  },
  selectContainer: {
    margin: '10px 0'
  },
  smallIcon: {
    width: 18,
    height: 18,
  },
  small: {
    width: 36,
    height: 36,
    padding: 8,
  },
};

const loadCountries = debounce((value, cb) => {
  return api.get(`/database-contacts/locations?country=${value}`)
  .then(response => {
    console.log(response);
    cb(null, {options: response.data.map(({countryName}) => ({value: countryName}))});
  });
}, 750);

class LocationSelector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      {this.props.locations.map(({country, state, city}, i) =>
        <div style={styles.selectContainer} key={`select-${i}`} >
          <div className='vertical-center'>
            <div style={styles.select} >
              <Select.Async
              placeholder='Country'
              labelKey='value'
              onChange={obj => this.props.onLocationSelect(i, {country: !!obj ? obj.value : undefined, state, city})}
              value={country}
              loadOptions={loadCountries}
              />
            </div>
            <div style={styles.select} >
              <Select
              placeholder='State'
              labelKey='value'
              onChange={obj => this.props.onLocationSelect(i, {country, state: !!obj ? obj.value : undefined, city})}
              value={state}
              options={[{value: 'New York'}]}
              />
            </div>
            <div style={styles.select} >
              <Select
              placeholder='City'
              labelKey='value'
              onChange={obj => this.props.onLocationSelect(i, {country, state, city: !!obj ? obj.value : undefined})}
              value={city}
              options={[{value: 'Boston'}]}
              />
            </div>
          {i > 0 &&
            <div style={{margin: '0 10px'}} >
              <IconButton
              tooltip='Remove'
              tooltipPosition='top-right'
              style={styles.small}
              iconStyle={Object.assign({}, styles.smallIcon, {color: grey600})}
              iconClassName='fa fa-times'
              onClick={_ => this.props.onLocationDelete(i)}
              />
            </div>}
          </div>
        </div>
        )}
        <FlatButton label='Add Location' icon={<FontIcon className='fa fa-plus' />} onClick={this.props.onLocationAdd} />
      </div>
    );
  }
}

export default LocationSelector;
