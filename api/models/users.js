const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailID: { type: String, required: true },
  profilePicture: { type: String, default: null },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  pastOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  jwt: { type: String, default: null },
  firstSignedIn: { type: Date, default: Date() },
  recentSignedIn: { type: Date, default: Date() }
})

module.exports = mongoose.model('User', userSchema)
