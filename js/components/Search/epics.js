
import * as api from 'actions/api';
import 'rxjs';
import {Observable} from 'rxjs';
import {searchConstant} from './constants';

const formatQuery = ({beats, isFreelancer}) => {
  const baseQuery = {included: {}};
  if (beats) baseQuery.included.beats = beats;
  if (isFreelancer !== undefined) baseQuery.included.isFreelancer = isFreelancer;
  return baseQuery;
};

export const fetchSearch = action$ =>
  action$.ofType(searchConstant.REQUEST)
  .switchMap(({query}) => {
    const formattedQuery = formatQuery(query);
    console.log(formattedQuery);
    return Observable.from(api.post('/database-contacts/search', formattedQuery))
    .map(response => {
      console.log(response);
      return ({type: searchConstant.RECEIVE});
    });
  })
  .takeUntil(action$.ofType(searchConstant.REQUEST_ABORT));
