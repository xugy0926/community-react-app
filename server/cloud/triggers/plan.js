Parse.Cloud.beforeSave('Plan', request => {
  const { object: plan, user } = request

  if (!user) {
    return Promise.reject(new Error('需要登录'))
  }

  if (!plan.id) {
    const roleACL = new Parse.ACL()
    roleACL.setPublicReadAccess(true)
    roleACL.setWriteAccess(user, true)
    plan.setACL(roleACL)
    plan.set('author', user)
    plan.set('authorName', user.get('username'))
  }

  return Promise.resolve(plan)
})
