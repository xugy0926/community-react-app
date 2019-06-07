const nanoid = require('nanoid')

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
        return project
      })
  }

  return Promise.resolve(project)
})

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
        return note
      })
  }

  return Promise.resolve(note)
})
