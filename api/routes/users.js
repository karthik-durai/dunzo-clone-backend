const router = require('express').Router()
const usersController = require('../controllers/users')
const { authenticate } = require('../authentication/authenticate')

router.get('/', authenticate, usersController.serveOrdersPage)
router.get('/oauthcallback', usersController.handleUserInfo)
router.post('/placeorder', authenticate, usersController.placeOrder)
router.get('/signout', authenticate, usersController.signout)
router.get('/loginURL', usersController.giveLoginURL)

module.exports = router
