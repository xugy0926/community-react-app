const R = require('ramda')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

Parse.Cloud.job('task', () => {
  setTimeout(async () => {
    const User = Parse.Object.extend('_User')
    const queryUser = new Parse.Query(User)
    const Note = Parse.Object.extend('Note')
    const queryNote = new Parse.Query(Note)

    const users = await queryUser.find(null, { useMasterKey: true })

    for (let i = 0; i < users.length; i++) {
      queryNote.equalTo('author', users[i])
      const notes = await queryNote.find({ useMasterKey: true })
      const projects = []
      for (let j = 0; j < notes.length; j++) {
        const has = !!R.find(R.propEq('id', notes[i].get('parent').id), projects)

        if (has) {
          const index = R.findIndex(R.propEq('id', notes[i].get('parent').id))(projects)
          projects[index].childrend.push(notes[i])
        } else {
          const parent = notes[i].get('parent').toJSON()
          parent.clidren = [notes[i]]
          projects.push(parent)
        }
      }

      const str = ejs.render(
        fs.readFileSync(path.join(__dirname, '../../views/report/html.ejs'), 'utf-8'),
        { projects, appName: 'hello' }
      )
      console.log(str)
    }
  }, 1000)
})
