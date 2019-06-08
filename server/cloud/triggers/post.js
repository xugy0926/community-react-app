Parse.Cloud.beforeSave('Post', request => {
  const { object: post, user } = request

  if (!user) {
    return Promise.reject(new Error('需要登录'))
  }

  if (!post.id) {
    const roleACL = new Parse.ACL()
    roleACL.setPublicReadAccess(true)
    roleACL.setWriteAccess(user, true)
    post.setACL(roleACL)
    post.set('author', user)
    post.set('authorName', user.get('username'))
  }

  return Promise.resolve(post)
})
