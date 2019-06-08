const Rx = require('rx')
const moment = require('moment')

const { interval } = Rx.Observable

const report = () => {
  interval(1000 * 60 * 60).subscribe(() => {
    if (moment().hours() === 18) {
      const Plan = Parse.Object.extend('Plan')
      const queryPlan = new Parse.Query(Plan)
      queryPlan.find(null, { useMasterKey: true }).then(plans => {
        plans.forEach(plan => {
          Parse.Cloud.startJob('dailyReport', {
            author_id: plan.get('author').id,
            author_email: plan.get('author_email')
          }).catch(err => console.log(err.message))
        })
      })
    }
  })
}

const send = () => {
  interval(10 * 60 * 1000).subscribe(() => {
    Parse.Cloud.startJob('sendMail').catch(err => console.log(err.message))
  })
}

const start = () => {
  report()
  send()
}

module.exports = { start }
