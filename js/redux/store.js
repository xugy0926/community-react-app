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

const loading = store => next => action => {
  const { types, callAPI, shouldCallAPI = () => true, payload = {} } = action
  if (!types) {
    // Normal action: pass it on
    return next(action)
  }

  if (
    !Array.isArray(types) ||
    types.length !== 4 ||
    !types.every(type => typeof type === 'string')
  ) {
    throw new Error('Expected an array of three string types.')
  }

  if (typeof callAPI !== 'function') {
    throw new Error('Expected callAPI to be a function.')
  }

  if (!shouldCallAPI(store.getState())) {
    return
  }

  const [runType, requestType, successType, failureType] = types

  next(Object.assign({}, payload, { type: requestType }))

  return callAPI().then(
    data => {
      next({
        payload: Object.assign({}, payload, { data }),
        type: runType
      })

      next({
        type: successType
      })
    },
    error =>
      next({
        payload: Object.assign({}, payload, { error }),
        type: failureType
      })
  )
}

export default createStore(rootReducer, applyMiddleware(thunk, promise, loading, logger))
