import Parse from 'parse'
import { message } from 'antd'
import {
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
  LOAD_NOTES,
  UPDATE_NOTE,
  DELETE_NOTE
} from './actionTypes'

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

const handleError = err => {
  const { code, messge } = err
  if (code && code === Parse.Error.INVALID_SESSION_TOKEN) {
    Parse.User.logOut()
    message.error('登录已过期，请重新登录')
  } else {
    message.error(messge)
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

export const logout = () =>
  new Promise(resolve => {
    Parse.User.logOut()
    resolve({
      type: UPDATE_CURRENT_USER,
      payload: {
        user: null
      }
    })
  })

export const updateAccount = user =>
  new Promise(resolve => {
    resolve({
      type: UPDATE_CURRENT_USER,
      payload: {
        user
      }
    })
  })

export const updateMore = more => ({
  type: UPDATE_MORE,
  payload: {
    more
  }
})

export const loadPosts = () => (dispatch, getState) => {
  postQuery.skip(getState().posts.posts.length)
  postQuery.matches('title', getState().posts.keyWord)
  dispatch(updateLoading(true))
  postQuery
    .find()
    .then(posts => dispatch({ type: LOAD_POSTS, payload: { posts } }))
    .catch(handleError)
    .finally(() => {
      dispatch(updateLoading(false))
    })
}

export const updatePost = ({ post, title, content }) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const { user } = getState().app
    if (!user) {
      message.error('没有登录信息!')
      reject()
    }

    if (!title || title.length < 4) {
      message.error('标题最少 4 个字')
      reject()
      return
    }

    if (!content || content.length < 10) {
      message.error('内容最少 10 个字')
      reject()
      return
    }

    post.set({
      title,
      content,
      author: getState().app.user,
      authorName: getState().app.user.username
    })

    if (!post.id) {
      const roleACL = new Parse.ACL()
      roleACL.setPublicReadAccess(true)
      roleACL.setWriteAccess(getState().app.user, true)
      post.setACL(roleACL)
    }

    dispatch(updateLoading(true))

    post
      .save()
      .then(post => {
        resolve()
        dispatch({ type: UPDATE_POST, payload: { post } })
      })
      .catch(err => {
        reject(handleError(err))
      })
      .finally(() => {
        dispatch(updateLoading(false))
      })
  })

export const updateKeyWord = keyWord => ({
  type: UPDATE_KEY_WORD,
  payload: {
    keyWord
  }
})

// projects
export const loadProjects = () => dispatch => {
  projectQuery
    .find()
    .then(projects => dispatch({ type: LOAD_PROJECTS, payload: { projects } }))
    .catch(handleError)
}

export const updateProject = project => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    if (!project.id) {
      const roleACL = new Parse.ACL()
      roleACL.setReadAccess(getState().app.user, true)
      roleACL.setWriteAccess(getState().app.user, true)
      project.setACL(roleACL)
      project.set('author', getState().app.user)
    }

    dispatch(updateLoading(true))

    project
      .save()
      .then(project => {
        dispatch({ type: UPDATE_PROJECT, payload: { project } })
        resolve()
      })
      .catch(err => {
        reject(handleError(err))
      })
  })

export const deleteProject = project => dispatch =>
  new Promise((resolve, reject) => {
    project
      .destroy()
      .then(() => {
        dispatch({ type: DELETE_PROJECT, payload: { project } })
        resolve()
      })
      .catch(err => {
        reject(handleError(err))
      })
  })

// notes
export const loadNotes = project => dispatch => {
  noteQuery.equalTo('parent', project)
  noteQuery
    .find()
    .then(notes => dispatch({ type: LOAD_NOTES, payload: { notes } }))
    .catch(handleError)
}

export const updateNote = note => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    if (!note.id) {
      const roleACL = new Parse.ACL()
      roleACL.setReadAccess(getState().app.user, true)
      roleACL.setWriteAccess(getState().app.user, true)
      note.setACL(roleACL)
      note.set('author', getState().app.user)
    }

    dispatch(updateLoading(true))

    note
      .save()
      .then(note => {
        dispatch({ type: UPDATE_NOTE, payload: { note } })
        resolve()
      })
      .catch(err => {
        reject(handleError(err))
      })
  })

export const deleteNote = note => dispatch =>
  new Promise((resolve, reject) => {
    note
      .destroy()
      .then(() => {
        dispatch({ type: DELETE_NOTE, payload: { note } })
        resolve()
      })
      .catch(err => {
        reject(handleError(err))
      })
  })
