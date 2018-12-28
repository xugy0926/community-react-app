const config = require('config')
const passport = require('passport')
const GitHubStrategy = require('passport-github').Strategy
const authenticate = passport.authenticate('github', { failureRedirect: '/' })
const randomize = require('randomatic')

function auth(req, res, next) {
  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  passport.use(
    new GitHubStrategy(config.get('github'), function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken
      done(null, profile)
    })
  )

  passport.initialize()(req, res, next)
}

const TokenStorage = Parse.Object.extend('TokenStorage')

const restrictedAcl = new Parse.ACL()
restrictedAcl.setPublicReadAccess(false)
restrictedAcl.setPublicWriteAccess(false)

const newGitHubUser = function(profile) {
  const user = new Parse.User()
  user.set('username', profile.name)
  user.set('email', profile.email)
  user.set('avatar', profile.avatar_url)
  user.set('password', randomize('*', 10))

  return user
    .signUp()
    .then(user => {
      const ts = new TokenStorage()
      ts.set('githubId', profile.id)
      ts.set('githubLogin', profile.githubLogin)
      ts.set('accessToken', profile.accessToken)
      ts.set('user', user)
      ts.setACL(restrictedAcl)
      return ts.save(null, { useMasterKey: true })
    })
    .then(() => {
      return upsertGitHubUser(profile)
    })
}

const upsertGitHubUser = function(profile) {
  const query = new Parse.Query(TokenStorage)
  query.equalTo('githubId', profile.id && profile.id.toString())
  query.ascending('createdAt')
  return query.first({ useMasterKey: true }).then(tokenData => {
    if (!tokenData) {
      return newGitHubUser(profile)
    }

    const user = tokenData.get('user')
    return user
      .fetch({ useMasterKey: true })
      .then(user => {
        if (profile.accessToken !== tokenData.get('accessToken')) {
          tokenData.set('accessToken', profile.accessToken)
        }

        return tokenData.save(null, { useMasterKey: true }).then(() => user)
      })
      .then(user => {
        const password = randomize('*', 10)
        user.setPassword(password)
        return user.save(null, { useMasterKey: true }).then(user => {
          return Parse.User.logIn(user.get('username'), password)
        })
      })
      .then(user => user)
  })
}

const callback = function(req, res) {
  const profile = req.user && req.user._json
  profile.accessToken = req.user.accessToken

  if (!(profile.email && profile.name && profile.id && profile.accessToken && profile.login)) {
    res.send('Invalid github data')
    return
  }

  upsertGitHubUser(profile)
    .then(user => {
      res.redirect(`${config.get('clientURL')}/token.html?s=${user.getSessionToken()}`)
    })
    .catch(error => {
      res.send(JSON.stringify(error))
    })
}

module.exports = { auth, authenticate, callback, newGitHubUser }
