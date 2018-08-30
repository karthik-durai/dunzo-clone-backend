const {clientCredentials} = require('../../secrets/googleOauthCredentials')
const {google} = require('googleapis')
const {privateKey} = require('../../secrets/jwtPrivateKey')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const path = require('path')

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
  scope: scopes
})

function handleHomePageRequest (req, res, next) {
  if (req.isSignedIn) {
    serveOrdersPage(req, res)
  } else {
    console.log('serve login page')
    res.redirect(301, 'http://localhost:8080/userLogin.html')
  }
}

function serveOrdersPage (req, res, next, jwToken) {
  if (req.isSignedIn) {
    if (jwToken) {
      res.cookie('access_token', jwToken, { httpOnly: true })
    }
    res.redirect(301, 'http://localhost:8080/orders.html')
  } else {
    res.redirect(301, 'http://localhost:8080/userLogin.html')
  }
}

function placeOrder (req, res) {
  if (req.isSignedIn) {
    res.status(200).json({ message: 'you can place your order' })
  } else {
    res.status(401).json({ message: 'looks like you are not signed in, please sign in to continue', link: url })
  }
}

async function handleUserInfo (req, res) {
  try {
    let tokenObj = await getAccessToken(req, res)
    if (tokenObj) {
      oauth2Client.setCredentials(tokenObj.tokens)
      let userInfo = await getUserInfo()
      let jwToken = jwt.sign({name: userInfo.data.name, email: userInfo.data.email}, privateKey)
      await handleUserRecord(userInfo.data, jwToken)
      req.isSignedIn = true
      serveOrdersPage(req, res, null, jwToken)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'login not successful'})
  }
}

async function getAccessToken (req, res) {
  try {
    let tokenObj = await oauth2Client.getToken(req.query.code)
    return tokenObj
  } catch (error) {
    return null
  }
}

function getUserInfo () {
  return new Promise((resolve, reject) => {
    oauth2.userinfo.v2.me.get((error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(info)
      }
    })
  })
}

async function handleUserRecord (userinfo, token) {
  try {
    let dbSearchResult = await User.findOne({ emailID: userinfo.email }).exec()
    if (!dbSearchResult) {
      let user = new User({
        name: userinfo.name,
        emailID: userinfo.email,
        profilePicture: userinfo.picture,
        jwt: token
      })
      return (await user.save())
    }
    return (await User.update({ emailID: userinfo.email }, { jwt: token, recentSignedIn: Date.now() }))
  } catch (error) {
    return new Error(error)
  }
}

async function signout (req, res) {
  if (req.isSignedIn) {
    let deletion = await deleteJWTValue(req.emailID)
    if (deletion) {
      res.clearCookie('access_token', { path: '/' })
      res.status(200).json({ message: 'you have been logged out successfully, to login please click on the link', link: url })
    }
    res.status(500).json({ message: 'logged out operation was unsuccessfull' })
  } else {
    res.status(401).json({ message: 'you are not logged in and you can login by clicking on the link', link: url })
  }
}

async function deleteJWTValue (emailID) {
  try {
    await User.update({ emailID: emailID }, { jwt: null })
    return true
  } catch (error) {
    return false
  }
}

function giveLoginURL (req, res) {
  res.status(200).json({url: url})
}

module.exports = {
  handleUserInfo,
  placeOrder,
  url,
  signout,
  handleHomePageRequest,
  serveOrdersPage,
  giveLoginURL
}
