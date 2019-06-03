import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  const result = next(action)
  console.info('next state', store.getState())
  console.groupEnd()
  return result
}

function warn(error) {
  console.warn(error.message || error)
  throw error
}

const promise = store => next => action =>
  typeof action.then === 'function' ? Promise.resolve(action).then(next, warn) : next(action)

const thunk = store => next => action =>
  typeof action === 'function' ? action(store.dispatch, store.getState) : next(action)

export default createStore(rootReducer, applyMiddleware(thunk, promise, logger))
