const jwt = require('jsonwebtoken')
const {privateKey} = require('../../secrets/jwtPrivateKey')
const User = require('../models/users')

async function authenticate (req, res, next) {
  try {
    var decodedJWT = jwt.verify(req.cookies.access_token, privateKey)
    req.isSignedIn = await checkForJWT(decodedJWT)
    req.emailID = decodedJWT.email
  } catch (error) {
    console.error(error)
    req.isSignedIn = false
  }
  next()
}

async function checkForJWT (userinfo) {
  try {
    let searchResult = (await User.findOne({ emailID: userinfo.email }).exec())
    if (searchResult && searchResult.jwt) {
      return true
    }
    return false
  } catch (error) {
    console.log(error)
  }
}

module.exports = { authenticate }
