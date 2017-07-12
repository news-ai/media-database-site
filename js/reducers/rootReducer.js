import {combineReducers} from 'redux';

import personReducer from 'components/Login/reducer';
import contactReducer from 'components/Contacts/reducer';

const rootReducer = combineReducers({
  personReducer,
  contactReducer
});

export default rootReducer;
