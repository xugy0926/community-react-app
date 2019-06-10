import Parse from 'parse'
import { message } from 'antd'
import {
  LOAD_REQUEST,
  LOAD_SUCCESS,
  LOAD_FAILURE,
  UPDATE_HEADER,
  UPDATE_FOOTER,
  UPDATE_CURRENT_USER,
  UPDATE_MORE,
  UPDATE_KEY_WORD,
  UPDATE_POST,
  UPDATE_LOADING,
  LOAD_POSTS,
  DELETE_PROJECT,
  UPDATE_PROJECT,
  LOAD_PROJECTS,
  INIT_NOTES,
  LOAD_NOTES,
  UPDATE_NOTE,
  DELETE_NOTE
} from './actionTypes'

const R = require('ramda')

// post
const Post = Parse.Object.extend('Post')
const postQuery = new Parse.Query(Post)
postQuery.limit(30)
postQuery.descending('createdAt')

// project
const Project = Parse.Object.extend('Project')
const projectQuery = new Parse.Query(Project)
projectQuery.limit(100)
projectQuery.descending('createdAt')

// note
const Note = Parse.Object.extend('Note')
const noteQuery = new Parse.Query(Note)
noteQuery.limit(100)
noteQuery.descending('createdAt')

export const signup = (username, email, password) => {
  const user = new Parse.User()
  user.set('username', username)
  user.set('password', password)
  user.set('email', email)
  return user.signUp().then(user => ({
    type: UPDATE_CURRENT_USER,
    payload: {
      user
    }
  }))
}

export const signinWithAccount = (password, email) =>
  Parse.User.logIn(email, password).then(user => ({
    type: UPDATE_CURRENT_USER,
    payload: {
      user
    }
  }))

export const signin = () => {
  const sessionKey = 'community-app-session'
  const session = window.localStorage.getItem(sessionKey)

  if (session) {
    return Parse.User.become(session)
      .then(user => {
        window.localStorage.removeItem(sessionKey)
        return {
          type: UPDATE_CURRENT_USER,
          payload: {
            user
          }
        }
      })
      .catch(err => message.error(err.message))
  }

  return Parse.User.currentAsync()
    .then(user => ({
      type: UPDATE_CURRENT_USER,
      payload: {
        user
      }
    }))
    .catch(err => message.error(err.message))
}

export const logout = () =>
  Parse.User.logOut()
    .then(() => ({
      type: UPDATE_CURRENT_USER,
      payload: {
        user: null
      }
    }))
    .catch(() => ({
      type: UPDATE_CURRENT_USER,
      payload: {
        user: null
      }
    }))

const handleError = err => {
  const { code } = err
  if (code && code === Parse.Error.INVALID_SESSION_TOKEN) {
    logout()
  }

  return err
}

export const updateLoading = loading => ({
  type: UPDATE_LOADING,
  payload: { loading }
})

export const updateHeader = ({ ...header }) => ({
  type: UPDATE_HEADER,
  payload: header
})

export const updateFooter = ({ ...footer }) => ({
  type: UPDATE_FOOTER,
  payload: footer
})

export const updateMore = more => ({
  type: UPDATE_MORE,
  payload: {
    more
  }
})

export const loadPosts = () => (dispatch, getState) => {
  const { posts } = getState()

  postQuery.skip(posts.posts.length)
  postQuery.matches('title', posts.keyWord)

  dispatch({
    types: [LOAD_POSTS, LOAD_REQUEST, LOAD_SUCCESS, LOAD_FAILURE],
    callAPI: () => postQuery.find(),
    payload: {}
  })
}

export const loadPost = id => (dispatch, getState) => {
  const { posts } = getState().posts
  const post = R.find(R.propEq('id', id), posts)

  if (post) {
    return Promise.resolve(post)
  }

  const postQuery = new Parse.Query(Post)
  postQuery.equalTo('objectId', id)
  return postQuery.first()
}

export const updatePost = post => dispatch =>
  post.save().then(post => {
    dispatch({ type: UPDATE_POST, payload: { post } })
  })

export const updateKeyWord = keyWord => ({
  type: UPDATE_KEY_WORD,
  payload: {
    keyWord
  }
})

// projects
export const loadProjects = () => dispatch =>
  projectQuery.find().then(projects => dispatch({ type: LOAD_PROJECTS, payload: { projects } }))

export const loadProject = id => (dispatch, getState) => {
  const { projects } = getState().projects
  const project = R.find(R.propEq('id', id), projects)

  if (project) {
    return Promise.resolve(project)
  }

  const projectQuery = new Parse.Query(Project)
  projectQuery.equalTo('objectId', id)
  return projectQuery.first()
}

export const updateProject = project => dispatch =>
  project.save().then(project => {
    dispatch({ type: UPDATE_PROJECT, payload: { project } })
  })

export const deleteProject = project => dispatch =>
  project.destroy().then(() => {
    dispatch({ type: DELETE_PROJECT, payload: { project } })
  })

// notes

export const loadNotes = project => (dispatch, getState) => {
  const { notes, projectId } = getState().notes

  if (project.id !== projectId) {
    dispatch({ type: INIT_NOTES, payload: {} })
    noteQuery.skip(0)
  } else {
    noteQuery.skip(notes.length)
  }

  noteQuery.equalTo('parent', project)
  noteQuery.notEqualTo('type', 'achive')
  return noteQuery
    .find()
    .then(notes => {
      dispatch({ type: LOAD_NOTES, payload: { notes, projectId: project.id } })
    })
    .catch(handleError)
}

export const updateNote = note => dispatch =>
  note.save().then(note => {
    dispatch({ type: UPDATE_NOTE, payload: { note } })
  })

export const deleteNote = note => dispatch =>
  note.destroy().then(() => {
    dispatch({ type: DELETE_NOTE, payload: { note } })
  })
