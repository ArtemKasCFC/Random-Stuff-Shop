const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: [true, 'Cart must have a user'] },
  products: [{ productID: String, quantity: Number }],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
