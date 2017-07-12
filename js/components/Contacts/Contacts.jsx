import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import * as contactActions from './actions';
import queryString from 'query-string';
import {lightBlue50, blue100, grey700} from 'material-ui/styles/colors';
import Image from './Image';
import Tag from 'components/Tags/Tag';


const ContactView = ({contactInfo, demographics, photos, writingInformation}) => (
  <div>
    <div style={{padding: '20px 0'}} >
      <div className='right'>
        <Image style={{borderRadius: '50%', maxHeight: 100, maxWidth: 100}} src={photos[0].url} />
      </div>
      <div style={{display: 'block'}} >
        <span style={{color: grey700, fontSize: '1.5em'}} >{contactInfo.fullName}</span>
      </div>
      <div style={{display: 'block'}} >
        <span style={{color: grey700, fontSize: '1.1em'}} >{demographics.locationGeneral}</span>
      </div>
    </div>
    beats: {writingInformation.beats.map(beat => <Tag borderColor={blue100} hideDelete text={beat} />)}
    occasionalBeats: {writingInformation.occasionalBeats.map(beat => <Tag borderColor={blue100} hideDelete text={beat} />)}
    {writingInformation.isFreelancer && <span>Freelancing</span>}
  </div>
  );

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
    const {contact, query, email, isReceiving} = this.props;
    console.log(contact);
    console.log(query);
    console.log(email);
    let renderNode = <div>Not Found</div>;
    if (isReceiving) renderNode = <div>LOADING...</div>;
    if (contact) renderNode = (
      <div className='row horizontal-center'>
        <div className='large-8 medium-10 small-12 columns' >
          <ContactView {...contact} />
        </div>
      </div>);
    return renderNode;
  }
}

const mapStateToProps = (state, props) => {
  const query = queryString.parse(props.location.search);
  return {
    isReceiving: state.contactReducer.isReceiving,
    contact: state.contactReducer[query.email],
    email: query.email,
    query
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchContact: email => dispatch(contactActions.fetchContact(email)),
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
