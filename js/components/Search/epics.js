
import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {searchConstant} from './constants';

export const fetchPerson = action$ =>
  action$.ofType(searchConstant.REQUEST)
  .switchMap(_ => {
    return Observable.from(api.get('/users/me'))
    .map(response => ({type: searchConstant.RECEIVE, person: response.data}));
  })
  .takeUntil(action$.ofType(searchConstant.REQUEST_ABORT));
