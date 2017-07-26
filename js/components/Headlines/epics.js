import * as api from 'actions/api';
import {normalize, schema} from 'normalizr';
import 'rxjs';
import {Observable} from 'rxjs';
import get from 'lodash/get';
import {headlineConstant} from './constants';

const headlineSchema = new schema.Entity('headlines', {}, {idAttribute: 'url'});
const headlineListSchema = [headlineSchema];

// export function fetchContactHeadlines(email) {
//   return dispatch => {
//     dispatch({type: 'CONTACT_HEADLINES_REQUEST', email});
//     return api.get(`${window.TABULAE_API_BASE}/database-contacts/${email}/headlines`)
//     .then(response => {
//       const res = normalize(response, {data: arrayOf(headlineSchema)});
//       return dispatch({type: 'CONTACT_HEADLINES_RECEIVE', ids: res.result.data, headlines: res.entities.headlines});
//     })
//     .catch(err => console.log(err));
//   };
// }

const PAGE_LIMIT = 50;
export const fetchContactHeadlines = (action$, {getState}) =>
  action$.ofType('FETCH_CONTACT_HEADLINES')
  .filter(({email}) => {
    const contact = getState().headlineReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) => {
    const OFFSET = get(getState(), `headlineReducer[${email}].offset`, 0);
    return Observable.merge(
      Observable.of({type: headlineConstant.REQUEST_MULTIPLE, email}),
      Observable.fromPromise(api.get(`/database-contacts/${email}/headlines?limit=${PAGE_LIMIT}&offset=${OFFSET}`))
      .map(response => {
        const res = normalize(response.data, headlineListSchema);
        return ({
          type: headlineConstant.RECEIVE_MULTIPLE,
          email,
          headlines: res.entities.headlines,
          ids: res.result,
          offset: res.result.length < PAGE_LIMIT ? null : OFFSET + PAGE_LIMIT
        });
      })
      .catch(err => ({type: headlineConstant.REQUEST_MULTIPLE_FAIL, message: err}))
    );
  })
  .takeUntil(action$.ofType(headlineConstant.ABORT));

