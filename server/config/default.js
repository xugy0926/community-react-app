const path = require('path')
const defer = require('config/defer').deferConfig

module.exports = {
  clientURL: undefined,
  port: undefined,
  appName: undefined,
  mountPath: undefined,
  dashboardPath: undefined,
  databaseURI: undefined,
  cloud: undefined,
  appId: undefined,
  restKey: undefined,
  javascriptKey: undefined,
  masterKey: undefined,
  readOnlyMasterKey: undefined,
  fileKey: undefined,
  serverURL: undefined,
  email: {
    fromAddress: undefined,
    user: undefined,
    password: undefined,
    host: undefined,
    port: undefined
  },
  github: {
    clientID: undefined,
    clientSecret: undefined,
    callbackURL: undefined
  },
  monitoringData: [undefined],
  dashboardUsers: [
    {
      user: undefined,
      pass: undefined
    }
  ],
  useEncryptedPasswords: undefined,
  verifyGithubAccount: undefined,
  verifyUserEmails: undefined,
  parse: defer(function() {
    return Object.assign(
      {
        appName: this.appName,
        databaseURI: this.databaseURI,
        appId: this.appId,
        restKey: this.restKey,
        javascriptKey: this.javascriptKey,
        masterKey: this.masterKey,
        fileKey: this.fileKey,
        serverURL: this.serverURL,
        publicServerURL: this.serverURL,
        cloud: this.cloud,
        verifyUserEmails: this.verifyUserEmails,
        liveQuery: { classNames: this.monitoringData }
      },
      this.verifyUserEmails
        ? {
            emailAdapter: {
              module: 'simple-parse-smtp-adapter',
              options: Object.assign(
                {
                  name: this.appName,
                  emailField: false,
                  templates: {
                    resetPassword: {
                      //Path to your template
                      template: path.join(__dirname, '../views/email/reset-password'),
                      //Subject for this email
                      subject: 'Reset your password'
                    },
                    verifyEmail: {
                      template: path.join(__dirname, '../views/email/verify-email'),
                      subject: 'Verify your Email'
                    }
                  }
                },
                this.email
              )
            }
          }
        : {}
    )
  }),
  dashboard: defer(function() {
    return {
      apps: [
        {
          appName: this.appName,
          serverURL: this.serverURL,
          appId: this.appId,
          masterKey: this.masterKey,
          readOnlyMasterKey: this.readOnlyMasterKey,
          restKey: this.restKey
        }
      ],
      users: this.dashboardUsers,
      useEncryptedPasswords: this.useEncryptedPasswords
    }
  })
}
