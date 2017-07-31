import React, {Component} from 'react';
import {connect} from 'react-redux';
import Link from 'react-router/lib/Link';
import Tag from 'components/Tags/Tag';
import Image from './Image';
import {grey50, blueGrey50, blueGrey300, lightBlue50, lightBlue300, blue50, blue300, grey700} from 'material-ui/styles/colors';
import {assignToEmpty} from 'utils/assign';

const ListItem = ({email, contactInfo, demographics, writingInformation, organizations, photos}) => (
  <div className='row' style={{
    padding: 3,
    // borderBottom: `3px solid ${blueGrey300}`,
    borderLeft: `3px solid ${lightBlue300}`,
    backgroundColor: '#ffffff'
  }} >
    <div className='large-10 medium-9 small-8'>
      <div className='row' style={{paddingLeft: 10}} >
        <div className='large-12 medium-12 small-12 columns'>
          <Link to={{
            pathname: `/contacts/contact`,
            search: `?email=${email}`,
          }} style={{color: grey700, fontWeight: 'bold'}}>
          {contactInfo.fullName}
          </Link>
        </div>
        <div className='large-12 medium-12 small-12 columns'>
        {organizations &&
          <span className='text'>{organizations[0].name}</span>}
        {organizations && organizations[0].name &&
          <span className='text' style={{marginLeft: 10, color: grey700}} >{organizations[0].title}</span>}
        </div>
        <div className='large-12 medium-12 small-12 columns'>
          <span style={{color: grey700}} className='text'>{demographics.locationGeneral}</span>
        </div>
        <div className='large-12 medium-12 small-12 columns vertical-center'>
          <label style={{color: grey700}}>Beat(s)</label>
          {writingInformation.beats.map(beat =>
            <Tag key={beat} color={lightBlue50} borderColor={blue300} hideDelete text={beat} />)}
          {writingInformation.occasionalBeats.map(beat =>
            <Tag key={beat} color={blue50} borderColor={blue300} hideDelete text={beat} />)}
        </div>
      </div>
    </div>
    <div className='large-2 medium-3 small-4 vertical-center horizontal-center'>
    {photos &&
      <Image style={{borderRadius: '4%', maxHeight: 90, maxWidth: 90}} src={photos[0].url} />}
    </div>
  </div>
  );

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      lastSelectedIndex: undefined
    };
    this.onSelectContact = this.onSelectContact.bind(this);
    this.onSelectAllContacts = contacts => {
      const {selected} = this.state;
      const hasSelectedAll = contacts.reduce((acc, contact) => selected[contact.email] ? acc + 1 : acc, 0) === contacts.length;
      const newSelected = contacts.reduce((acc, contact) => {
        acc[contact.email] = !hasSelectedAll;
        return acc;
      }, {});
      this.setState({selected: newSelected, lastSelectedIndex: undefined});
    };
  }

  componentDidMount() {
    if (this.props.contacts.length <= 1) this.props.fetchPlaceholderContacts();
  }

  onSelectContact(e, index) {
    // handle shift + click multiselect
    e.stopPropagation();
    const {lastSelectedIndex, selected} = this.state;
    const {contacts} = this.props;
    let start = index;
    let end = index + 1;
    if (e.nativeEvent.shiftKey && lastSelectedIndex !== undefined) {
      if (lastSelectedIndex < index) {
        start = lastSelectedIndex + 1;
        end = index + 1;
      } else if (lastSelectedIndex > index) {
        end = lastSelectedIndex;
      }
    }
    const newSelected = assignToEmpty(selected, {});
    for (let i = start; i < end; i++) {
      const {email} = contacts[i];
      newSelected[email] = !selected[email];
    }
    this.setState({selected: newSelected, lastSelectedIndex: index});
  }

  render() {
    const {isReceiving, contacts} = this.props;
    const {selected} = this.state;

    return isReceiving || !contacts ? <div>LOADING</div> : (
    <div style={{backgroundColor: blueGrey50}} className='row horizontal-center'>
      <div className='large-8 medum-10 small-12 columns'>
        <div className='row' style={{
          margin: '7px 5px',
        }} >
          <div style={{backgroundColor: '#ffffff'}} className='large-1 medium-1 small-2 columns vertical-center horizontal-center'>
            <input onChange={_ => this.onSelectAllContacts(contacts)} type='checkbox' checked={contacts.reduce((acc, {email}) => selected[email] ? acc + 1 : acc, 0) === contacts.length} />
          </div>
          <div className='large-11 medium-11 small-10 columns'>
          </div>
        </div>
      {contacts.map((contact, index) =>
        <div className='row' style={{
          margin: '7px 5px',
        }} >
          <div style={{backgroundColor: '#ffffff', userSelect: 'none'}} className='large-1 medium-1 small-2 columns vertical-center horizontal-center'>
            <input type='checkbox' onChange={e => this.onSelectContact(e, index)} checked={selected[contact.email]} />
          </div>
          <div className='large-11 medium-11 small-10 columns'>
            <ListItem key={contact.email} {...contact} />
          </div>
        </div>
        )}
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
