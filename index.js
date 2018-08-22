const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

app.listen(8000, () => console.log('listening on port 8000'))

app.post('/authtoken', (req, res) => {
  console.log(req.body)
})