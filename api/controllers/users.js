const {clientCredentials} = require('../../secrets/googleOauthCredentials')
const {google} = require('googleapis')
const { privateKey } = require('../../secrets/jwtPrivateKey')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

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

async function getToken (req, res) {
  try {
    let tokenObj = await oauth2Client.getToken(req.query.code)
    oauth2Client.setCredentials(tokenObj.tokens)
    oauth2.userinfo.v2.me.get((error, info) => { handleUserInfo(error, info, req, res) })
  } catch (error) {
    console.log(error)
  }
}

async function handleUserInfo (error, info, req, res) {
  console.log(req.cookies)
  if (error) {
    console.error(error)
  } else {
    console.log(info.data)
    let token = jwt.sign({name: info.data.name, email: info.data.email}, privateKey)
    let result = await handleUserRecord(info.data, token)
    res.cookie('access_token', token, { httpOnly: true })
    res.status(200).json({ message: 'login successful', result })
  }
}

async function handleUserRecord (userinfo, token) {
  try {
    let user = new User({
      name: userinfo.name,
      emailID: userinfo.email,
      jwt: token
    })
    let result = await user.save()
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { getToken, sendSigninLink, url }
