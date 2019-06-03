module.exports = {
  clientURL: 'http://localhost:3000',
  port: 1337,
  appName: process.env.APP_NAME || 'My Parse Server App',
  mountPath: process.env.MOUNT_PATH || '/parse',
  dashboardPath: process.env.DASHBOARD_PATH || '/dashboard',
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/parse-dev',
  cloud: process.env.CLOUD || `${process.cwd()}/cloud/main.js`,
  appId: process.env.APP_ID || 'myAppId',
  restKey: process.env.REST_KEY || 'myRestKey',
  javascriptKey: process.env.JAVASCRIPT_KEY || 'myJavaScriptKey',
  masterKey: process.env.MASTER_KEY || 'myMasterKey',
  readOnlyMasterKey: process.env.READ_ONLY_MASTER_KEY || 'readOnlyMasterKey',
  fileKey: process.env.FILE_KEY || 'optionalFileKey',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  email: {
    fromAddress: '',
    user: '',
    password: '',
    host: '',
    port: 465
  },
  github: {
    clientID: '0400a5abbb43bf86d659',
    clientSecret: 'a02a8ba54b4cb7e1c729750699d120eef6f30be4',
    callbackURL: 'http://d9ad1a54.ngrok.io/github/callback'
  },
  monitoringData: ['Post'],
  dashboardUsers: [
    {
      user: 'admin',
      pass: 'pass'
    },
    {
      user: 'user',
      pass: 'pass',
      readOnly: true
    }
  ],
  useEncryptedPasswords: false,
  verifyGithubAccount: false,
  verifyUserEmails: false
}
