Parse.Cloud.beforeSave('Comment', request => {
  const { object: comment, user } = request

  if (!user) {
    return Promise.reject(new Error('需要登录'))
  }

  if (!comment.id) {
    const roleACL = new Parse.ACL()
    roleACL.setPublicReadAccess(true)
    roleACL.setWriteAccess(user, true)
    comment.setACL(roleACL)
    comment.set('author', user)
    comment.set('authorName', user.get('username'))
  }

  return Promise.resolve(comment)
})
