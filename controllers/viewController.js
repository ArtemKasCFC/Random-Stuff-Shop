const stripe = require('stripe')(process.env.STRIPE_KEY);
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('overview', {
    title: 'Just Buy Something',
    products,
  });
});

exports.getProductPage = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  //.populate({
  //   path: 'reviews',
  //   fields: 'review rating user'
  // });
  if (!product) return next(new AppError('There is no product with this name', 404));

  res.status(200).render('product', {
    title: `${product.title}`,
    product,
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login Form',
  });
};

exports.getCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });
  let products;
  let productsTotal;
  if (cart) {
    cart.products = cart.products.filter(product => product.quantity > 0);
    const arrayWithProd = cart.products.map(async product => {
      const newProduct = await Product.findById(product.productID);
      newProduct.quantity = product.quantity;
      return newProduct;
    });
    products = await Promise.all(arrayWithProd);
    productsTotal = products.reduce((obj, cur) => {
      let total = 0,
        discount = 0,
        final = 0;
      total = cur.price * cur.quantity;
      obj.total = (obj.total || 0) + total;
      if (cur.priceDiscount) {
        discount += cur.priceDiscount * cur.quantity;
        obj.discount = (obj.discount || 0) + total;
      } else {
        obj.discount = 0;
      }
      final = total - discount;
      obj.final = (obj.final || 0) + final;
      return obj;
    }, {});
  }
  if (cart) await cart.save();

  res.status(200).render('shopping_cart.pug', {
    title: 'My Cart',
    products,
    productsTotal,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const { productName, quantity } = req.body;

  const { title, id, price } = await Product.findOne({ title: productName });

  let cart = await Cart.findOne({ user: userID });

  if (!cart) cart = new Cart({ user: userID, products: [] });

  const existingProduct = cart.products.find(product => product.productID === id);
  if (existingProduct?.quantity === 99) {
    console.log('Max items were added');
  } else if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ productID: id, title, quantity, price });
  }

  if (existingProduct?.quantity > 99) {
    console.log('Max items - 99');
    existingProduct.quantity = 99;
  }

  await cart.save();
  res.status(200).json({
    status: 'success',
  });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const { productName, quantity } = req.body;

  const { id } = await Product.findOne({ title: productName });

  let cart = await Cart.findOne({ user: userID });

  const existingProduct = cart.products.find(product => product.productID === id);
  if (existingProduct && quantity > 0) {
    existingProduct.quantity = quantity;
  }

  await cart.save();
  res.status(200).json({
    status: 'success',
  });
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const cart = await Cart.findOne({ user: userID });

  const sessionArray = cart.products.map(product => {
    sessionObject = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
        },
        unit_amount_decimal: +(product.price * product.quantity).toFixed(2) * 100,
      },
      quantity: +product.quantity,
    };
    return sessionObject;
  });

  const session = await stripe.checkout.sessions.create({
    line_items: sessionArray,
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
  });

  res.status(200).json({
    status: 'success',
    session,
  });
});
