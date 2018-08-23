const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  runner: { type: mongoose.Schema.Types.ObjectId, ref: 'Runner' },
  status: { type: String, required: true, default: 'placed' },
  placedOn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', orderSchema)
