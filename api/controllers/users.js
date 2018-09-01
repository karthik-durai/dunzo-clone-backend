const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Order = require('../models/orders')
const { privateKey } = require('../../secrets/jwtPrivateKey')
const { oauth2Client, oauth2, url } = require('../../oAuth/oAuthGoogle')

function serveAppropriatePage (req, res, next, jwToken, statusCode) {
  if (req.isSignedIn) {
    if (jwToken) {
      // res.cookie('access_token', jwToken, { httpOnly: true })
    }
    //  res.redirect('http://localhost:8000/user/placeOrders')
  } else {
    //  res.redirect('http://localhost:8000/login')
  }
}

async function placeOrder (req, res) {
  try {
    if (req.isSignedIn) {
      let order = new Order({
        description: req.body.description,
        user: (await User.findOne({ emailID: req.emailID }).exec())._id
      })
      await order.save()
      //  res.redirect('http://localhost:8000/orders/showOrders')
    }
  } catch (err) {
    console.error('err0r:', err)
    // send message to user that order didn't get placed
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
      serveAppropriatePage(req, res, null, jwToken, 200)
    }
  } catch (error) {
    console.log(error)
    serveAppropriatePage(req, res, null, jwToken, 500)
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

async function signoutUser (req, res) {
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

function getLoginURLAndSend (req, res) {
  res.status(200).json({url: url})
}

async function getOrdersAndSend (req, res) {
  try {
    let orders = await Order.find().exec()
    res.json({ message: orders })
  } catch (err) {
    res.json({ message: 'no records found' })
  }
}

async function getOrderDetailsAndSend (req, res) {
  console.log(req)
  // try {
  //   let orderDetails = await Order.findOne({ description: req.body.description }).exec()
  //   console.log(orderDetails)
  //   res.json({ details: orderDetails })
  // } catch (err) {
  //   res.json({ message: 'no details found' })
  // }
}

module.exports = {
  handleUserInfo,
  placeOrder,
  signoutUser,
  serveAppropriatePage,
  getLoginURLAndSend,
  getOrdersAndSend,
  getOrderDetailsAndSend
}
