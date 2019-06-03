import {
  LOAD_POSTS,
  UPDATE_POST,
  UPDATE_MORE,
  UPDATE_KEY_WORD,
  UPDATE_LOADING
} from '../actionTypes'

const R = require('ramda')

const initialState = {
  posts: [],
  more: true,
  keyWord: '',
  loading: false
}

const assign = oldObj => newObj => Object.assign({}, oldObj, newObj)

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_POSTS: {
      const { posts } = action.payload
      return assign(state)({ posts: [...state.posts, ...posts] })
    }
    case UPDATE_POST: {
      const { post } = action.payload
      const has = !!R.find(R.propEq('id', post.id), state.posts)

      if (has) {
        const newPosts = state.posts.map(oldPost => (oldPost.id === post.id ? post : oldPost))
        return assign(state)({ posts: [...newPosts] })
      }
      return assign(state)({ posts: [post, ...state.posts] })
    }
    case UPDATE_MORE: {
      const { more } = action.payload
      return assign(state)({ more })
    }
    case UPDATE_KEY_WORD: {
      const { keyWord } = action.payload
      return assign(initialState)({ keyWord })
    }
    case UPDATE_LOADING: {
      const { loading } = action.payload
      return assign(state)({ loading })
    }
    default:
      return state
  }
}
