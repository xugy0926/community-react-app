const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const config = require('config')

const { send } = require('../../mail')

const Report = Parse.Object.extend('Report')
const queryReport = new Parse.Query(Report)

Parse.Cloud.job('sendMail', async request => {
  try {
    queryReport.equalTo('send', false)
    const report = await queryReport.first({ useMasterKey: true })
    if (!report) {
      return '全部发送完'
    }

    const reportJSON = report.toJSON()

    const html = ejs.render(
      fs.readFileSync(path.join(__dirname, '../../views/report/html.ejs'), 'utf-8'),
      { report: reportJSON, appName: config.get('appName') }
    )
    const message = {
      to: reportJSON.author_email,
      subject: reportJSON.title,
      html
    }

    await report.save({ send: true }, { useMasterKey: true })
    await send(message)
  } catch (err) {
    console.log(err)
    throw err
  }

  return '发送成功'
})
