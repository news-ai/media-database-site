import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers/rootReducer';
import rootEpic from './reducers/rootEpic';
import { createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware(rootEpic);

export default function configureStore() {
  const loggerMiddleware = createLogger();
  const createStoreWithMiddleware = process.env.NODE_ENV === 'development' ?
    applyMiddleware(
      thunk,
      loggerMiddleware,
      epicMiddleware
      )(createStore) :
    applyMiddleware(
      thunk,
      epicMiddleware
      )(createStore);
  return createStoreWithMiddleware(rootReducer);
}
