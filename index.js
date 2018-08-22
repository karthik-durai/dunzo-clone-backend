const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const usersRoute = require('./api/routes/users')

app.use(bodyParser.json())
app.use(cors())

app.use('/api/users', usersRoute)

app.listen(8000, () => console.log('listening on port 8000'))