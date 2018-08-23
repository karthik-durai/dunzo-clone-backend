const {clientCredentials} = require('../../googleOauthCredentials')
const {google} = require('googleapis')

const redirectURI = 'http://localhost:8000/user/oauthcallback'

const scopes = ['https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
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
  access_type: 'offline',
  scope: scopes
})

function sendSigninLink (req, res) {
  console.log(url)
}

function getToken (req, res) {
  oauth2Client.getToken(req.query.code).then(obj => {
    oauth2Client.setCredentials(obj.tokens)
    oauth2.userinfo.v2.me.get((err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
        res.status(200).json({message: 'login successfull'})
      }
    })
  })
}

module.exports = { getToken, sendSigninLink, url }
