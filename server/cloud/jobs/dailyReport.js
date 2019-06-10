const R = require('ramda')
const marked = require('marked')
const moment = require('moment')

const Note = Parse.Object.extend('Note')
const queryNote = new Parse.Query(Note)

const Project = Parse.Object.extend('Project')
const queryProject = new Parse.Query(Project)

const Report = Parse.Object.extend('Report')
const queryReport = new Parse.Query(Report)

Parse.Cloud.job('dailyReport', async request => {
  const { params } = request

  const { author_email, author_id } = params

  if (!author_email || !author_id) {
    throw new Error('需要邮箱或用户')
  }

  try {
    const User = Parse.Object.extend('User')
    const queryUser = new Parse.Query(User)
    queryUser.equalTo('objectId', author_id)
    const user = await queryUser.first({ useMasterKey: true })

    if (!user) {
      throw new Error('需要用户')
    }

    // find notes
    queryNote.equalTo('author', user)
    queryNote.descending('type')
    queryNote.notContainedIn('type', ['achive'])
    const notes = await queryNote.find({ useMasterKey: true })

    if (notes.length < 1) {
      return '没有内容可以发送'
    }

    const reportInfo = {
      time: moment().format('YYYY-MM-DD'),
      author_id: user.id,
      author_name: user.get('username'),
      author_email,
      title: `${user.get('username')}'s Daily Report`,
      send: false
    }

    const projects = {}

    for (let j = 0; j < notes.length; j++) {
      const note = notes[j].toJSON()
      const projectId = note.parent.objectId
      note.content = marked(note.content)
      const has = R.has(projectId)(projects)
      if (has) {
        if (!projects[projectId].notes[note.type]) projects[projectId].notes[note.type] = []
        projects[projectId].notes[note.type].push(note)
      } else {
        queryProject.equalTo('objectId', note.parent.objectId)
        const project = await queryProject
          .first({ useMasterKey: true })
          .then(project => project.toJSON())
        projects[projectId] = project
        projects[projectId].notes = {}
        projects[projectId].notes[note.type] = [note]
      }
    }

    reportInfo.projects = projects

    queryReport.equalTo('time', moment().format('YYYY-MM-DD'))
    queryReport.equalTo('author_id', user.id)
    let report = await queryReport.first({ useMasterKey: true })
    report = report || new Report()

    if (!report.id) {
      const roleACL = new Parse.ACL()
      roleACL.setReadAccess(user, true)
      roleACL.setWriteAccess(user, true)
      report.setACL(roleACL)
      report.set('author', user)
      report.set('authorName', user.get('username'))
    }

    await report.save({ ...reportInfo }, { useMasterKey: true })
  } catch (err) {
    return err
  }

  return '发送成功'
})
