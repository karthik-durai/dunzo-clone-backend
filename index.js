const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { authenticate } = require('./api/authentication/authenticate')
const { handleHomePageRequest } = require('./api/controllers/users')

const usersRoute = require('./api/routes/users')

app.use(bodyParser.json())
app.use(cookieParser())

app.use('/', authenticate,
  handleHomePageRequest,
  express.static(path.join(__dirname, 'view', 'public')))

app.use('/user', usersRoute)

mongoose.connect('mongodb://localhost:27017/dunzoClone', { useNewUrlParser: true })

let db = mongoose.connection

db.on('open', () => { console.log('connected to dunzo clone db') })

app.listen(8000, () => console.log('listening on port 8000'))
