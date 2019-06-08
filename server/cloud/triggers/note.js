const moment = require('moment')

Parse.Cloud.beforeSave('Note', request => {
  const { object: note, user } = request
  if (!user) {
    return Promise.reject(new Error('需要登录'))
  }

  const projectId = note.get('parent').id

  if (!projectId) {
    return Promise.reject(new Error('无 projectId'))
  }

  if (!note.id) {
    const Project = Parse.Object.extend('Project')
    const projectQuery = new Parse.Query(Project)
    const roleQuery = new Parse.Query(Parse.Role)
    projectQuery.equalTo('objectId', projectId)
    return projectQuery
      .first({ useMasterKey: true })
      .then(project => roleQuery.get(project.get('roleId'), { useMasterKey: true }))
      .then(role => {
        const roleACL = new Parse.ACL()
        roleACL.setReadAccess(role, true)
        roleACL.setReadAccess(user, true)
        roleACL.setWriteAccess(user, true)
        note.setACL(roleACL)
        note.set('author', user)
        note.set(`${note.get('type')}_time`, moment().format())
        return note
      })
  }

  return Promise.resolve(note)
})
