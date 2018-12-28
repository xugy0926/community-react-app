import { UPDATE_HEADER, UPDATE_FOOTER, UPDATE_CURRENT_USER, UPDATE_MORE } from '../actionTypes'

const initialState = {
  header: {
    title: '',
    onBack: null,
    onSave: null
  },
  footer: {
    onFavorite: null,
    onAdd: null,
    onMy: null
  },
  user: null,
  more: true
}

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_HEADER: {
      return Object.assign(
        {},
        state,
        { header: initialState.header },
        { header: { ...action.payload } }
      )
    }
    case UPDATE_FOOTER: {
      return Object.assign(
        {},
        state,
        { footer: initialState.footer },
        { footer: { ...action.payload } }
      )
    }
    case UPDATE_CURRENT_USER: {
      const { user } = action.payload
      return Object.assign({}, state, { user })
    }
    case UPDATE_MORE: {
      const { more } = action.payload
      return Object.assign({}, state, { more })
    }
    default:
      return state
  }
}
