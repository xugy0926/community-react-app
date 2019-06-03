const R = require('ramda')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const nodemailer = require('nodemailer')
const marked = require('marked')
const config = require('config')

const transporter = nodemailer.createTransport({
  host: config.get('email').host,
  port: config.get('email').port,
  secure: false,
  auth: {
    user: config.get('email').fromAddress,
    pass: config.get('email').password
  }
})

Parse.Cloud.job('task', () => {
  setTimeout(async () => {
    const User = Parse.Object.extend('_User')
    const queryUser = new Parse.Query(User)
    const Note = Parse.Object.extend('Note')
    const queryNote = new Parse.Query(Note)
    const Project = Parse.Object.extend('Project')
    const queryProject = new Parse.Query(Project)

    const users = await queryUser.find(null, { useMasterKey: true })

    for (let i = 0; i < users.length; i++) {
      queryNote.equalTo('author', users[i])
      const notes = await queryNote.find({ useMasterKey: true })
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

      const html = ejs.render(
        fs.readFileSync(path.join(__dirname, '../../views/report/html.ejs'), 'utf-8'),
        { projects, appName: config.get('appName') }
      )
      const message = {
        from: config.get('email').fromAddress,
        to: 'gaoyang.xu@alibaba-inc.com',
        subject: 'Daily Report',
        html
      }
      transporter.sendMail(message, console.log)
    }
  }, 1000)
})
