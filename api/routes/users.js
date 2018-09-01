const router = require('express').Router()
const urlEncodedParser = require('body-parser').urlencoded({ extended: false })
const usersController = require('../controllers/users')
const { authenticate } = require('../../middlewares/authenticate')

// doesn't need authentication middleware
router.get('/oauthcallback', usersController.handleUserInfo)
router.get('/getLoginURL', usersController.getLoginURLAndSend)

// Needs authentication middleware
router.get('/getOrders', authenticate, usersController.getOrdersAndSend)
router.get('/getOrderDetails', authenticate, usersController.getOrderDetailsAndSend)
router.get('/signout', authenticate, usersController.signoutUser)
router.post('/placeorder', urlEncodedParser, authenticate, usersController.placeOrder)

module.exports = router
