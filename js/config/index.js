const dev = process.env.NODE_ENV
const config = require(`./${dev}`)
module.exports = config
