import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {twitterProfileConstant} from './constants';

export const fetchTwitterProfile = (action$, {getState}) =>
  action$.ofType('FETCH_TWITTER_PROFILE')
  .filter(({email}) => {
    const contact = getState().twitterProfileReducer[email];
    return contact ? !contact.isReceiving : true;
  })
  .switchMap(({email}) =>
    Observable.merge(
      Observable.of({type: twitterProfileConstant.REQUEST, email}),
      Observable.from(api.get(`/database-contacts/${email}/twitterprofile`))
      .catch(err => ({type: twitterProfileConstant.REQUEST_FAIL, message: err}))
      .map(response => ({email, type: twitterProfileConstant.RECEIVE, profile: response.data}))
      )
    )
  .takeUntil(action$.ofType('FETCH_TWITTER_PROFILE_ABORT'))
