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
    cart = cart.products.map(async product => {
      const newProduct = await Product.findById(product.productID);
      newProduct.quantity = product.quantity;
      return newProduct;
    });
    products = await Promise.all(cart);
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

  res.status(200).render('shopping_cart.pug', {
    title: 'My Cart',
    products,
    productsTotal,
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

exports.updateCart = catchAsync(async (req, res, next) => {
  const userID = req.user.id;
  const { productName, quantity } = req.body;

  const { id } = await Product.findOne({ title: productName });

  let cart = await Cart.findOne({ user: userID });

  const existingProduct = cart.products.find(product => product.productID === id);
  if (existingProduct || quantity > 0) {
    existingProduct.quantity = quantity;
  }

  if (quantity === 0) cart.products = cart.products.filter(product => product.quantity > 0);

  await cart.save();
  res.status(200).json({
    status: 'success',
  });
});
