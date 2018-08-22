const router = require('express').Router()
const usersController = require('../controllers/users')

router.get('/', usersController.sendSigninLink)
router.get('/oauthcallback', usersController.getToken)

module.exports = router
