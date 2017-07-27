import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import Tag from 'components/Tags/Tag';
import Image from './Image';
import {grey50, lightBlue50, lightBlue300, blue50, blue300, grey700} from 'material-ui/styles/colors';

const ListItem = ({email, contactInfo, demographics, writingInformation, organizations, photos}) => (
  <div className='row' style={{
    margin: '5px 5px',
    padding: 5,
    borderBottom: `3px solid ${lightBlue300}`,
    borderLeft: `3px solid ${lightBlue300}`
  }} >
    <div className='large-10 medium-9 small-8'>
      <div className='row'>
        <div className='large-12 medium-12 small-12 columns'>
          {contactInfo.fullName}
        </div>
        <div className='large-12 medium-12 small-12 columns'>
          {demographics.locationGeneral}
        </div>

        <div className='large-12 medium-12 small-12 columns vertical-center'>
          <label>Beat(s)</label>
          {writingInformation.beats.map(beat => <Tag key={beat} color={lightBlue50} borderColor={blue300} hideDelete text={beat} />)}
          {writingInformation.occasionalBeats.map(beat => <Tag key={beat} color={blue50} borderColor={blue300} hideDelete text={beat} />)}
        </div>
        <div className='large-12 medium-12 small-12 columns'>
          <Link to={{
            pathname: `/contacts/contact`,
            search: `?email=${email}`,
          }}>
          {email}
          </Link>
        </div>
      </div>
    </div>
    <div className='large-2 medium-3 small-4 vertical-center horizontal-center'>
    {photos &&
      <Image style={{borderRadius: '50%', maxHeight: 100, maxWidth: 100}} src={photos[0].url} />}
    </div>
  </div>
  );

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
    <div className='row horizontal-center'>
      <div className='large-8 medum-10 small-12 columns'>
      {contacts.map(contact => <ListItem key={contact.email} {...contact} />)}
      </div>
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
