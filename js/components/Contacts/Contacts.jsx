import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import Contact from './Contact';
import queryString from 'query-string';

class Contacts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchPlaceholderContacts();
  }

  render() {
    const {isReceiving, contacts} = this.props;

    return isReceiving || !contacts ? <div>LOADING</div> : (
    <div>CONTACTS</div>
    );
  }
}


const ContactsContainer = connect(
  ({contactReducer}) => ({
    isReceiving: contactReducer.isReceiving,
    contacts: contactReducer.received.map(id => contactReducer[id])
  }),
  dispatch => ({
    fetchPlaceholderContacts: _ => dispatch({type: 'FETCH_PLACEHOLDER_CONTACTS'})
  })
  )(Contacts);

const ContactsRouteContainer = ({match, location}) => {
  const query = queryString.parse(location.search);
  return (
    <div>
      <Route path='/contacts' component={query.email ? Contact : ContactsContainer} />
    </div>
    );
};

export default ContactsRouteContainer;
