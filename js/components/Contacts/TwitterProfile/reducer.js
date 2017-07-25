import {twitterProfileConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: [],
};

function twitterProfileReducer(state = initialState, action) {
  if (process.env.NODE_ENV === 'development') Object.freeze(state);

  let obj;
  switch (action.type) {
    case twitterProfileConstant.REQUEST:
      obj = assignToEmpty(state, {});
      obj.isReceiving = true;
      return obj;
    case twitterProfileConstant.RECEIVE:
      obj = assignToEmpty(state, {});
      obj[action.email] = action.profile;
      obj.isReceiving = false;
      return obj;
    case twitterProfileConstant.REQUEST_FAIL:
      obj = assignToEmpty(state, {});
      obj.didInvalidate = true;
      return obj;
    default:
      return state;
  }
}

export default twitterProfileReducer;
