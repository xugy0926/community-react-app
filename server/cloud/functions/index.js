const R = require('ramda')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const marked = require('marked')

const config = require('config')

const { send } = require('../../mail')

Parse.Cloud.define('dailyReport', async request => {
  const { params, user } = request

  const { email } = params

  if (!user) {
    throw new Error('需要登录')
  }

  if (!email) {
    throw new Error('需要邮箱')
  }

  try {
    const Note = Parse.Object.extend('Note')
    const queryNote = new Parse.Query(Note)
    const Project = Parse.Object.extend('Project')
    const queryProject = new Parse.Query(Project)

    queryNote.equalTo('author', user)
    const notes = await queryNote.find({ useMasterKey: true })

    if (notes.length < 1) {
      return '没有内容可以发送'
    }

    const projects = []
    for (let j = 0; j < notes.length; j++) {
      const note = notes[j].toJSON()
      note.content = marked(note.content)
      const has = !!R.find(R.propEq('objectId', note.parent.objectId), projects)
      if (has) {
        const index = R.findIndex(R.propEq('objectId', note.parent.objectId))(projects)
        projects[index].children.push(note)
      } else {
        queryProject.equalTo('objectId', note.parent.objectId)
        const parent = await queryProject
          .first({ useMasterKey: true })
          .then(project => project.toJSON())
        parent.children = [note]
        projects.push(parent)
      }
    }

    if (projects.length < 1) {
      return '没有内容可以发送'
    }

    const html = ejs.render(
      fs.readFileSync(path.join(__dirname, '../../views/report/html.ejs'), 'utf-8'),
      { projects, appName: config.get('appName') }
    )
    const message = {
      to: email,
      subject: 'Daily Report',
      html
    }

    await send(message)
  } catch (err) {
    throw new Error(err.message)
  }

  return '发送成功'
})
