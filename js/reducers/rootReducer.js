import {combineReducers} from 'redux';

import personReducer from 'components/Login/reducer';
import contactReducer from 'components/Contacts/reducer';
import tweetReducer from 'components/Contacts/Tweets/reducer';
import headlineReducer from 'components/Headlines/reducer';
import twitterProfileReducer from 'components/Contacts/TwitterProfile/reducer';

const rootReducer = combineReducers({
  personReducer,
  contactReducer,
  tweetReducer,
  twitterProfileReducer,
  headlineReducer
});

export default rootReducer;
