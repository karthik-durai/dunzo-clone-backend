const {google} = require('googleapis')
const {clientCredentials} = require('../secrets/googleOauthCredentials')

const redirectURI = 'http://localhost:8000/user/oauthcallback'

const scopes = ['https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile'
]

const oauth2Client = new google.auth.OAuth2(
  clientCredentials.clientID,
  clientCredentials.clientSecret,
  redirectURI
)

const oauth2 = google.oauth2({
  auth: oauth2Client,
  version: 'v2'
})

const url = oauth2Client.generateAuthUrl({
  scope: scopes
})

module.exports = {
  oauth2Client,
  oauth2,
  url
}
