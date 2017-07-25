import * as api from 'actions/api';
import 'rxjs';
import {loginConstant} from './constants';

export const fetchPerson = action$ =>
  action$.ofType(loginConstant.REQUEST)
  .switchMap(_ =>
    api.get('/users/me')
    .then(response => response.data)
    // .catch(error => Observable.of({type: loginConstant.REQUEST_FAIL, message: error}))
    )
  .takeUntil(action$.ofType(loginConstant.CANCELLED))
  .map(person => ({type: loginConstant.RECEIVE, person}));
