import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';

class Contacts extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.contacts.length <= 1) this.props.fetchPlaceholderContacts();
  }

  render() {
    const {isReceiving, contacts} = this.props;

    return isReceiving || !contacts ? <div>LOADING</div> : (
    <div>
      {contacts.map(contact =>
        <Link style={{display: 'block'}} to={{
          pathname: `/contacts/contact`,
          search: `?email=${contact.email}`,
        }}>
        {contact.email}
        </Link>
      )}
    </div>
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

export default ContactsContainer;
