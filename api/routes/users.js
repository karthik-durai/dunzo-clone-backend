const router = require('express').Router()
const urlEncodedParser = require('body-parser').urlencoded({ extended: false })
const usersController = require('../controllers/users')
const { authenticate } = require('../authentication/authenticate')

router.get('/', authenticate, usersController.serveOrdersPage)
router.get('/oauthcallback', usersController.handleUserInfo)
router.post('/placeorder', authenticate, urlEncodedParser, usersController.placeOrder)
router.get('/getOrders', usersController.getOrders)
router.get('/signout', authenticate, usersController.signout)
router.get('/loginURL', usersController.giveLoginURL)

module.exports = router
