const R = require('ramda')

export const header = store => store.app.header
export const footer = store => store.app.footer
export const login = store => !!store.app.user
export const currentUser = store => (store.app.user ? store.app.user : null)
export const currentUserId = store => (store.app.user ? store.app.user.id : '')
export const currentUserName = store => (store.app.user ? store.app.user.get('username') : '')
export const currentUserEmail = store => (store.app.user ? store.app.user.get('email') : '')
export const loading = store => store.posts.loading
export const more = store => store.posts.more
export const keyWord = store => store.posts.keyWord
export const posts = store => store.posts.posts
export const postsCount = store => store.posts.posts.length
export const onePost = (store, id) => R.find(R.propEq('id', id), store.posts.posts)
export const notes = store => store.notes.notes
export const projects = store => store.projects.projects
export const oneProject = (store, id) => R.find(R.propEq('id', id), store.projects.projects)
