Parse.Cloud.beforeSave('Project', request => {
  const { object: project, user } = request
  if (!project.id) {
    const roleAcl = new Parse.ACL()
    roleAcl.setPublicReadAccess(true)
    roleAcl.setWriteAccess(user, true)
    const role = new Parse.Role(project.get('title'), roleAcl)
    return role
      .save(null, { useMasterKey: true })
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
        return project
      })
  }

  return Promise.resolve(project)
})
