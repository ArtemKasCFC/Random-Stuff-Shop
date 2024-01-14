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
  console.log(cart);
  if (cart) {
    cart = cart.products.map(async product => {
      const productObj = await Product.findById(product.productID);
      productObj.quantity = product.quantity;
      return productObj;
    });
  }
  res.status(200).render('shopping_cart.pug', {
    title: 'My Cart',
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const { productName, quantity } = req.body;

  const { id } = await Product.findOne({ title: productName });

  let cart = await Cart.findOne({ user: userID });

  if (!cart) cart = new Cart({ user: userID, products: [] });

  const existingProduct = cart.products.find(product => product.productID === id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.products.push({ productID: id, quantity });
  }

  await cart.save();
  res.status(200).json({
    status: 'success',
  });
});
