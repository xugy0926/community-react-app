import {
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  UPDATE_LOADING,
  UPDATE_HEADER,
  UPDATE_FOOTER,
  UPDATE_CURRENT_USER
} from '../actionTypes'

const initialState = {
  header: {
    title: '',
    onBack: null,
    onSave: null,
    onAdd: null,
    onSearch: null
  },
  footer: {
    onFavorite: null,
    onMy: null
  },
  user: null,
  loading: false
}

const assign = oldObj => newObj => Object.assign({}, oldObj, newObj)

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case LOAD_REQUEST: {
      return assign(state)({ loading: true })
    }
    case LOAD_SUCCESS: {
      return assign(state)({ loading: false })
    }
    case LOAD_FAILURE: {
      return assign(state)({ loading: false })
    }
    case UPDATE_LOADING: {
      const { loading } = payload
      return assign(state)({ loading })
    }
    case UPDATE_HEADER: {
      return assign(state)(assign({ header: initialState.header })({ header: { ...payload } }))
    }
    case UPDATE_FOOTER: {
      return assign(state)(assign({ footer: initialState.footer })({ footer: { ...payload } }))
    }
    case UPDATE_CURRENT_USER: {
      const { user } = payload
      return assign(state)({ user })
    }
    default:
      return state
  }
}
