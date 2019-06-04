const nodemailer = require('nodemailer')
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

const send = function(message) {
  message.from = config.get('email').fromAddress
  return transporter.sendMail(message)
}

module.exports = { send }
