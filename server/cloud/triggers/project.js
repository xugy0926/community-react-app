const nanoid = require('nanoid')

Parse.Cloud.beforeSave('Project', request => {
  const { object: project, user } = request

  if (!user) {
    return Promise.reject(new Error('需要登录'))
  }

  const title = project.get('title')

  if (!title) {
    return Promise.reject(new Error('无 title'))
  }

  if (!project.id) {
    const roleAcl = new Parse.ACL()
    roleAcl.setPublicReadAccess(true)
    roleAcl.setWriteAccess(user, true)
    const role = new Parse.Role(nanoid(10), roleAcl)
    return role
      .save({ title }, { useMasterKey: true })
      .then(role =>
        role
          .getUsers()
          .add(user)
          .save(null, { useMasterKey: true })
          .then(() => role)
      )
      .then(role => {
        const roleACL = new Parse.ACL()
        roleACL.setReadAccess(role, true)
        roleACL.setWriteAccess(user, true)
        project.setACL(roleACL)
        project.set('roleId', role.id)
        project.set('author', user)
        return project
      })
  }

  return Promise.resolve(project)
})
