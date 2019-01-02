import { LOAD_POSTS, UPDATE_POST, UPDATE_MORE, UPDATE_KEY_WORD } from '../actionTypes'

const R = require('ramda')

const initialState = {
  posts: [],
  more: true,
  keyWord: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_POSTS: {
      const { posts } = action.payload
      return Object.assign({}, state, { posts: [...state.posts, ...posts] })
    }
    case UPDATE_POST: {
      const { post } = action.payload
      const has = R.find(R.propEq('id', post.id), state.posts) ? true : false

      if (has) {
        return state.posts.map(oldPost => (oldPost.id === post.id ? post : oldPost))
      } else {
        return Object.assign({}, state, { posts: [...state.posts] })
      }
    }
    case UPDATE_MORE: {
      const { more } = action.payload
      return Object.assign({}, state, { more })
    }
    case UPDATE_KEY_WORD: {
      const { keyWord } = action.payload
      return Object.assign({}, initialState, { keyWord })
    }
    default:
      return state
  }
}
