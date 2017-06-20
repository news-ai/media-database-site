import {combineReducers} from 'redux';

import personReducer from 'components/Login/reducer';

const rootReducer = combineReducers({
  personReducer,
});

export default rootReducer;
