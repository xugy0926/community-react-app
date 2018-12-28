const config = require('config')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const ejsMate = require('ejs-mate')
const ParseServer = require('parse-server').ParseServer
const ParseDashboard = require('parse-dashboard')

const github = require('./github')

const api = new ParseServer(config.get('parse'))
const dashboard = new ParseDashboard(config.get('dashboard'), { allowInsecureHTTP: true })

const app = express()
const httpServer = require('http').createServer(app)

app.set('views', './views')
app.set('view engine', 'html')
app.engine('html', ejsMate)
app.locals._layoutFile = 'layout.html'
app.locals.config = config

app.use(cors())
app.use(bodyParser.json())
app.use(github.auth)
app.get('/github/auth', github.authenticate)
app.get('/github/callback', github.authenticate, github.callback)

app.use(config.get('mountPath'), api)
app.use(config.get('dashboardPath'), dashboard)

httpServer.listen(config.get('port'))
ParseServer.createLiveQueryServer(httpServer)
