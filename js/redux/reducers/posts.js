import { LOAD_POSTS, UPDATE_POST } from '../actionTypes'

const R = require('ramda')

export default function(state = [], action) {
  switch (action.type) {
    case LOAD_POSTS: {
      const { posts } = action.payload
      return [...state, ...posts]
    }
    case UPDATE_POST: {
      const { post } = action.payload
      const has = R.find(R.propEq('id', post.id), state) ? true : false

      if (has) {
        return state.map(oldPost => (oldPost.id === post.id ? post : oldPost))
      } else {
        return [post, ...state]
      }
    }
    default:
      return state
  }
}
