const router = require('express').Router()
const usersController = require('../controllers/users')
const { authenticate } = require('../authentication/authenticate')

router.get('/oauthcallback', usersController.handleUserInfo)
router.post('/placeorder', authenticate, usersController.placeOrder)
router.get('/', authenticate, usersController.serveOrdersPage)
router.get('/signout', authenticate, usersController.signout)

module.exports = router
