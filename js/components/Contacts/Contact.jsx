// NOT USING
import React, { Component } from 'react';
import {connect} from 'react-redux';
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
    const {contact, match} = this.props;
    console.log(contact);
    return (
      <div>{this.props.match.params.email} </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const email = props.match.params.email;
  return {
    contact: state.contactReducer[email],
    email
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchContact: email => dispatch(contactActions.fetchContact(email))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
