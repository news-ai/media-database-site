import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import * as contactActions from './actions';
import queryString from 'query-string';

class Contact extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.contact) {
      this.props.fetchContact(this.props.email);
    }
  }

  render() {
    const {contact, query, email} = this.props;
    console.log(contact);
    console.log(query);
    console.log(email);
    return (
      <div>WHY</div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const query = queryString.parse(props.location.search);
  return {
    contact: state.contactReducer[query.email],
    email: query.email,
    query
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchContact: email => dispatch(contactActions.fetchContact(email))
  };
};

const ContactContainer = connect(mapStateToProps, mapDispatchToProps)(Contact);

const ContactsContainer = ({match, location}) => {
  return (
    <div>
      <Route path={match.url} component={ContactContainer} />
    </div>
    );
};

export default ContactsContainer;
