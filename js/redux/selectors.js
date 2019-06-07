const R = require('ramda')

export const header = store => store.app.header
export const footer = store => store.app.footer
export const currentUser = store => (store.app.user ? store.app.user : null)
export const loading = store => store.posts.loading
export const more = store => store.posts.more
export const keyWord = store => store.posts.keyWord
export const posts = store => store.posts.posts
export const postsCount = store => store.posts.posts.length
export const notes = (store, projectId) =>
  store.notes.projectId === projectId ? store.notes.notes : []
export const projects = store => store.projects.projects
