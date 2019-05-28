import { UPDATE_HEADER, UPDATE_FOOTER, UPDATE_CURRENT_USER } from '../actionTypes'

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
  user: null
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
    default:
      return state
  }
}
