const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const usersRoute = require('./api/routes/users')

app.use(bodyParser.json())
app.use(cors())

app.use('/', express.static(path.join(__dirname, 'view', 'public')))

app.listen(8000, () => console.log('listening on port 8000'))
