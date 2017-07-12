import {combineReducers} from 'redux';

import personReducer from 'components/Login/reducer';
import contactReducer from 'components/Contacts/reducer';
import tweetReducer from 'components/Contacts/Tweets/reducer';

const rootReducer = combineReducers({
  personReducer,
  contactReducer,
  tweetReducer
});

export default rootReducer;
