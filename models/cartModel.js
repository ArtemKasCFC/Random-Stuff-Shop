const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: [true, 'Cart must have a user'] },
  products: [{ productID: String, title: String, quantity: Number, price: Number }],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
