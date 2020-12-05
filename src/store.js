import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware } from 'react-router-redux'

import logger from 'redux-logger'

export const history = createHistory()
const middleware = routerMiddleware(history)

import authReducer from './reducers/auth'
import apiReducer from './reducers/api'
import stateReducer from './reducers/state'
import discoverReducer from './reducers/discover'
import { modelReducer } from './reducers/model'
import { searchReducer } from './reducers/search'
import { requestReducer } from './reducers/requests'
import config from './config';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  combineReducers({
    session: authReducer,
    api: apiReducer,
    state: stateReducer,
    discover: discoverReducer,
    router: routerReducer,
    currentModel: modelReducer,
    search: searchReducer,
    requests: requestReducer,
  }),
  (config.env === 'development') ? composeEnhancers(applyMiddleware(thunk, middleware, logger))
      : composeEnhancers(applyMiddleware(thunk, middleware)),
)