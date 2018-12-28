const R = require('ramda')
export const header = store => store.app.header
export const footer = store => store.app.footer
export const login = store => (store.app.user ? true : false)
export const currentUser = store => (store.app.user ? store.app.user : null)
export const currentUserId = store => (store.app.user ? store.app.user.id : '')
export const currentUserName = store => (store.app.user ? store.app.user.get('username') : '')
export const currentUserEmail = store => (store.app.user ? store.app.user.get('email') : '')
export const more = store => store.app.more
export const posts = store => store.posts
export const postsCount = store => store.posts.length
export const onePost = (store, id) => R.find(R.propEq('id', id))(store.posts)
