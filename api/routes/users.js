const router = require('express').Router()
const usersController = require('../controllers/users')
const { authenticate } = require('../authentication/authenticate')

router.get('/oauthcallback', usersController.getToken)
router.post('/placeorder', authenticate, usersController.placeOrder)
//  router.get('/showOrders', authenticate, usersController.showOrders)
//  router.get('/trackOrder', authenticate)
router.get('/', authenticate, usersController.serveOrdersPage)
router.get('/signout', authenticate, usersController.signout)

module.exports = router
