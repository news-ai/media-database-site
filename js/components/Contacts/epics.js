import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {contactConstant} from './constants';

export const fetchContactProfile = action$ =>
  action$.ofType('FETCH_CONTACT_PROFILE')
  .switchMap(({email}) =>
    Observable.merge(
      Observable.of({type: 'FETCH_CONTACT', email}),
      // Observable.of({type: 'FETCH_TWITTER_PROFILE', email}),
      Observable.of({type: 'FETCH_CONTACT_TWEETS', email})
      )
    )
  .takeUntil(action$.ofType('FETCH_CONTACT_PROFILE_ABORT'));

export const fetchContact = (action$, {getState}) =>
  action$.ofType('FETCH_CONTACT')
  .filter(({email}) => {
    const contact = getState().contactReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) =>
    Observable.merge(
      Observable.of({type: contactConstant.REQUEST, email}),
      Observable.fromPromise(api.get(`/database-contacts/${email}`))
      .map(response => ({type: contactConstant.RECEIVE, email, contact: response.data}))
      .catch(err => ({type: contactConstant.REQUEST_FAIL, message: err, email}))
      )
    )
  .takeUntil(action$.ofType(contactConstant.ABORT));
