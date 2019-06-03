import { LOAD_NOTES, UPDATE_NOTE, DELETE_NOTE } from '../actionTypes'

const R = require('ramda')

const initialState = {
  notes: []
}

const assign = oldObj => newObj => Object.assign({}, oldObj, newObj)

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_NOTES: {
      const { notes } = action.payload
      return assign(state)({ notes: [...state.notes, ...notes] })
    }
    case UPDATE_NOTE: {
      const { note } = action.payload
      const has = !!R.find(R.propEq('id', note.id), state.notes)

      if (has) {
        const newNotes = state.notes.map(oldNote => (oldNote.id === note.id ? note : oldNote))
        return assign(state)({ notes: [...newNotes] })
      }
      return assign(state)({ notes: [note, ...state.notes] })
    }
    case DELETE_NOTE: {
      const { note } = action.payload
      const notes = R.filter(item => item.id !== note.id, state.notes)

      return assign(state)({ notes: [...notes] })
    }
    default:
      return state
  }
}
