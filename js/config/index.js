const dev = process.env.NODE_ENV
console.log('------');
console.log(dev);
const config = require(`./${dev}`)
module.exports = config
