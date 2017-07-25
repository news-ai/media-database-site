import {combineEpics} from 'redux-observable';
import * as personEpics from 'components/Login/epics';

const rootEpic = combineEpics(
  ...personEpics
  );

export default rootEpic;
