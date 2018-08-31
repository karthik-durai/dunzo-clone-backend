const router = require('express').Router()
const urlEncodedParser = require('body-parser').urlencoded({ extended: false })
const { authenticate } = require('../authentication/authenticate')
const usersController = require('../controllers/users')

// doesn't need authentication middleware
router.get('/oauthcallback', usersController.handleUserInfo)
router.get('/getOrders', usersController.getOrders)
router.get('/getOrderDetails', usersController.getOrderDetails)
router.get('/getLoginURL', usersController.getLoginURL)

// Needs authentication middleware
router.post('/placeorder', authenticate, urlEncodedParser, usersController.placeOrder)
router.get('/signout', authenticate, usersController.signout)

module.exports = router
