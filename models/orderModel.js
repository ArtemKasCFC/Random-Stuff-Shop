const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: { type: mongoose.Schema.ObjectId, ref: 'Cart' },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must have a user'],
  },
  totalPrice: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.Model('Order', orderSchema);

module.exports = Order;
