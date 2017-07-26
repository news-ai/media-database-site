import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import * as contactActions from './actions';
import queryString from 'query-string';
import {lightBlue50, blue50, blue300, grey700} from 'material-ui/styles/colors';
import Image from './Image';
import Tag from 'components/Tags/Tag';
import TweetFeed from 'components/Contacts/Tweets/TweetFeed';
import HeadlineFeed from 'components/Headlines/HeadlineFeed';

const ContactView = ({contactInfo, demographics, photos, writingInformation, twitter}) => (
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
    {twitter &&
      <div style={{display: 'block', margin: '20px 10px'}} >
        <span style={{color: grey700}} >{twitter.description}</span>
      </div>}
      <div style={{display: 'block', marginTop: 20}} >
        {writingInformation.beats.map(beat => <Tag key={beat} textStyle={{fontSize: '1em'}} color={lightBlue50} borderColor={blue300} hideDelete text={beat} />)}
        {writingInformation.occasionalBeats.map(beat => <Tag key={beat} textStyle={{fontSize: '1em'}} color={blue50} borderColor={blue300} hideDelete text={beat} />)}
      </div>
    </div>
    {writingInformation.isFreelancer && <span>Freelancing</span>}
  </div>
  );

class Contact extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.contact) {
      this.props.fetchContactProfile();
    }
  }

  render() {
    const {contact, query, email, isReceiving, twitter} = this.props;
    // console.log(contact);
    // console.log(query);
    // console.log(email);
    let renderNode = <div>Not Found</div>;
    if (isReceiving) renderNode = <div>LOADING...</div>;
    if (contact && !isReceiving) {
      renderNode = (
      <div className='row horizontal-center'>
        <div className='large-8 medium-10 small-12 columns' >
          <ContactView {...contact} twitter={twitter} />
          <div style={{padding: '10px 0', backgroundColor: lightBlue50}} >
            <span style={{color: grey700, marginLeft: 10}} >Recent Headlines</span>
          </div>
          <HeadlineFeed height={350} email={email} />
          <div style={{padding: '10px 0', backgroundColor: lightBlue50}} >
            <span style={{color: grey700, marginLeft: 10}} >Tweets</span>
          </div>
          <TweetFeed height={350} email={email} />
        </div>
      </div>
      );
    }
    return renderNode;
  }
}

const mapStateToProps = (state, props) => {
  const query = queryString.parse(props.location.search);
  return {
    isReceiving: state.contactReducer.isReceiving,
    contact: state.contactReducer[query.email],
    twitter: state.twitterProfileReducer[query.email],
    email: query.email,
    query
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const query = queryString.parse(props.location.search);
  return {
    fetchContactProfile: _ => dispatch({type: 'FETCH_CONTACT_PROFILE', email: query.email}),
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
