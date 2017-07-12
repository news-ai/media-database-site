
import {contactConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false
};

function contactReducer(state = initialState, action) {
  if (window.isDev) Object.freeze(state);
  switch (action.type) {
    case contactConstant.REQUEST:
      return assignToEmpty(state, {isReceiving: true});
    case contactConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        [action.email]: action.contact
      });
    case contactConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true
      });
    default:
      return state;
  }
}

export default contactReducer;
