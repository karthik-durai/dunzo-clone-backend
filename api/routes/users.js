const router = require('express').Router()
const usersController = require('../controllers/users')

router.post('/authtoken', usersController.getUserProfile)

module.exports = router
