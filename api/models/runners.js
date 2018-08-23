const mongoose = require('mongoose')

const runnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailID: { type: String, required: true },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  pastOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  jwt: { type: String, required: true, default: null }
})

module.exports = mongoose.model('Runner', runnerSchema)
