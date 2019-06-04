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
  secure: true,
  auth: {
    user: config.get('email').fromAddress,
    pass: config.get('email').password
  }
})

Parse.Cloud.job('dailyReport', request => {
  console.log(request)

  const { params, message, user } = request

  const { email } = params.input

  message('dailyReport started')

  setTimeout(async () => {
    try {
      const Note = Parse.Object.extend('Note')
      const queryNote = new Parse.Query(Note)
      const Project = Parse.Object.extend('Project')
      const queryProject = new Parse.Query(Project)

      queryNote.equalTo('author', user)
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

      if (projects.length < 1) {
        return
      }

      const html = ejs.render(
        fs.readFileSync(path.join(__dirname, '../../views/report/html.ejs'), 'utf-8'),
        { projects, appName: config.get('appName') }
      )
      const message = {
        from: config.get('email').fromAddress,
        to: email,
        subject: 'Daily Report',
        html
      }
      transporter.sendMail(message)
    } catch (err) {
      console.log(err)
    }
  }, 1000)
})
