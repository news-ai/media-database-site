import {searchConstant} from './constants';
import {assignToEmpty} from 'utils/assign';

const initialState = {
  isReceiving: false,
  didInvalidate: false,
  received: [],
  mostRecent: undefined
};

function searchReducer(state = initialState, action) {
  if (window.isDev) Object.freeze(state);
  switch (action.type) {
    case searchConstant.REQUEST:
      return assignToEmpty(state, {isReceiving: true});
    case searchConstant.RECEIVE:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: false,
        mostRecent: action.timestamp,
        received: [...state.received, action.query.toString()],
        [action.query.toString()]: {
          // TODO: FILL WITH QUERY STUFF HERE
          selected: [],
          query: action.query
        }
      });
    case searchConstant.REQUEST_FAIL:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: true,
      });
    case searchConstant.REQUEST_ABORT:
      return assignToEmpty(state, {
        isReceiving: false,
        didInvalidate: false,
      });
    case 'SELECT_SEARCH_ITEMS':
      return assignToEmpty(state, {
        [action.query.toString()]: assignToEmpty(state[action.query.toString()], {
          selected: action.selected
        })
      });
    default:
      return state;
  }
}

export default searchReducer;
