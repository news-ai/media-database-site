import {combineEpics} from 'redux-observable';
import {fetchPerson, setupThirdparty} from 'components/Login/epics';
import {fetchContactTweets} from 'components/Contacts/Tweets/epics';
import {fetchContactHeadlines} from 'components/Headlines/epics';
import {fetchTwitterProfile} from 'components/Contacts/TwitterProfile/epics';
import {fetchContactProfile, fetchContact} from 'components/Contacts/epics';

const rootEpic = combineEpics(
  fetchPerson,
  setupThirdparty,
  fetchTwitterProfile,
  fetchContactTweets,
  fetchContactProfile,
  fetchContact,
  fetchContactHeadlines
  );

export default rootEpic;
