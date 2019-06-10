import { LOAD_POSTS, UPDATE_POST, UPDATE_MORE, UPDATE_KEY_WORD } from '../actionTypes'

const R = require('ramda')

const initialState = {
  posts: [],
  more: true,
  keyWord: ''
}

const assign = oldObj => newObj => Object.assign({}, oldObj, newObj)

export default function(state = initialState, { type, payload }) {
  switch (type) {
    case LOAD_POSTS: {
      const { data } = payload
      return assign(state)({ posts: [...state.posts, ...data] })
    }
    case UPDATE_POST: {
      const { post } = payload
      const has = !!R.find(R.propEq('id', post.id), state.posts)

      if (has) {
        const newPosts = state.posts.map(oldPost => (oldPost.id === post.id ? post : oldPost))
        return assign(state)({ posts: [...newPosts] })
      }
      return assign(state)({ posts: [post, ...state.posts] })
    }
    case UPDATE_MORE: {
      const { more } = payload
      return assign(state)({ more })
    }
    case UPDATE_KEY_WORD: {
      const { keyWord } = payload
      return assign(initialState)({ keyWord })
    }
    default:
      return state
  }
}
